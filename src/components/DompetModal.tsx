import { FontAwesome5 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const db = SQLite.openDatabaseSync('primenotes.db');

export default function DompetModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [walletId, setWalletId] = useState<number | null>(null);
  const [provider, setProvider] = useState('DANA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);

  // Load Data
  const loadData = () => {
    try {
      const data = db.getAllSync('SELECT * FROM wallets ORDER BY id DESC');
      setWallets(data);
    } catch (error) {
      console.log("Error load wallets:", error);
    }
  };

  useEffect(() => {
    if (visible) loadData();
  }, [visible]);

  // Fungsi Copy Teks
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Berhasil!", "Nomor rekening disalin ke clipboard ✅");
  };

  // Fungsi Buka Galeri HP
const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // <--- GANTI JADI GINI AJA CUY
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setQrImage(result.assets[0].uri); // Simpan path lokal HP nya
    }
  };

  // Fungsi Simpan ke SQLite
  const handleSimpan = () => {
    if (!provider || !accountNumber || !accountName) {
      Alert.alert("Error", "Isi semua data bang!");
      return;
    }

    try {
      if (walletId) {
        db.runSync(
          'UPDATE wallets SET provider = ?, account_number = ?, account_name = ?, qr_image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [provider, accountNumber, accountName, qrImage, walletId]
        );
      } else {
        db.runSync(
          'INSERT INTO wallets (provider, account_number, account_name, qr_image_path) VALUES (?, ?, ?, ?)',
          [provider, accountNumber, accountName, qrImage]
        );
      }
      
      resetForm();
      loadData();
    } catch (error) {
      Alert.alert("Gagal", "Gagal nyimpen data cuy");
    }
  };

  const handleEdit = (item: any) => {
    setWalletId(item.id);
    setProvider(item.provider);
    setAccountNumber(item.account_number);
    setAccountName(item.account_name);
    setQrImage(item.qr_image_path);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus Dompet?", "Yakin mau hapus data ini bro?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => {
          db.runSync('DELETE FROM wallets WHERE id = ?', [id]);
          loadData();
      }}
    ]);
  };

  const resetForm = () => {
    setWalletId(null);
    setProvider('DANA');
    setAccountNumber('');
    setAccountName('');
    setQrImage(null);
    setIsFormOpen(false);
  };

  // Logika Warna Kartu Dinamis
  const getCardStyle = (prov: string) => {
    const p = prov.toUpperCase();
    if (p.includes('DANA')) return { bg: '#3b82f6', icon: 'mobile-alt' };
    if (p.includes('GOPAY')) return { bg: '#10b981', icon: 'motorcycle' };
    if (p.includes('OVO')) return { bg: '#9333ea', icon: 'ring' };
    if (p.includes('BCA')) return { bg: '#1e3a8a', icon: 'university' };
    if (p.includes('MANDIRI')) return { bg: '#eab308', icon: 'university' };
    if (p.includes('SHOPEE')) return { bg: '#f97316', icon: 'shopping-bag' };
    return { bg: '#1f2937', icon: 'wallet' }; // Default Hitam
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => isFormOpen ? resetForm() : onClose()} style={styles.btnBack}>
              <FontAwesome5 name={isFormOpen ? "arrow-left" : "chevron-down"} size={16} color="#4b5563" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.headerTitle}>{isFormOpen ? (walletId ? 'Edit Dompet' : 'Tambah Dompet') : 'Dompet Digital'}</Text>
              <Text style={styles.headerSubtitle}>ASET & PENERIMAAN DANA</Text>
            </View>
            <View style={styles.headerIconBox}>
              <FontAwesome5 name="wallet" size={20} color="#dc2626" />
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* STATE 1: DAFTAR DOMPET */}
            {!isFormOpen ? (
              <View>
                <View style={styles.sectionTitleBox}>
                  <Text style={styles.sectionTitle}><FontAwesome5 name="layer-group" color="#ef4444" /> Koleksi Dompet</Text>
                  <TouchableOpacity onPress={() => setIsFormOpen(true)} style={styles.btnAdd}>
                    <FontAwesome5 name="plus" size={10} color="#fff" />
                    <Text style={styles.btnAddText}>TAMBAH</Text>
                  </TouchableOpacity>
                </View>

                {wallets.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <FontAwesome5 name="box-open" size={40} color="#d1d5db" />
                    <Text style={styles.emptyText}>Belum ada dompet tersimpan.</Text>
                    <Text style={styles.emptySub}>Klik tombol tambah untuk mendaftarkan e-wallet / bank.</Text>
                  </View>
                ) : (
                  wallets.map((wallet) => {
                    const cardTheme = getCardStyle(wallet.provider);
                    return (
                      <View key={wallet.id} style={[styles.card, { backgroundColor: cardTheme.bg }]}>
                        {/* Tombol Aksi */}
                        <View style={styles.cardActions}>
                          <TouchableOpacity onPress={() => handleEdit(wallet)} style={styles.actionBtn}><FontAwesome5 name="pen" size={12} color="#fff" /></TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(wallet.id)} style={[styles.actionBtn, {backgroundColor: '#ef4444'}]}><FontAwesome5 name="trash" size={12} color="#fff" /></TouchableOpacity>
                        </View>

                        {/* Info Dompet */}
                        <View style={styles.cardInfo}>
                          <View style={styles.cardIconBox}><FontAwesome5 name={cardTheme.icon} size={20} color="#fff" /></View>
                          <View>
                            <Text style={styles.cardProvider}>{wallet.provider}</Text>
                            <Text style={styles.cardName}>{wallet.account_name}</Text>
                          </View>
                        </View>

                        {/* Nomor Rekening */}
                        <View style={styles.accountBox}>
                          <Text style={styles.accountNumber}>{wallet.account_number}</Text>
                          <TouchableOpacity onPress={() => copyToClipboard(wallet.account_number)} style={styles.copyBtn}>
                            <FontAwesome5 name="copy" size={16} color="#111827" />
                          </TouchableOpacity>
                        </View>

                        {/* QR Code kalau ada */}
                        {wallet.qr_image_path && (
                          <View style={styles.qrBox}>
                            <Text style={styles.qrTitle}>SCAN QRIS</Text>
                            <Image source={{ uri: wallet.qr_image_path }} style={styles.qrImg} />
                          </View>
                        )}
                      </View>
                    )
                  })
                )}
              </View>
            ) : (
              
              /* STATE 2: FORM TAMBAH/EDIT */
              <View style={styles.formContainer}>
                <Text style={styles.label}>NAMA BANK / E-WALLET</Text>
                <TextInput value={provider} onChangeText={setProvider} placeholder="Cth: DANA, BCA, OVO" style={styles.input} />

                <Text style={styles.label}>NOMOR REKENING / HP</Text>
                <TextInput value={accountNumber} onChangeText={setAccountNumber} placeholder="Cth: 08123456789" keyboardType="numeric" style={styles.input} />

                <Text style={styles.label}>ATAS NAMA</Text>
                <TextInput value={accountName} onChangeText={setAccountName} placeholder="Cth: Rixsan Joulfiand" style={styles.input} />

                <Text style={styles.label}>UPLOAD QRIS (OPSIONAL)</Text>
                <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
                  {qrImage ? (
                    <>
                      <FontAwesome5 name="check-circle" size={30} color="#10b981" />
                      <Text style={[styles.uploadText, {color: '#10b981'}]}>QR Siap Disimpan! (Klik buat ganti)</Text>
                      <Image source={{ uri: qrImage }} style={{width: 100, height: 100, marginTop: 10, borderRadius: 10}} />
                    </>
                  ) : (
                    <>
                      <FontAwesome5 name="cloud-upload-alt" size={40} color="#9ca3af" />
                      <Text style={styles.uploadText}>Pilih foto dari Galeri HP</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSimpan} style={styles.btnSimpan}>
                  <FontAwesome5 name="save" size={16} color="#fff" />
                  <Text style={styles.btnSimpanText}>Simpan Dompet Asli</Text>
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
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
  headerSubtitle: { fontSize: 10, fontWeight: 'bold', color: '#6b7280', letterSpacing: 1, marginTop: 2 },
  headerIconBox: { width: 45, height: 45, backgroundColor: '#fef2f2', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  
  content: { padding: 20 },
  sectionTitleBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#1f2937' },
  btnAdd: { flexDirection: 'row', backgroundColor: '#111827', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 6 },
  btnAddText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  emptyBox: { backgroundColor: '#fff', borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb', borderRadius: 20, padding: 30, alignItems: 'center' },
  emptyText: { fontSize: 14, fontWeight: 'bold', color: '#6b7280', marginTop: 15 },
  emptySub: { fontSize: 10, color: '#9ca3af', marginTop: 5, textAlign: 'center' },

  card: { borderRadius: 30, padding: 20, marginBottom: 20, elevation: 5 },
  cardActions: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', gap: 8, zIndex: 10 },
  actionBtn: { width: 35, height: 35, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  cardIconBox: { width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardProvider: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  cardName: { fontSize: 10, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  accountBox: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountNumber: { fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  copyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  qrBox: { backgroundColor: '#fff', borderRadius: 20, padding: 15, alignItems: 'center', marginTop: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  qrTitle: { fontSize: 10, fontWeight: '900', color: '#1f2937', letterSpacing: 1, marginBottom: 10 },
  qrImg: { width: 150, height: 150, borderRadius: 15, resizeMode: 'contain' },

  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#f3f4f6' },
  label: { fontSize: 10, fontWeight: '900', color: '#6b7280', letterSpacing: 1, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 15, padding: 15, fontSize: 16, fontWeight: 'bold', color: '#111827' },
  uploadBox: { backgroundColor: '#f9fafb', borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', borderRadius: 20, padding: 30, alignItems: 'center', marginTop: 5 },
  uploadText: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginTop: 10 },
  btnSimpan: { backgroundColor: '#dc2626', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 25 },
  btnSimpanText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});