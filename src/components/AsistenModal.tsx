import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 🔥 IMPORT KONEKSI SUPABASE
import { supabase } from '../lib/supabase';

export default function AsistenModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [pesan, setPesan] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [apiHistory, setApiHistory] = useState<any[]>([]);
  const [gambarUri, setGambarUri] = useState<string | null>(null);
  const [gambarBase64, setGambarBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State rahasia buat nampung API Key dari Supabase
  const [cloudApiKey, setCloudApiKey] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const identitasNori = "You are Nori, a highly intelligent and professional AI assistant for Rixsan Joulfiand's Productivity app. You must always address Rixsan as 'Boss Jull'. Use formal, professional, polite, and clear English. You are an expert in programming (React Native, Expo, Tailwind, PHP, SQL) and productivity. Provide structured, informative, and concise answers.";
  
  // === 1. PROSES INIT: LOAD LOKAL & CLOUD ===
  useEffect(() => {
    if (visible) {
      // A. Ambil Memori Chat (Lokal SQLite)
      try {
        const db = SQLite.openDatabaseSync('primenotes_v2.db');
        const chatsRow: any = db.getFirstSync("SELECT value FROM settings WHERE key = 'nori_chats'");
        const historyRow: any = db.getFirstSync("SELECT value FROM settings WHERE key = 'nori_apiHistory'");
        
        if (chatsRow && historyRow) {
          setChats(JSON.parse(chatsRow.value));
          setApiHistory(JSON.parse(historyRow.value));
        } else {
          const initChat = [{ role: 'ai', text: "Systems online. Welcome back, Boss Jull. My neural link is active and ready to assist you.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
          setChats(initChat);
          db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_chats', JSON.stringify(initChat)]);
          db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_apiHistory', JSON.stringify([])]);
        }
      } catch (e) {
        console.log("Error load local memory", e);
      }
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300);

      // B. Ambil API Key Gemini (Cloud Supabase)
      const fetchApiFromCloud = async () => {
        try {
          const { data, error } = await supabase
            .from('app_secrets')
            .select('api_key')
            .eq('service_name', 'gemini')
            .single();
          
          if (data && data.api_key) {
            setCloudApiKey(data.api_key);
          } else if (error) {
            console.log("Supabase Fetch Error:", error.message);
          }
        } catch (err) {
          console.log("Supabase Connection Error:", err);
        }
      };
      
      fetchApiFromCloud();
    }
  }, [visible]);

  // === 2. FUNGSI SIMPAN MEMORI ===
  const saveMemory = (newChats: any[], newHistory: any[]) => {
    try {
      const db = SQLite.openDatabaseSync('primenotes_v2.db');
      setChats(newChats);
      setApiHistory(newHistory);
      db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_chats', JSON.stringify(newChats)]);
      db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['nori_apiHistory', JSON.stringify(newHistory)]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      console.log("Error saving memory Nori", e);
    }
  };

  const hapusMemori = () => {
    Alert.alert("Neural Reset", "Are you sure you want to format Nori's memory banks?", [
      { text: "Cancel", style: "cancel" },
      { text: "Format", style: "destructive", onPress: () => {
          const initChat = [{ role: 'ai', text: "Memory banks formatted successfully, Boss Jull. Awaiting new instructions.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
          saveMemory(initChat, []);
        } 
      }
    ]);
  };

  // === 3. FUNGSI GAMBAR ===
  const pilihGambar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true, 
    });

    if (!result.canceled && result.assets[0].base64) {
      setGambarUri(result.assets[0].uri);
      setGambarBase64(result.assets[0].base64);
    }
  };

  // === 4. FUNGSI UTAMA AI ===
  const kirimPesan = async () => {
    const pesanUser = pesan.trim();
    if (!pesanUser && !gambarBase64) return;

    const perintah = pesanUser.toLowerCase();
    let isShortcut = false;

    if (perintah.includes('open instagram') || perintah.includes('buka ig')) {
      prosesChatLokal(pesanUser, 'Executing protocol: Launching Instagram, Boss Jull.');
      Linking.openURL('https://instagram.com');
      isShortcut = true;
    } else if (perintah.includes('open whatsapp') || perintah.includes('buka wa')) {
      prosesChatLokal(pesanUser, 'Executing protocol: Accessing WhatsApp...');
      Linking.openURL('whatsapp://send?text=Hello');
      isShortcut = true;
    } else if (perintah.includes('open tiktok') || perintah.includes('buka tiktok')) {
      prosesChatLokal(pesanUser, 'Executing protocol: Initializing TikTok, Boss Jull.');
      Linking.openURL('https://tiktok.com');
      isShortcut = true;
    }

    if (isShortcut) {
      setPesan(''); setGambarUri(null); setGambarBase64(null);
      return;
    }

    // 🛑 CEK KONEKSI SUPABASE
    if (!cloudApiKey) {
      const newChats = [...chats, { role: 'user', text: pesanUser, image: gambarUri, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
      newChats.push({ role: 'ai', text: "System Warning, Boss Jull. Unable to establish secure connection to the Cloud Vault. Please verify your internet connection or Supabase configuration.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
      setChats(newChats);
      setPesan(''); setGambarUri(null); setGambarBase64(null);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      return;
    }

    let parts: any[] = [];
    if (pesanUser) parts.push({ text: pesanUser });
    else parts.push({ text: 'Please analyze the visual data provided.' });

    if (gambarBase64) {
      parts.push({ inline_data: { mime_type: "image/jpeg", data: gambarBase64 } });
    }

    const newChats = [...chats, { role: 'user', text: pesanUser, image: gambarUri, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    const newHistory = [...apiHistory, { role: 'user', parts: parts }];
    setChats(newChats);
    
    setPesan(''); setGambarUri(null); setGambarBase64(null);
    setIsLoading(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cloudApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: identitasNori }] },
          contents: newHistory,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        let errorMsg = "A critical system error occurred during API processing.";
        if (data.error?.message?.includes("API key not valid") || data.error?.status === "INVALID_ARGUMENT") {
          errorMsg = "Authentication failure. The API Key retrieved from the Cloud Vault is invalid. Please update the master key in Supabase, Boss Jull.";
        } else if (data.error?.message) {
          errorMsg = `API Exception: ${data.error.message}`;
        }
        throw new Error(errorMsg);
      }

      if (data.candidates && data.candidates.length > 0) {
        const balasan = data.candidates[0].content.parts[0].text;
        newHistory.push({ role: 'model', parts: [{ text: balasan }] });
        newChats.push({ role: 'ai', text: balasan, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
        saveMemory(newChats, newHistory);
      } else {
        throw new Error("Unable to parse a valid response from the cognitive server.");
      }
      
    } catch (error: any) {
      newChats.push({ role: 'ai', text: error.message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
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
          
          {/* HEADER PREMIUM (Gaya Dashboard Dark) */}
          <LinearGradient colors={['#111827', '#1f2937']} style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={onClose} style={styles.btnBack}>
                <FontAwesome5 name="chevron-left" size={14} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.noriProfileBox}>
                <View style={styles.noriAvatar}>
                  <FontAwesome5 name="robot" size={16} color="#fff" />
                  <View style={styles.onlineDot} />
                </View>
                <View>
                  <Text style={styles.noriName}>NORI-AI</Text>
                  <Text style={styles.noriStatus}>{cloudApiKey ? 'VAULT LINKED' : 'OFFLINE'}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={hapusMemori} style={styles.btnReset}>
              <FontAwesome5 name="power-off" size={12} color="#f87171" />
            </TouchableOpacity>
          </LinearGradient>

          {/* AREA CHAT */}
          <ScrollView ref={scrollViewRef} style={styles.chatArea} contentContainerStyle={styles.chatScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.badgePercakapan}>
              <FontAwesome5 name="lock" size={10} color="#9ca3af" style={{marginRight: 6}}/>
              <Text style={styles.badgeText}>Encrypted Channel</Text>
            </View>

            {chats.map((chat, idx) => (
              <View key={idx} style={[styles.chatRow, chat.role === 'user' ? styles.chatRowUser : styles.chatRowAi]}>
                
                {chat.role === 'ai' && (
                  <View style={styles.bubbleAiAvatar}>
                    <FontAwesome5 name="robot" size={12} color="#4b5563" />
                  </View>
                )}

                <View style={styles.bubbleWrapper}>
                  {chat.role === 'user' ? (
                    <LinearGradient colors={['#dc2626', '#b91c1c']} style={styles.bubbleUser}>
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
                    {chat.role === 'user' && <FontAwesome5 name="check-double" size={8} color="#dc2626" style={{marginLeft: 4}} />}
                  </View>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={[styles.chatRow, styles.chatRowAi]}>
                <View style={styles.bubbleAiAvatar}><FontAwesome5 name="robot" size={12} color="#4b5563" /></View>
                <View style={styles.bubbleAi}><ActivityIndicator size="small" color="#dc2626" /></View>
              </View>
            )}
          </ScrollView>

          {/* ORB STATUS */}
          <View style={styles.orbContainer}>
            <View style={styles.orbSpeechBubble}>
              <Text style={styles.orbSpeechText}>{isLoading ? 'Processing Data...' : 'Awaiting Orders.'}</Text>
            </View>
            <LinearGradient colors={isLoading ? ['#f87171', '#dc2626'] : ['#1f2937', '#111827']} style={styles.orbCircle}>
              <FontAwesome5 name="crosshairs" size={20} color={isLoading ? '#fff' : '#ef4444'} solid />
            </LinearGradient>
          </View>

          {/* PREVIEW GAMBAR */}
          {gambarUri && (
            <View style={styles.previewImageContainer}>
              <Image source={{ uri: gambarUri }} style={styles.previewImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.previewImageTitle}>Visual Attached</Text>
                <TouchableOpacity onPress={() => { setGambarUri(null); setGambarBase64(null); }}><Text style={styles.previewImageCancel}>Disconnect</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {/* INPUT AREA */}
          <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
              <TouchableOpacity onPress={pilihGambar} style={styles.btnCamera}>
                <FontAwesome5 name="camera" size={16} color="#6b7280" />
              </TouchableOpacity>
              <TextInput 
                value={pesan} 
                onChangeText={setPesan} 
                placeholder="Initialize command sequence..." 
                placeholderTextColor="#9ca3af" 
                style={styles.textInput}
                editable={!isLoading}
                onSubmitEditing={kirimPesan}
              />
              <TouchableOpacity onPress={kirimPesan} disabled={isLoading || (!pesan.trim() && !gambarUri)} style={[styles.btnSend, (isLoading || (!pesan.trim() && !gambarUri)) && {backgroundColor: '#e5e7eb'}]}>
                {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <FontAwesome5 name="terminal" size={12} color="#fff" />}
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  container: { height: '95%', backgroundColor: '#f9fafb', borderTopLeftRadius: 35, borderTopRightRadius: 35, overflow: 'hidden', elevation: 30 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1f2937', zIndex: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  btnBack: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  noriProfileBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  noriAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', position: 'relative', elevation: 5 },
  onlineDot: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, backgroundColor: '#10b981', borderRadius: 6, borderWidth: 2, borderColor: '#111827' },
  noriName: { fontSize: 16, fontWeight: '900', color: '#f9fafb', letterSpacing: 1 },
  noriStatus: { fontSize: 9, fontWeight: '900', color: '#34d399', letterSpacing: 1.5, marginTop: 2 },
  btnReset: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  
  chatArea: { flex: 1, backgroundColor: '#f3f4f6' },
  chatScrollContent: { paddingHorizontal: 20, paddingBottom: 150, paddingTop: 25 },
  badgePercakapan: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e7eb', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginBottom: 25, borderWidth: 1, borderColor: '#d1d5db' },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' },
  
  chatRow: { flexDirection: 'row', marginBottom: 20, width: '100%' },
  chatRowUser: { justifyContent: 'flex-end' },
  chatRowAi: { justifyContent: 'flex-start' },
  
  bubbleWrapper: { maxWidth: '82%' },
  bubbleAiAvatar: { width: 32, height: 32, borderRadius: 12, backgroundColor: '#e5e7eb', borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center', marginRight: 10, alignSelf: 'flex-end', marginBottom: 15 },
  
  bubbleAi: { backgroundColor: '#ffffff', padding: 15, borderRadius: 20, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e5e7eb', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  textAi: { fontSize: 13, color: '#374151', lineHeight: 22, fontWeight: '500' },
  
  bubbleUser: { padding: 15, borderRadius: 20, borderBottomRightRadius: 4, elevation: 3, shadowColor: '#dc2626', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5 },
  textUser: { fontSize: 13, color: '#ffffff', lineHeight: 22, fontWeight: '600' },
  chatImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  timeText: { fontSize: 9, fontWeight: 'bold', color: '#9ca3af' },

  orbContainer: { position: 'absolute', bottom: 105, right: 20, alignItems: 'flex-end', zIndex: 20 },
  orbSpeechBubble: { backgroundColor: 'rgba(17,24,39,0.9)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderBottomRightRadius: 4, elevation: 5, marginBottom: 10, borderWidth: 1, borderColor: '#374151' },
  orbSpeechText: { fontSize: 10, fontWeight: '900', color: '#f87171', letterSpacing: 0.5 },
  orbCircle: { width: 56, height: 56, borderRadius: 28, elevation: 15, borderWidth: 2, borderColor: '#fca5a5', alignItems: 'center', justifyContent: 'center', shadowColor: '#dc2626', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 10 },

  previewImageContainer: { position: 'absolute', bottom: 95, left: 20, backgroundColor: '#ffffff', padding: 10, borderRadius: 16, elevation: 10, flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  previewImage: { width: 45, height: 45, borderRadius: 10 },
  previewImageTitle: { fontSize: 11, fontWeight: '900', color: '#111827' },
  previewImageCancel: { fontSize: 10, fontWeight: 'bold', color: '#ef4444', marginTop: 2 },

  inputContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: 'rgba(249, 250, 251, 0.95)', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 25, padding: 6, elevation: 8, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  btnCamera: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  textInput: { flex: 1, paddingHorizontal: 15, fontSize: 13, fontWeight: '600', color: '#111827', height: 44 },
  btnSend: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', elevation: 3 },
});