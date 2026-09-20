import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileModal({ visible, onClose, onSuccess, userLevel, userExp, profileImage }: any) {
  const db = useSQLiteContext();
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);

  const pilihFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1, // Kualitas maksimal biar ngga pecah di pigora besar
    });

    if (!result.canceled) {
      try {
        const imageUri = result.assets[0].uri;
        db.runSync("INSERT OR REPLACE INTO settings (key, value) VALUES ('profileImage', ?)", [imageUri]);
        onSuccess(); 
        onClose();
        Alert.alert("Pembaruan Berhasil", "Foto profil Anda telah diperbarui dengan sukses.");
      } catch (error) {
        Alert.alert("Terjadi Kesalahan", "Gagal menyimpan foto ke dalam sistem.");
      }
    }
  };

  const persenExp = userExp % 100;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.bottomSheet}>
          <View style={styles.dragIndicator} />
          
          {/* HEADER PROFIL */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <TouchableOpacity onPress={() => setIsViewingPhoto(true)} style={styles.headerAvatarWrap}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.headerAvatar} />
                ) : (
                  <View style={styles.headerAvatarEmpty}><FontAwesome5 name="user-alt" size={16} color="#9ca3af" /></View>
                )}
                <View style={styles.avatarGlow} />
              </TouchableOpacity>
              <View>
                <Text style={styles.title}>Rixsan Joulfiand</Text>
                <View style={styles.statusRow}>
                  <View style={styles.dotEmerald} />
                  <Text style={styles.statusText}>SISTEM UTAMA AKTIF</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.btnClose}>
              <FontAwesome5 name="times" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* KARTU GAMIFIKASI (HIGH-END HUD STYLE) */}
          <View style={styles.statsCardOuter}>
            <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.statsCard}>
              <View style={styles.glassHighlight} />
              
              <View style={styles.statsTopRow}>
                <View style={styles.badgeLevel}>
                  <FontAwesome5 name="medal" size={12} color="#fbbf24" />
                  <Text style={styles.badgeLevelText}>LEVEL {userLevel}</Text>
                </View>
                <Text style={styles.statsExp}>{userExp} <Text style={{color: '#64748b', fontSize: 10}}>EXP</Text></Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.barBg}>
                  <LinearGradient colors={['#3b82f6', '#10b981']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.barFill, { width: `${persenExp}%` }]} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                  <Text style={styles.progressLabel}>Selesaikan Misi</Text>
                  <Text style={styles.progressLabel}>{100 - persenExp} EXP menuju Lv {userLevel + 1}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* MENU LIST MODERN */}
          <Text style={styles.sectionTitle}>PENGATURAN AKUN</Text>
          <View style={styles.menuContainer}>
            
            {/* Menu 1: Lihat Foto (Netral Dark) */}
            <TouchableOpacity onPress={() => setIsViewingPhoto(true)} style={styles.menuItem}>
              <View style={[styles.iconBox, { backgroundColor: '#f3f4f6' }]}>
                <FontAwesome5 name="expand-arrows-alt" size={16} color="#4b5563" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.menuTitle}>Tampilkan Foto Profil</Text>
                <Text style={styles.menuSub}>Lihat dalam resolusi penuh</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={12} color="#d1d5db" />
            </TouchableOpacity>

            {/* Menu 2: Ubah Foto (Netral Emerald) */}
            <TouchableOpacity onPress={pilihFoto} style={styles.menuItem}>
              <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                <FontAwesome5 name="camera" size={16} color="#059669" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.menuTitle}>Perbarui Foto Profil</Text>
                <Text style={styles.menuSub}>Pilih gambar dari galeri perangkat</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={12} color="#d1d5db" />
            </TouchableOpacity>

          </View>
        </View>
      </View>

      {/* 💡 SUB-MODAL: PIGORA FOTO (TITANIUM & ACRYLIC STYLE) */}
      <Modal visible={isViewingPhoto} transparent animationType="fade">
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={{flex: 1, width: '100%'}} activeOpacity={1} onPress={() => setIsViewingPhoto(false)} />
          
          {/* PIGORA LUAR (Efek Kaca / Acrylic) */}
          <View style={styles.pigoraOuter}>
            {/* PIGORA DALAM (Efek Frame Solid) */}
            <View style={styles.pigoraInner}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.pigoraImage} />
              ) : (
                <View style={styles.pigoraEmpty}>
                  <FontAwesome5 name="user-slash" size={40} color="#6b7280" />
                  <Text style={styles.emptyPhotoText}>Belum Ada Foto Terpasang</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.pigoraCaption}>FOTO PROFIL SAAT INI</Text>

          {/* Tombol Tutup Pigora Premium */}
          <TouchableOpacity onPress={() => setIsViewingPhoto(false)} style={styles.btnClosePigora}>
            <FontAwesome5 name="times" size={18} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={{flex: 1, width: '100%'}} activeOpacity={1} onPress={() => setIsViewingPhoto(false)} />
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10, 15, 25, 0.65)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, paddingHorizontal: 24, elevation: 25 },
  dragIndicator: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 25 },
  
  // HEADER
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#e5e7eb' },
  headerAvatarEmpty: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  avatarGlow: { position: 'absolute', inset: -4, borderRadius: 30, borderWidth: 1, borderColor: '#10b981', opacity: 0.3 },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dotEmerald: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  statusText: { fontSize: 9, fontWeight: '900', color: '#6b7280', letterSpacing: 1 },
  btnClose: { width: 36, height: 36, backgroundColor: '#f9fafb', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  
  // STATS CARD (HUD Style)
  statsCardOuter: { borderRadius: 24, padding: 2, backgroundColor: '#e2e8f0', marginBottom: 25 },
  statsCard: { padding: 20, borderRadius: 22, overflow: 'hidden', position: 'relative' },
  glassHighlight: { position: 'absolute', top: -50, left: -50, width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, opacity: 0.5 },
  statsTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badgeLevel: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 6, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' },
  badgeLevelText: { fontSize: 10, fontWeight: '900', color: '#fbbf24', letterSpacing: 1 },
  statsExp: { fontSize: 20, fontWeight: '900', color: '#fff' },
  progressContainer: { width: '100%' },
  barBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 10, fontWeight: '600', color: '#94a3b8' },
  
  // MENU LIST
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1.5, marginBottom: 12 },
  menuContainer: { gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  menuSub: { fontSize: 11, fontWeight: '500', color: '#6b7280', marginTop: 2 },

  // === STYLE PIGORA FOTO (TITANIUM & ACRYLIC) ===
  viewerOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)', alignItems: 'center', justifyContent: 'center' },
  pigoraOuter: { 
    padding: 8, 
    borderRadius: 40, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Efek kaca luar
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)', // List kaca
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30, elevation: 30 
  },
  pigoraInner: { 
    padding: 2, 
    borderRadius: 34, 
    backgroundColor: '#111827', // Frame gelap dalam
    borderWidth: 1,
    borderColor: '#374151'
  },
  pigoraImage: { width: 300, height: 300, borderRadius: 32, resizeMode: 'cover' },
  pigoraEmpty: { width: 300, height: 300, borderRadius: 32, backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' },
  emptyPhotoText: { marginTop: 15, fontSize: 12, fontWeight: 'bold', color: '#9ca3af', letterSpacing: 1 },
  pigoraCaption: { marginTop: 25, fontSize: 10, fontWeight: '900', color: '#6b7280', letterSpacing: 4 },
  btnClosePigora: { marginTop: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }
});