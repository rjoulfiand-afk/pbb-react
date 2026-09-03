import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Soal1 = () => {
  let hasil = [];
  for (let i = 0; i <= 9; i++) { hasil.push(i); }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>1. Looping Sederhana</Text>
      <View style={styles.outputBox}>
        {hasil.map((angka, idx) => <Text key={idx} style={styles.outputText}>{angka}</Text>)}
      </View>
    </View>
  );
};

const Soal2 = () => {
  let hasil = [];
  for (let i = 1; i <= 9; i++) { if (i % 2 !== 0) hasil.push(i); }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>2. Looping Angka Ganjil</Text>
      <View style={styles.outputBox}>
        {hasil.map((angka, idx) => <Text key={idx} style={styles.outputText}>{angka}</Text>)}
      </View>
    </View>
  );
};

const Soal3 = () => {
  let hasil = [];
  for (let i = 0; i <= 8; i++) { if (i % 2 === 0) hasil.push(i); }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>3. Looping Angka Genap</Text>
      <View style={styles.outputBox}>
        {hasil.map((angka, idx) => <Text key={idx} style={styles.outputText}>{angka}</Text>)}
      </View>
    </View>
  );
};

const Soal4 = () => {
  let array1 = [1, 2, 3, 4, 5, 6];
  let hasil = array1[5];
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>4. Mengakses Elemen Array (Index 5)</Text>
      <View style={styles.outputBox}>
        <Text style={styles.outputText}>"{hasil}"</Text>
      </View>
    </View>
  );
};

const Soal5 = () => {
  let array2 = [5, 2, 4, 1, 3, 5];
  let hasil = [...array2].sort();
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>5. Mengurutkan Elemen (Sort)</Text>
      <View style={styles.outputBox}>
        <Text style={styles.outputText}>[ {hasil.join(', ')} ]</Text>
      </View>
    </View>
  );
};

const Soal6 = () => {
  let array3 = ["selamat", "kalian", "melakukan", "perulangan", "array", "dengan", "for"];
  let hasil = [];
  for (let i = 0; i < array3.length; i++) { hasil.push(array3[i]); }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>6. Mengeluarkan Elemen Array</Text>
      <View style={styles.outputBox}>
        {hasil.map((kata, idx) => <Text key={idx} style={styles.outputText}>{kata}</Text>)}
      </View>
    </View>
  );
};

const Soal7 = () => {
  let array4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let hasil = [];
  for (let i = 0; i < array4.length; i++) {
    if (array4[i] % 2 === 0) hasil.push(array4[i]);
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>7. Mengeluarkan Elemen Kondisi Genap</Text>
      <View style={styles.outputBox}>
        {hasil.map((angka, idx) => <Text key={idx} style={styles.outputText}>{angka}</Text>)}
      </View>
    </View>
  );
};

const Soal8 = () => {
  let kalimat = ["saya", "sangat", "senang", "belajar", "javascript"];
  let hasil = kalimat.join(" ");
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>8. Menggabungkan Elemen (Join)</Text>
      <View style={styles.outputBox}>
        <Text style={styles.outputText}>"{hasil}"</Text>
      </View>
    </View>
  );
};

const Soal9 = () => {
  var sayuran = [];
  sayuran.push("Kangkung", "Bayam", "Buncis", "Kubis", "Timun", "Seledri", "Tauge");
  const outputConsole = `[
  '${sayuran[0]}', '${sayuran[1]}',
  '${sayuran[2]}', '${sayuran[3]}',
  '${sayuran[4]}', '${sayuran[5]}',
  '${sayuran[6]}'
]`;

  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>9. Menambahkan Elemen (Push)</Text>
      <View style={styles.outputBox}>
        <Text style={styles.outputText}>{outputConsole}</Text>
      </View>
    </View>
  );
};

export default function TugasArray() {
  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.judulHeader}>Tugas JavaScript</Text>
        <Text style={styles.subHeader}>Materi: Looping & Array</Text>
      </View>
      <View style={styles.konten}>
        <Soal1 />
        <Soal2 />
        <Soal3 />
        <Soal4 />
        <Soal5 />
        <Soal6 />
        <Soal7 />
        <Soal8 />
        <Soal9 />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 25, paddingTop: 40, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 20 },
  judulHeader: { color: '#111827', fontSize: 22, fontWeight: 'bold' },
  subHeader: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  konten: { paddingHorizontal: 20 },
  
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#F3F4F6', elevation: 1 },
  soalTitle: { fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 },
  
  outputBox: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  outputText: { color: '#4B5563', fontFamily: 'monospace', fontSize: 13, lineHeight: 22 }
});