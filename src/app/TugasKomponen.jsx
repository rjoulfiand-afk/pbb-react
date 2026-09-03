import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, SectionList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import CustomImage from '../components/ui/CustomImage';
import LoginForm from '../components/ui/LoginForm';
import MyButton from '../components/ui/MyButton';
import UserCard from '../components/ui/UserCard';

const dataKatalog = Array.from({ length: 50 }, (_, i) => ({ id: `${i}`, nama: `Produk Digital Ke-${i + 1}` }));
const dataNilai = [
  { title: "Mata Pelajaran Kejuruan", data: ["Pemrograman Web", "Pemrograman Perangkat Bergerak", "Basis Data"] },
  { title: "Mata Pelajaran Umum", data: ["Matematika", "Bahasa Inggris", "Sejarah", "Pendidikan Agama"] }
];

export default function TugasKomponen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modeAktif, setModeAktif] = useState('System Default');
  const [agreed, setAgreed] = useState(false);

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
      
      {/* HEADER DASHBOARD */}
      <View style={styles.headerBox}>
        <Text style={styles.judulHeader}>Dashboard Analitik</Text>
        <Text style={styles.subHeader}>SMKN 10 Surabaya • Developer Mode</Text>
      </View>

      <View style={styles.konten}>
        
        {/* TASK 1 */}
        <Text style={styles.labelTugas}>1. Modul Direktori Anggota</Text>
        <UserCard name="Rixsan Joulfiand" status="Aktif" imageUrl="https://randomuser.me/api/portraits/men/44.jpg" />
        <UserCard name="Santa" status="Alumni" imageUrl="https://randomuser.me/api/portraits/women/44.jpg" />
        <UserCard name="Mikhayla" status="Aktif" imageUrl="https://randomuser.me/api/portraits/women/68.jpg" />

        {/* TASK 2 */}
        <Text style={styles.labelTugas}>2. Antarmuka Login (Pressable)</Text>
        <LoginForm />

        {/* TASK 3 */}
        <Text style={styles.labelTugas}>3. Katalog 50 Produk (FlatList)</Text>
        <View style={styles.listContainer}>
          <FlatList 
            data={dataKatalog} 
            keyExtractor={item => item.id} 
            renderItem={({item}) => <View style={styles.listItem}><Text style={styles.listText}>{item.nama}</Text></View>} 
            nestedScrollEnabled={true}
          />
        </View>

        {/* TASK 4 */}
        <Text style={styles.labelTugas}>4. Modul Pembelajaran (ScrollView)</Text>
        <View style={styles.moduleBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollHoriz} contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}>
            {['React Native', 'UI/UX Design', 'Cybersecurity', 'Database SQL'].map((kat, idx) => (
              <View key={idx} style={styles.chipKategori}><Text style={styles.chipText}>{kat}</Text></View>
            ))}
          </ScrollView>
          <ScrollView style={styles.scrollVert} nestedScrollEnabled={true}>
            <Text style={styles.artikelTeks}>Ini adalah area artikel vertikal. Gulir ke bawah untuk membaca seluruh konten. Materi ini mengajarkan dasar komponen UI, interaksi pengguna, dan optimasi performa dalam pengembangan aplikasi mobile modern. Penerapan Flexbox dan penguasaan State Management sangat krusial di sini.</Text>
          </ScrollView>
        </View>

        {/* TASK 5 & 6 */}
        <Text style={styles.labelTugas}>5 & 6. Tombol Varian & Indikator Jaringan</Text>
        <View style={styles.cardBox}>
          <MyButton title="Fetch Data Server (Buka Modal)" variant="primary" onPress={() => { setModalVisible(true); setTimeout(()=>setModalVisible(false), 2500); }} />
          <MyButton title="Simpan Konfigurasi" variant="success" onPress={() => {}} />
          <MyButton title="Hapus Cache Aplikasi" variant="danger" onPress={() => {}} />
        </View>

        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalIsi}>
              <ActivityIndicator size="large" color="#4C1D95" style={{ marginBottom: 15 }} />
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1F2937' }}>Memuat data server...</Text>
              <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 5 }}>Mohon tunggu sebentar.</Text>
            </View>
          </View>
        </Modal>

        {/* TASK 7 */}
        <Text style={styles.labelTugas}>7. Galeri Foto (CustomImage)</Text>
        <CustomImage source={{ uri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600' }} style={{ width: '100%', height: 200 }} />

        {/* TASK 8 */}
        <Text style={styles.labelTugas}>8. Rekapitulasi Nilai (SectionList)</Text>
        <View style={styles.listContainer}>
          <SectionList
            sections={dataNilai}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <View style={styles.listItem}><Text style={styles.listText}>• {item}</Text></View>}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}><Text style={styles.sectionTitleText}>{title}</Text></View>
            )}
            nestedScrollEnabled={true}
          />
        </View>

        {/* TASK 9 */}
        <Text style={styles.labelTugas}>9. Pengaturan Tema (TouchableOpacity)</Text>
        <View style={styles.rowOpsi}>
          {['Light Mode', 'Dark Mode', 'System Default'].map((opsi) => (
            <TouchableOpacity key={opsi} onPress={() => setModeAktif(opsi)} style={[styles.opsiBtn, modeAktif === opsi && styles.opsiAktif]} activeOpacity={0.7}>
              <Text style={[styles.opsiText, modeAktif === opsi && { color: '#FFFFFF' }]}>{opsi}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TASK 10 */}
        <Text style={styles.labelTugas}>10. Kebijakan Privasi (Switch)</Text>
        <View style={styles.switchBox}>
          <Text style={{ flex: 1, fontSize: 14, color: '#374151', lineHeight: 20, paddingRight: 15 }}>
            Saya menyetujui seluruh <Text style={{fontWeight: 'bold', color: '#4C1D95'}}>Syarat & Ketentuan</Text> pendaftaran.
          </Text>
          <Switch value={agreed} onValueChange={setAgreed} trackColor={{ false: '#E5E7EB', true: '#C4B5FD' }} thumbColor={agreed ? '#4C1D95' : '#FFFFFF'} />
        </View>
        <TouchableOpacity style={[styles.submitFinal, !agreed && { backgroundColor: '#D1D5DB' }]} disabled={!agreed} activeOpacity={0.8}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Kirim Pendaftaran</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

// STYLING KHUSUS TATA LETAK MOBILE
const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#F4F4F9' },
  headerBox: { backgroundColor: '#4C1D95', paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#4C1D95', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8, marginBottom: 20 },
  judulHeader: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },
  subHeader: { color: '#C4B5FD', fontSize: 14, marginTop: 6, fontWeight: '500' },
  konten: { paddingHorizontal: 20 },
  
  labelTugas: { fontSize: 15, fontWeight: '800', color: '#4C1D95', marginTop: 30, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardBox: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, elevation: 1 },
  
  // List Styles
  listContainer: { height: 220, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', elevation: 2 },
  listItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  listText: { fontSize: 15, color: '#374151' },
  sectionHeader: { backgroundColor: '#EDE9FE', paddingVertical: 8, paddingHorizontal: 16 },
  sectionTitleText: { color: '#4C1D95', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },

  // ScrollView Modul
  moduleBox: { backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 1, overflow: 'hidden' },
  scrollHoriz: { height: 60, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  chipKategori: { backgroundColor: '#F5F3FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#EDE9FE' },
  chipText: { color: '#4C1D95', fontWeight: 'bold', fontSize: 13 },
  scrollVert: { height: 120, padding: 16 },
  artikelTeks: { color: '#4B5563', fontSize: 15, lineHeight: 24 },

  // Modal Indicator
  modalBg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)' },
  modalIsi: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 20, alignItems: 'center', width: '75%', elevation: 10 },

  // Tema Mode
  rowOpsi: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 6, borderRadius: 12, elevation: 1 },
  opsiBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  opsiAktif: { backgroundColor: '#4C1D95', shadowColor: '#4C1D95', elevation: 2 },
  opsiText: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },

  // Switch
  switchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 12, elevation: 1 },
  submitFinal: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 3 }
});