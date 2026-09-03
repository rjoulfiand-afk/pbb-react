import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, SectionList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import CustomImage from '../components/ui/CustomImage';
import LoginForm from '../components/ui/LoginForm';
import MyButton from '../components/ui/MyButton';
import UserCard from '../components/ui/UserCard';

const dataKatalog = Array.from({ length: 50 }, (_, i) => ({ id: `${i}`, nama: `Produk Ke-${i + 1}` }));
const dataNilai = [
  { title: "Mata Pelajaran Kejuruan", data: ["Pemrograman Web", "Pemrograman Perangkat Bergerak", "Basis Data"] },
  { title: "Mata Pelajaran Umum", data: ["Matematika", "Bahasa Inggris", "Sejarah", "Pendidikan Agama"] }
];

export default function TugasKomponen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modeAktif, setModeAktif] = useState('System Default');
  const [agreed, setAgreed] = useState(false);

  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ paddingBottom: 40 }}>
      
      <View style={styles.header}>
        <Text style={styles.judulHeader}>Tugas UI Component</Text>
 
      </View>

      <View style={styles.konten}>
        
        <Text style={styles.labelTugas}>1. UserCard Profil</Text>
        <UserCard name="Rixsan Joulfiand" status="Aktif" imageUrl="https://randomuser.me/api/portraits/men/44.jpg" />
        <UserCard name="Santa" status="Alumni" imageUrl="https://randomuser.me/api/portraits/women/44.jpg" />
        <UserCard name="Mikhayla" status="Aktif" imageUrl="https://randomuser.me/api/portraits/women/68.jpg" />

        <Text style={styles.labelTugas}>2. Form Login</Text>
        <LoginForm />

        <Text style={styles.labelTugas}>3. FlatList Katalog</Text>
        <View style={styles.boxBorder}>
          <FlatList 
            data={dataKatalog} 
            keyExtractor={item => item.id} 
            renderItem={({item}) => <Text style={styles.listItem}>{item.nama}</Text>} 
            nestedScrollEnabled={true}
          />
        </View>

        {/* REVISI SOAL 4: Konten diperpanjang & Cybersecurity dihapus */}
        <Text style={styles.labelTugas}>4. ScrollView Horizontal & Vertikal</Text>
        <View style={styles.boxBorder}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollHoriz} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}>
            {['React Native', 'UI/UX Design', 'Database SQL', 'Python Dasar', 'PHP Lanjut'].map((kat, idx) => (
              <Text key={idx} style={styles.chipKategori}>{kat}</Text>
            ))}
          </ScrollView>
          <ScrollView style={styles.scrollVert} nestedScrollEnabled={true}>
            <Text style={styles.artikelTeks}>
              Ini adalah area artikel vertikal. Gulir ke bawah untuk membaca seluruh konten. 
              Sebelumnya fitur scroll tidak berjalan karena teksnya terlalu pendek, sehingga sistem merasa tidak perlu ada fungsi gulir. 
              Materi ini mengajarkan dasar komponen UI, interaksi pengguna, dan optimasi performa dalam pengembangan aplikasi mobile modern.
              Dengan teks yang diperpanjang seperti ini, kamu sekarang bisa mencoba men-scroll konten ini ke atas dan ke bawah dengan lancar.
            </Text>
          </ScrollView>
        </View>

        <Text style={styles.labelTugas}>5 & 6. Tombol Kustom & Indikator</Text>
        <MyButton title="Fetch Data (Buka Modal)" variant="primary" onPress={() => { setModalVisible(true); setTimeout(()=>setModalVisible(false), 2000); }} />
        <MyButton title="Simpan" variant="success" onPress={() => {}} />
        <MyButton title="Hapus" variant="danger" onPress={() => {}} />

        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalIsi}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={{ marginTop: 10 }}>Memuat data...</Text>
            </View>
          </View>
        </Modal>

        <Text style={styles.labelTugas}>7. CustomImage Placeholder</Text>
        <CustomImage source={{ uri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600' }} style={{ width: '100%', height: 150, marginBottom: 10 }} />

        <Text style={styles.labelTugas}>8. SectionList Nilai</Text>
        <View style={styles.boxBorder}>
          <SectionList
            sections={dataNilai}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Text style={styles.listItem}>- {item}</Text>}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
            nestedScrollEnabled={true}
          />
        </View>

        <Text style={styles.labelTugas}>9. Pilihan Kategori Mode</Text>
        <View style={styles.rowOpsi}>
          {['Light Mode', 'Dark Mode', 'System Default'].map((opsi) => (
            <TouchableOpacity key={opsi} onPress={() => setModeAktif(opsi)} style={[styles.opsiBtn, modeAktif === opsi && styles.opsiAktif]}>
              <Text style={[styles.opsiText, modeAktif === opsi && { color: '#fff' }]}>{opsi}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.labelTugas}>10. Switch Kebijakan Privasi</Text>
        <View style={styles.switchBox}>
          <Switch value={agreed} onValueChange={setAgreed} />
          <Text style={{ marginLeft: 10 }}>Saya menyetujui Syarat & Ketentuan.</Text>
        </View>
        
        <TouchableOpacity style={[styles.submitFinal, !agreed && { backgroundColor: '#ccc' }]} disabled={!agreed}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit Pendaftaran</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 15 },
  judulHeader: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subHeader: { fontSize: 14, color: '#666', marginTop: 5 },
  konten: { paddingHorizontal: 15 },
  
  labelTugas: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 8, textDecorationLine: 'underline' },
  boxBorder: { height: 150, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  
  listItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionHeader: { backgroundColor: '#e9ecef', padding: 8, fontWeight: 'bold' },

  scrollHoriz: { borderBottomWidth: 1, borderColor: '#ddd', maxHeight: 50 },
  chipKategori: { backgroundColor: '#e9ecef', padding: 5, marginRight: 10, borderWidth: 1, borderColor: '#ccc' },
  scrollVert: { padding: 10 },
  artikelTeks: { color: '#333', lineHeight: 20 },

  modalBg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalIsi: { backgroundColor: '#fff', padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#999' },

  rowOpsi: { flexDirection: 'row', marginBottom: 10 },
  opsiBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', backgroundColor: '#fff' },
  opsiAktif: { backgroundColor: '#007BFF', borderColor: '#007BFF' },
  opsiText: { color: '#333' },

  switchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  submitFinal: { backgroundColor: '#28A745', padding: 15, alignItems: 'center' }
});