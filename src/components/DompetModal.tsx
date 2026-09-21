import { FontAwesome5 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DompetModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const db = useSQLiteContext();
  const [wallets, setWallets] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);


  const [walletId, setWalletId] = useState<number | null>(null);
  const [provider, setProvider] = useState('DANA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);

  // === State Viewer QR & WhatsApp ===
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [phoneTarget, setPhoneTarget] = useState('');
  const [showQrViewer, setShowQrViewer] = useState(false);
  const [showWaPrompt, setShowWaPrompt] = useState(false);

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

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Account number saved to clipboard ✅");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setQrImage(result.assets[0].uri);
    }
  };

  const handleSimpan = () => {
    if (!provider || !accountNumber || !accountName) {
      Alert.alert("Error", "Isi semua data bang!");
      return;
    }
    try {
      if (walletId) {
        db.runSync('UPDATE wallets SET provider = ?, account_number = ?, account_name = ?, qr_image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [provider, accountNumber, accountName, qrImage, walletId]);
      } else {
        db.runSync('INSERT INTO wallets (provider, account_number, account_name, qr_image_path) VALUES (?, ?, ?, ?)', [provider, accountNumber, accountName, qrImage]);
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

  const getCardStyle = (prov: string) => {
    const p = prov.toUpperCase();
    if (p.includes('DANA')) return { bg: '#3b82f6', icon: 'mobile-alt' };
    if (p.includes('GOPAY')) return { bg: '#10b981', icon: 'motorcycle' };
    if (p.includes('OVO')) return { bg: '#9333ea', icon: 'ring' };
    if (p.includes('BCA')) return { bg: '#1e3a8a', icon: 'university' };
    if (p.includes('MANDIRI')) return { bg: '#eab308', icon: 'university' };
    if (p.includes('SHOPEE')) return { bg: '#f97316', icon: 'shopping-bag' };
    return { bg: '#1f2937', icon: 'wallet' }; 
  };

  // === FITUR SHARE & SAVE QR CODE AMAN DI EXPO GO ===
  const downloadQR = async (imageUri: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }
      // Membuka menu share sistem di mana user bisa pilih "Save to Photos/Files"
      await Sharing.shareAsync(imageUri);
    } catch (error) {
      Alert.alert("Error", "Gagal membuka menu simpan gambar.");
    }
  };

  // === FITUR SEND TO WHATSAPP ===
  const sendToWhatsApp = async () => {
    if (!phoneTarget) {
      Alert.alert("Target Blank", "Please enter a valid WhatsApp number.");
      return;
    }
    
    let formattedPhone = phoneTarget.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.substring(1);

    const message = `*Payment Details Request* 💼\n\nHello, here are my payment details as requested:\n\n🏦 *Bank/Provider:* ${selectedWallet?.provider}\n👤 *Account Name:* ${selectedWallet?.account_name}\n💳 *Account Number:* ${selectedWallet?.account_number}\n\n_Thank you for your business. Please confirm once the transaction is completed._ 🚀`;
    
    const url = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        setShowWaPrompt(false);
        setPhoneTarget('');
      } else {
        Alert.alert("Error", "WhatsApp is not installed on this device.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not open WhatsApp.");
    }
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
                          <TouchableOpacity onPress={() => { setSelectedWallet(wallet); setShowWaPrompt(true); }} style={[styles.actionBtn, {backgroundColor: '#22c55e', marginRight: 5}]}><FontAwesome5 name="whatsapp" size={14} color="#fff" /></TouchableOpacity>
                          <TouchableOpacity onPress={() => handleEdit(wallet)} style={styles.actionBtn}><FontAwesome5 name="pen" size={12} color="#fff" /></TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(wallet.id)} style={[styles.actionBtn, {backgroundColor: '#ef4444', marginLeft: 5}]}><FontAwesome5 name="trash" size={12} color="#fff" /></TouchableOpacity>
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

                        {/* TAMPILAN MINI QR (BISA DI-TAP) */}
                        {wallet.qr_image_path && (
                          <TouchableOpacity onPress={() => { setSelectedWallet(wallet); setShowQrViewer(true); }} style={styles.qrBox}>
                            <Text style={styles.qrTitle}>TAP UNTUK LIHAT QRIS</Text>
                            <View pointerEvents="none"><Image source={{ uri: wallet.qr_image_path }} style={styles.qrImgMini} blurRadius={2} /></View>
                            <View style={styles.qrOverlayIcon}><FontAwesome5 name="search-plus" size={24} color="#111827" /></View>
                          </TouchableOpacity>
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

      {/* 💡 SUB-MODAL 1: QR CODE VIEWER FULL SCREEN */}
      <Modal visible={showQrViewer} transparent animationType="fade">
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={{flex: 1, width: '100%'}} activeOpacity={1} onPress={() => setShowQrViewer(false)} />
          
          <View style={styles.qrPigora}>
            <View style={styles.qrPigoraHeader}>
              <Text style={styles.qrPigoraTitle}>{selectedWallet?.provider}</Text>
              <Text style={styles.qrPigoraSub}>{selectedWallet?.account_name}</Text>
            </View>
            
            {selectedWallet?.qr_image_path && (
              <Image source={{ uri: selectedWallet.qr_image_path }} style={styles.qrPigoraImage} />
            )}
            
            <View style={styles.qrPigoraActions}>
              <TouchableOpacity onPress={() => downloadQR(selectedWallet?.qr_image_path)} style={styles.btnDownload}>
                <FontAwesome5 name="share-alt" size={14} color="#111827" />
                <Text style={styles.btnDownloadText}>Save / Share QR</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowQrViewer(false)} style={styles.btnClosePigora}>
            <FontAwesome5 name="times" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, width: '100%'}} activeOpacity={1} onPress={() => setShowQrViewer(false)} />
        </View>
      </Modal>

      {/* 💡 SUB-MODAL 2: WHATSAPP PROMPT */}
      <Modal visible={showWaPrompt} transparent animationType="fade">
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={{flex: 1, width: '100%'}} activeOpacity={1} onPress={() => setShowWaPrompt(false)} />
          
          <View style={styles.waPromptBox}>
            <View style={styles.waIconWrap}><FontAwesome5 name="whatsapp" size={30} color="#25D366" /></View>
            <Text style={styles.waTitle}>Kirim Detail Tagihan</Text>
            <Text style={styles.waSub}>Kirim detail {selectedWallet?.provider} lu pakai bahasa Inggris otomatis via WhatsApp.</Text>
            
            <TextInput value={phoneTarget} onChangeText={setPhoneTarget} placeholder="Masukin nomor WA (cth: 0812...)" keyboardType="phone-pad" style={styles.waInput} />
            
            <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
              <TouchableOpacity onPress={() => setShowWaPrompt(false)} style={styles.waBtnBatal}><Text style={styles.waBtnBatalText}>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendToWhatsApp} style={styles.waBtnKirim}><Text style={styles.waBtnKirimText}>Launch WA</Text></TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={{flex: 1, width: '100%'}} activeOpacity={1} onPress={() => setShowWaPrompt(false)} />
        </View>
      </Modal>

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
  cardActions: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', gap: 4, zIndex: 10 },
  actionBtn: { width: 35, height: 35, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  cardIconBox: { width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardProvider: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  cardName: { fontSize: 10, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  accountBox: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accountNumber: { fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  copyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  
  qrBox: { backgroundColor: '#fff', borderRadius: 20, padding: 15, alignItems: 'center', marginTop: 15, position: 'relative', overflow: 'hidden' },
  qrTitle: { fontSize: 10, fontWeight: '900', color: '#1f2937', letterSpacing: 1, marginBottom: 10 },
  qrImgMini: { width: '100%', height: 60, opacity: 0.3, resizeMode: 'cover' },
  qrOverlayIcon: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', top: 20 },

  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 30, borderWidth: 1, borderColor: '#f3f4f6' },
  label: { fontSize: 10, fontWeight: '900', color: '#6b7280', letterSpacing: 1, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 15, padding: 15, fontSize: 16, fontWeight: 'bold', color: '#111827' },
  uploadBox: { backgroundColor: '#f9fafb', borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', borderRadius: 20, padding: 30, alignItems: 'center', marginTop: 5 },
  uploadText: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginTop: 10 },
  btnSimpan: { backgroundColor: '#dc2626', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 25 },
  btnSimpanText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  viewerOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  qrPigora: { backgroundColor: '#fff', padding: 20, borderRadius: 32, width: '100%', maxWidth: 360, alignItems: 'center' },
  qrPigoraHeader: { alignItems: 'center', marginBottom: 20 },
  qrPigoraTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
  qrPigoraSub: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', letterSpacing: 1 },
  qrPigoraImage: { width: 250, height: 250, borderRadius: 16 },
  qrPigoraActions: { flexDirection: 'row', gap: 10, marginTop: 25, width: '100%' },
  btnDownload: { flex: 1, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnDownloadText: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
  btnClosePigora: { marginTop: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  
  waPromptBox: { backgroundColor: '#fff', padding: 25, borderRadius: 32, width: '100%', maxWidth: 360, alignItems: 'center' },
  waIconWrap: { width: 60, height: 60, backgroundColor: '#dcf8c6', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  waTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 5 },
  waSub: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
  waInput: { width: '100%', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 15, fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  waBtnBatal: { flex: 1, paddingVertical: 14, backgroundColor: '#f3f4f6', borderRadius: 16, alignItems: 'center' },
  waBtnBatalText: { fontSize: 14, fontWeight: 'bold', color: '#4b5563' },
  waBtnKirim: { flex: 1, paddingVertical: 14, backgroundColor: '#25D366', borderRadius: 16, alignItems: 'center' },
  waBtnKirimText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});