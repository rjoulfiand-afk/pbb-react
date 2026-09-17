import { FontAwesome5 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const db = SQLite.openDatabaseSync('primenotes.db');

export default function PortalModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  // State Navigasi
  const [viewState, setViewState] = useState<'home' | 'lemari' | 'form'>('home');
  const [activeLemari, setActiveLemari] = useState('');

  // State Data
  const [semuaLemari, setSemuaLemari] = useState<string[]>([]);
  const [linksDiLemari, setLinksDiLemari] = useState<any[]>([]);

  // State Form
  const [linkId, setLinkId] = useState<number | null>(null);
  const [inputLemari, setInputLemari] = useState('');
  const [inputJudul, setInputJudul] = useState('');
  const [inputUrl, setInputUrl] = useState('');

  // 🔄 Load Data Lemari Unik
  const loadLemari = () => {
    try {
      const data = db.getAllSync<{lemari: string}>('SELECT DISTINCT lemari FROM portal_links');
      setSemuaLemari(data.map(d => d.lemari));
    } catch (error) {
      console.log("Error load lemari:", error);
    }
  };

  // 🔄 Load Isi Lemari Tertentu
  const loadLinks = (namaLemari: string) => {
    try {
      const data = db.getAllSync('SELECT * FROM portal_links WHERE lemari = ? ORDER BY id DESC', [namaLemari]);
      setLinksDiLemari(data);
      // Kalau pas dihapus ternyata kosong, balik ke home
      if (data.length === 0 && viewState === 'lemari') {
        setViewState('home');
        setActiveLemari('');
        loadLemari();
      }
    } catch (error) {
      console.log("Error load links:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      setViewState('home');
      loadLemari();
    }
  }, [visible]);

  // --- FUNGSI NAVIGASI & AKSI ---
  const bukaLemari = (nama: string) => {
    setActiveLemari(nama);
    setViewState('lemari');
    loadLinks(nama);
  };

  const kembali = () => {
    if (viewState === 'form') {
      if (activeLemari) {
        setViewState('lemari');
        loadLinks(activeLemari);
      } else {
        setViewState('home');
        loadLemari();
      }
    } else if (viewState === 'lemari') {
      setViewState('home');
      setActiveLemari('');
      loadLemari();
    }
  };

  const tambahBaru = () => {
    setLinkId(null);
    setInputLemari(activeLemari || '');
    setInputJudul('');
    setInputUrl('');
    setViewState('form');
  };

  const editLink = (item: any) => {
    setLinkId(item.id);
    setInputLemari(item.lemari);
    setInputJudul(item.judul);
    setInputUrl(item.url);
    setViewState('form');
  };

  const simpan = () => {
    if (!inputLemari || !inputJudul || !inputUrl) {
      Alert.alert("Eits", "Isi dulu semua datanya boss!");
      return;
    }

    const lemariUpper = inputLemari.trim().toUpperCase();

    try {
      if (linkId) {
        db.runSync(
          'UPDATE portal_links SET lemari = ?, judul = ?, url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [lemariUpper, inputJudul, inputUrl, linkId]
        );
      } else {
        db.runSync(
          'INSERT INTO portal_links (lemari, judul, url) VALUES (?, ?, ?)',
          [lemariUpper, inputJudul, inputUrl]
        );
      }
      
      bukaLemari(lemariUpper);
    } catch (error) {
      Alert.alert("Gagal", "Gagal nyimpen link cuy");
    }
  };

  const hapusLink = (id: number) => {
    Alert.alert("Hapus Link?", "Yakin mau hapus tautan ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => {
          db.runSync('DELETE FROM portal_links WHERE id = ?', [id]);
          loadLinks(activeLemari);
      }}
    ]);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Disalin!", "URL berhasil disalin ke clipboard ✅");
  };

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Gagal", "Tautan ngga bisa dibuka cuy, pastiin formatnya bener (pakai https://)");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          
          {/* HEADER DINAMIS */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => viewState !== 'home' ? kembali() : onClose()} style={styles.btnBack}>
              <FontAwesome5 name={viewState !== 'home' ? "arrow-left" : "chevron-down"} size={16} color="#4b5563" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.headerTitle}>
                {viewState === 'home' ? 'Portal Hub' : (viewState === 'lemari' ? `Lemari: ${activeLemari}` : 'Setup Link')}
              </Text>
              <Text style={styles.headerSubtitle}>
                {viewState === 'home' ? 'SHORTCUT & ARSIP' : (viewState === 'lemari' ? 'KUMPULAN TAUTAN PENTING' : 'FORM DATA LINK')}
              </Text>
            </View>
            <View style={styles.headerIconBox}>
              <FontAwesome5 name={viewState === 'home' ? 'rocket' : (viewState === 'lemari' ? 'folder-open' : 'link')} size={20} color="#2563eb" />
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* STATE 1: HOME */}
            {viewState === 'home' && (
              <View>
                {/* Akses Cepat (Shortcuts) */}
                <Text style={styles.sectionLabel}>AKSES CEPAT</Text>
                <View style={styles.shortcutGrid}>
                  <TouchableOpacity onPress={() => openUrl('https://github.com/rjoulfiand-afk')} style={styles.shortcutItem}>
                    <View style={[styles.shortcutIcon, {backgroundColor: '#111827'}]}><FontAwesome5 name="github" size={24} color="#fff" /></View>
                    <Text style={styles.shortcutText}>GitHub</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openUrl('https://instagram.com')} style={styles.shortcutItem}>
                    <View style={[styles.shortcutIcon, {backgroundColor: '#db2777'}]}><FontAwesome5 name="instagram" size={24} color="#fff" /></View>
                    <Text style={styles.shortcutText}>Instagram</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openUrl('https://wa.me')} style={styles.shortcutItem}>
                    <View style={[styles.shortcutIcon, {backgroundColor: '#22c55e'}]}><FontAwesome5 name="whatsapp" size={24} color="#fff" /></View>
                    <Text style={styles.shortcutText}>WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openUrl('https://tiktok.com')} style={styles.shortcutItem}>
                    <View style={[styles.shortcutIcon, {backgroundColor: '#000000'}]}><FontAwesome5 name="tiktok" size={24} color="#fff" /></View>
                    <Text style={styles.shortcutText}>TikTok</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Fitur GoPay App')} style={styles.shortcutItem}>
                    <View style={[styles.shortcutIcon, {backgroundColor: '#3b82f6'}]}><FontAwesome5 name="wallet" size={20} color="#fff" /></View>
                    <Text style={styles.shortcutText}>GoPay</Text>
                  </TouchableOpacity>
                </View>

                {/* Lemari Link Pintar */}
                <View style={styles.sectionTitleBox}>
                  <Text style={styles.sectionLabel}>LEMARI LINK PINTAR</Text>
                  <TouchableOpacity onPress={tambahBaru} style={styles.btnSmall}><Text style={styles.btnSmallText}>+ Link Baru</Text></TouchableOpacity>
                </View>

                {semuaLemari.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <FontAwesome5 name="folder-open" size={40} color="#d1d5db" />
                    <Text style={styles.emptyText}>Lemari masih kosong.</Text>
                  </View>
                ) : (
                  semuaLemari.map((lemari, idx) => (
                    <TouchableOpacity key={idx} onPress={() => bukaLemari(lemari)} style={styles.folderCard}>
                      <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                        <View style={styles.folderIcon}><FontAwesome5 name="folder" size={18} color="#3b82f6" /></View>
                        <View>
                          <Text style={styles.folderTitle}>{lemari}</Text>
                          <Text style={styles.folderSub}>Klik untuk melihat isi link</Text>
                        </View>
                      </View>
                      <FontAwesome5 name="chevron-right" size={14} color="#d1d5db" />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {/* STATE 2: ISI LEMARI */}
            {viewState === 'lemari' && (
              <View>
                <View style={styles.sectionTitleBox}>
                  <Text style={[styles.sectionLabel, {color: '#111827'}]}><FontAwesome5 name="link" color="#3b82f6" /> Isi Lemari Ini</Text>
                  <TouchableOpacity onPress={tambahBaru} style={[styles.btnAdd, {backgroundColor: '#2563eb'}]}>
                    <FontAwesome5 name="plus" size={10} color="#fff" />
                    <Text style={styles.btnAddText}>TAMBAH</Text>
                  </TouchableOpacity>
                </View>

                {linksDiLemari.map((link) => (
                  <View key={link.id} style={styles.linkCard}>
                    <View style={styles.linkActions}>
                      <TouchableOpacity onPress={() => editLink(link)} style={styles.actionBtn}><FontAwesome5 name="pen" size={10} color="#3b82f6" /></TouchableOpacity>
                      <TouchableOpacity onPress={() => hapusLink(link.id)} style={styles.actionBtn}><FontAwesome5 name="trash" size={10} color="#ef4444" /></TouchableOpacity>
                    </View>
                    
                    <View style={{marginBottom: 10}}>
                      <Text style={styles.linkTitle} numberOfLines={1}>{link.judul}</Text>
                      <Text style={styles.linkSub}>TERSIMPAN DI VAULT</Text>
                    </View>

                    <View style={styles.urlBox}>
                      <Text style={styles.urlText} numberOfLines={1}>{link.url}</Text>
                      <View style={{flexDirection: 'row', gap: 8}}>
                        <TouchableOpacity onPress={() => copyToClipboard(link.url)} style={styles.iconBtn}><FontAwesome5 name="copy" size={14} color="#4b5563" /></TouchableOpacity>
                        <TouchableOpacity onPress={() => openUrl(link.url)} style={[styles.iconBtn, {backgroundColor: '#2563eb'}]}><FontAwesome5 name="external-link-alt" size={10} color="#fff" /></TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* STATE 3: FORM */}
            {viewState === 'form' && (
              <View style={styles.formContainer}>
                <Text style={styles.label}>PILIH / BUAT LEMARI BARU</Text>
                <TextInput value={inputLemari} onChangeText={setInputLemari} autoCapitalize="characters" placeholder="Cth: LINK TUGAS KELOMPOK" style={[styles.input, {textTransform: 'uppercase'}]} />
                <Text style={styles.inputHint}>*Ketik nama baru untuk bikin lemari baru, atau samakan dengan yang ada.</Text>

                <Text style={[styles.label, {marginTop: 15}]}>JUDUL LINK (WAJIB JELAS)</Text>
                <TextInput value={inputJudul} onChangeText={setInputJudul} placeholder="Cth: Drive Pengumpulan Pak Adi" style={styles.input} />

                <Text style={[styles.label, {marginTop: 15}]}>URL / TAUTAN ASLI</Text>
                <TextInput value={inputUrl} onChangeText={setInputUrl} placeholder="Cth: https://drive.google.com/..." keyboardType="url" autoCapitalize="none" style={[styles.input, {color: '#2563eb'}]} />

                <TouchableOpacity onPress={simpan} style={styles.btnSimpan}>
                  <FontAwesome5 name="save" size={16} color="#fff" />
                  <Text style={styles.btnSimpanText}>Simpan ke Lemari</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{height: 40}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.7)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#f9fafb', height: '90%', borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden', elevation: 20 },
  
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  btnBack: { width: 45, height: 45, backgroundColor: '#f9fafb', borderRadius: 25, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  headerSubtitle: { fontSize: 10, fontWeight: 'bold', color: '#6b7280', letterSpacing: 1, marginTop: 2 },
  headerIconBox: { width: 45, height: 45, backgroundColor: '#eff6ff', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  
  content: { padding: 20 },
  
  // Shortcuts
  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1, marginBottom: 15 },
  shortcutGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  shortcutItem: { alignItems: 'center', gap: 8 },
  shortcutIcon: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  shortcutText: { fontSize: 9, fontWeight: 'bold', color: '#4b5563' },

  sectionTitleBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  btnSmall: { backgroundColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  btnSmallText: { fontSize: 10, fontWeight: 'bold', color: '#374151' },
  btnAdd: { flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 6, elevation: 2 },
  btnAddText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  emptyBox: { backgroundColor: '#fff', borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb', borderRadius: 20, padding: 30, alignItems: 'center' },
  emptyText: { fontSize: 14, fontWeight: 'bold', color: '#6b7280', marginTop: 15 },

  // Folder
  folderCard: { backgroundColor: '#fff', padding: 20, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  folderIcon: { width: 45, height: 45, backgroundColor: '#eff6ff', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  folderTitle: { fontSize: 14, fontWeight: '900', color: '#1f2937' },
  folderSub: { fontSize: 10, fontWeight: 'bold', color: '#9ca3af', marginTop: 2 },

  // Link Cards
  linkCard: { backgroundColor: '#fff', padding: 20, borderRadius: 25, marginBottom: 15, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
  linkActions: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', gap: 5 },
  actionBtn: { width: 30, height: 30, backgroundColor: '#f9fafb', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 14, fontWeight: '900', color: '#111827', paddingRight: 60 },
  linkSub: { fontSize: 9, fontWeight: 'bold', color: '#9ca3af', letterSpacing: 1, marginTop: 4 },
  urlBox: { backgroundColor: '#f9fafb', borderRadius: 15, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  urlText: { fontSize: 12, fontFamily: 'monospace', color: '#3b82f6', flex: 1, marginRight: 10 },
  iconBtn: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },

  // Form
  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#f3f4f6' },
  label: { fontSize: 10, fontWeight: '900', color: '#6b7280', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 15, padding: 15, fontSize: 14, fontWeight: 'bold', color: '#111827' },
  inputHint: { fontSize: 9, color: '#9ca3af', marginTop: 6, fontStyle: 'italic' },
  btnSimpan: { backgroundColor: '#2563eb', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 25, elevation: 3 },
  btnSimpanText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});