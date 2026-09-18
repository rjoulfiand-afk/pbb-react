import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const db = SQLite.openDatabaseSync('primenotes_v2.db');

export default function AsistenModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [pesan, setPesan] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [apiHistory, setApiHistory] = useState<any[]>([]);
  const [gambarUri, setGambarUri] = useState<string | null>(null);
  const [gambarBase64, setGambarBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  const identitasNori = "Kamu adalah Nori, asisten AI pribadi yang tertanam di dalam aplikasi mobile Productivity milik Rixsan Joulfiand (dipanggil Boss Jull). Gunakan bahasa santai dan gaul (lu/gue atau boss). Kamu ahli dalam programming (React Native, Laravel, Expo, Tailwind) dan hal sehari-hari. Jawab dengan ringkas, proaktif, dan jangan kaku.";
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  // === 1. LOAD MEMORI DARI SQLITE ===
  useEffect(() => {
    if (visible) {
      try {
        const chatsRow: any = db.getFirstSync("SELECT value FROM settings WHERE key = 'nori_chats'");
        const historyRow: any = db.getFirstSync("SELECT value FROM settings WHERE key = 'nori_apiHistory'");
        
        if (chatsRow && historyRow) {
          setChats(JSON.parse(chatsRow.value));
          setApiHistory(JSON.parse(historyRow.value));
        } else {
          // Chat Pertama Nori
          const initChat = [{ role: 'ai', text: "Heii Jull! ✨ Gue Nori, AI Assistant lo. Memori gue udah permanen, mata gue udah aktif buat lihat gambar! Ada yang bisa gue bantu hari ini boss?", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
          setChats(initChat);
          db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_chats', JSON.stringify(initChat)]);
          db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_apiHistory', JSON.stringify([])]);
        }
      } catch (e) {
        console.log("Error load memory Nori", e);
      }
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300);
    }
  }, [visible]);

  // === 2. FUNGSI SIMPAN MEMORI & HAPUS MEMORI ===
  const saveMemory = (newChats: any[], newHistory: any[]) => {
    setChats(newChats);
    setApiHistory(newHistory);
    db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_chats', JSON.stringify(newChats)]);
    db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_apiHistory', JSON.stringify(newHistory)]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const hapusMemori = () => {
    Alert.alert("Reset Memori?", "Yakin mau cuci otak Nori bro?", [
      { text: "Batal", style: "cancel" },
      { text: "Cuci Otak", style: "destructive", onPress: () => {
          const initChat = [{ role: 'ai', text: "Memori gue udah di-reset boss! Salam kenal ulang, gue Nori. Ada yang mau diomongin?", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
          saveMemory(initChat, []);
        } 
      }
    ]);
  };

  // === 3. FUNGSI PILIH GAMBAR ===
  const pilihGambar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true, // Butuh base64 buat dikirim ke Gemini API
    });

    if (!result.canceled && result.assets[0].base64) {
      setGambarUri(result.assets[0].uri);
      setGambarBase64(result.assets[0].base64);
    }
  };

  // === 4. FUNGSI KIRIM PESAN KE GEMINI ===
  const kirimPesan = async () => {
    const pesanUser = pesan.trim();
    if (!pesanUser && !gambarBase64) return;

    // A. Cek Shortcut (Persis Laravel)
    const perintah = pesanUser.toLowerCase();
    let isShortcut = false;

    if (perintah.includes('open instagram') || perintah.includes('buka ig') || perintah.includes('buka instagram')) {
      prosesChatLokal(pesanUser, 'Siap boss! Meluncur ke Instagram sekarang... 🚀📸');
      Linking.openURL('https://instagram.com');
      isShortcut = true;
    } else if (perintah.includes('open whatsapp') || perintah.includes('buka wa') || perintah.includes('buka whatsapp')) {
      prosesChatLokal(pesanUser, 'Dilaksanakan boss! Ngebuka WhatsApp... 💬🚀');
      Linking.openURL('whatsapp://send?text=Halo');
      isShortcut = true;
    } else if (perintah.includes('open tiktok') || perintah.includes('buka tiktok')) {
      prosesChatLokal(pesanUser, 'Gasss boss! Scroll TikTok dulu kita... 🎵🔥');
      Linking.openURL('https://tiktok.com');
      isShortcut = true;
    }

    if (isShortcut) {
      setPesan(''); setGambarUri(null); setGambarBase64(null);
      return;
    }

    // B. Siapin Payload Gemini
    let parts: any[] = [];
    if (pesanUser) parts.push({ text: pesanUser });
    else parts.push({ text: 'Tolong analisis gambar ini boss Nori.' });

    if (gambarBase64) {
      parts.push({ inline_data: { mime_type: "image/jpeg", data: gambarBase64 } });
    }

    // Update UI User Chat
    const newChats = [...chats, { role: 'user', text: pesanUser, image: gambarUri, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    const newHistory = [...apiHistory, { role: 'user', parts: parts }];
    setChats(newChats);
    
    setPesan(''); setGambarUri(null); setGambarBase64(null);
    setIsLoading(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // C. Tembak API Gemini
    try {
      // Pake Gemini 1.5 Flash (Support Multimodal Gambar)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: identitasNori }] },
          contents: newHistory,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      });

      const data = await response.json();
      
      if (response.ok && data.candidates) {
        const balasan = data.candidates[0].content.parts[0].text;
        
        newHistory.push({ role: 'model', parts: [{ text: balasan }] });
        newChats.push({ role: 'ai', text: balasan, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
        
        saveMemory(newChats, newHistory);
      } else {
        throw new Error(data.error?.message || "Nori bingung boss 🤔");
      }
    } catch (error: any) {
      newChats.push({ role: 'ai', text: `Waduh error boss: ${error.message} 😵`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
      setChats(newChats);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const prosesChatLokal = (pesanUser: string, balasanAI: string) => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newChats = [
      ...chats, 
      { role: 'user', text: pesanUser, time: time },
      { role: 'ai', text: balasanAI, time: time }
    ];
    saveMemory(newChats, apiHistory);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        
        <View style={styles.container}>
          
          {/* HEADER NORI */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={onClose} style={styles.btnBack}>
                <FontAwesome5 name="chevron-left" size={14} color="#64748b" />
              </TouchableOpacity>
              <View style={styles.noriProfileBox}>
                <View style={styles.noriAvatar}>
                  <FontAwesome5 name="robot" size={16} color="#ef4444" />
                  <View style={styles.onlineDot} />
                </View>
                <View>
                  <Text style={styles.noriName}>Nori AI</Text>
                  <Text style={styles.noriStatus}>MEMORY ACTIVE</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={hapusMemori} style={styles.btnReset}>
              <FontAwesome5 name="broom" size={12} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* AREA CHAT */}
          <ScrollView ref={scrollViewRef} style={styles.chatArea} contentContainerStyle={styles.chatScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.badgePercakapan}><Text style={styles.badgeText}>Percakapan Tersimpan</Text></View>

            {chats.map((chat, idx) => (
              <View key={idx} style={[styles.chatRow, chat.role === 'user' ? styles.chatRowUser : styles.chatRowAi]}>
                
                {chat.role === 'ai' && (
                  <View style={styles.bubbleAiAvatar}>
                    <FontAwesome5 name="robot" size={12} color="#ef4444" />
                  </View>
                )}

                <View style={styles.bubbleWrapper}>
                  {chat.role === 'user' ? (
                    <LinearGradient colors={['#ef4444', '#e11d48']} style={styles.bubbleUser}>
                      {chat.image && <Image source={{ uri: chat.image }} style={styles.chatImage} />}
                      {chat.text ? <Text style={styles.textUser}>{chat.text}</Text> : null}
                    </LinearGradient>
                  ) : (
                    <View style={styles.bubbleAi}>
                      <Text style={styles.textAi}>{chat.text}</Text>
                    </View>
                  )}
                  
                  <View style={[styles.timeRow, chat.role === 'user' ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start', marginLeft: 10 }]}>
                    <Text style={styles.timeText}>{chat.time}</Text>
                    {chat.role === 'user' && <FontAwesome5 name="check-double" size={8} color="#ef4444" style={{marginLeft: 4}} />}
                  </View>
                </View>
              </View>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <View style={[styles.chatRow, styles.chatRowAi]}>
                <View style={styles.bubbleAiAvatar}><FontAwesome5 name="robot" size={12} color="#ef4444" /></View>
                <View style={styles.bubbleAi}><ActivityIndicator size="small" color="#ef4444" /></View>
              </View>
            )}
          </ScrollView>

          {/* FLOATING ORB NORI (Bawah Kanan) */}
          <View style={styles.orbContainer}>
            <View style={styles.orbSpeechBubble}>
              <Text style={styles.orbSpeechText}>{isLoading ? 'Mikir keras... 🧠' : 'Ready Jull! ✨'}</Text>
            </View>
            <View style={styles.orbCircle}>
              {isLoading ? <FontAwesome5 name="cog" size={24} color="#f43f5e" solid /> : <FontAwesome5 name="robot" size={24} color="#ef4444" solid />}
            </View>
          </View>

          {/* PREVIEW GAMBAR (Di Atas Input) */}
          {gambarUri && (
            <View style={styles.previewImageContainer}>
              <Image source={{ uri: gambarUri }} style={styles.previewImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.previewImageTitle}>Gambar Siap!</Text>
                <TouchableOpacity onPress={() => { setGambarUri(null); setGambarBase64(null); }}><Text style={styles.previewImageCancel}>Batal</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {/* INPUT FORM (Kamera & Text) */}
          <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
              <TouchableOpacity onPress={pilihGambar} style={styles.btnCamera}>
                <FontAwesome5 name="image" size={18} color="#94a3b8" />
              </TouchableOpacity>
              <TextInput 
                value={pesan} 
                onChangeText={setPesan} 
                placeholder="Tanya atau suruh Nori..." 
                placeholderTextColor="#94a3b8" 
                style={styles.textInput}
                editable={!isLoading}
                onSubmitEditing={kirimPesan}
              />
              <TouchableOpacity onPress={kirimPesan} disabled={isLoading || (!pesan.trim() && !gambarUri)} style={styles.btnSend}>
                {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <FontAwesome5 name="paper-plane" size={14} color="#fff" style={{ marginLeft: -2 }} />}
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  container: { height: '92%', backgroundColor: '#f8fafc', borderTopLeftRadius: 35, borderTopRightRadius: 35, overflow: 'hidden', elevation: 25 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 25, paddingBottom: 15, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', zIndex: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  btnBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  noriProfileBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  noriAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fecaca', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, backgroundColor: '#34d399', borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
  noriName: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
  noriStatus: { fontSize: 9, fontWeight: '900', color: '#ef4444', letterSpacing: 1 },
  btnReset: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },

  // Chat Area
  chatArea: { flex: 1, backgroundColor: '#f8fafc' },
  chatScrollContent: { paddingHorizontal: 20, paddingBottom: 140, paddingTop: 20 },
  badgePercakapan: { alignSelf: 'center', backgroundColor: '#e2e8f0', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' },
  
  chatRow: { flexDirection: 'row', marginBottom: 20, width: '100%' },
  chatRowUser: { justifyContent: 'flex-end' },
  chatRowAi: { justifyContent: 'flex-start' },
  
  bubbleWrapper: { maxWidth: '82%' },
  bubbleAiAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: 10, alignSelf: 'flex-end', marginBottom: 15 },
  
  bubbleAi: { backgroundColor: '#fff', padding: 15, borderRadius: 20, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#f1f5f9', elevation: 1 },
  textAi: { fontSize: 14, color: '#334155', lineHeight: 22, fontWeight: '500' },
  
  bubbleUser: { padding: 15, borderRadius: 20, borderBottomRightRadius: 4, elevation: 2 },
  textUser: { fontSize: 14, color: '#fff', lineHeight: 22, fontWeight: '500' },
  chatImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },

  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  timeText: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8' },

  // Orb Nori
  orbContainer: { position: 'absolute', bottom: 100, right: 20, alignItems: 'flex-end', zIndex: 20 },
  orbSpeechBubble: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderBottomRightRadius: 4, elevation: 4, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  orbSpeechText: { fontSize: 11, fontWeight: '900', color: '#ef4444' },
  orbCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', elevation: 10, borderWidth: 3, borderColor: '#ffe4e6', alignItems: 'center', justifyContent: 'center' },

  // Preview Image
  previewImageContainer: { position: 'absolute', bottom: 90, left: 20, backgroundColor: '#fff', padding: 10, borderRadius: 16, elevation: 5, flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 20 },
  previewImage: { width: 50, height: 50, borderRadius: 10 },
  previewImageTitle: { fontSize: 12, fontWeight: 'bold', color: '#1e293b' },
  previewImageCancel: { fontSize: 10, fontWeight: 'bold', color: '#ef4444', marginTop: 2 },

  // Input Box
  inputContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(248, 250, 252, 0.95)' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, padding: 6, elevation: 5, borderWidth: 1, borderColor: '#e2e8f0' },
  btnCamera: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  textInput: { flex: 1, paddingHorizontal: 12, fontSize: 14, fontWeight: '600', color: '#1e293b', height: 44 },
  btnSend: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', elevation: 2 },
});