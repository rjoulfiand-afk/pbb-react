import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Soal1 = () => {
  // Function sederhana tanpa return
  function tampilkan() {
    return "halo!";
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>1. Function Tanpa Return</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>tampilkan() {"->"} "{tampilkan()}"</Text>
      </View>
    </View>
  );
};

const Soal2 = () => {
  // Function sederhana dengan return
  function munculkanAngkaDua() {
    return 2;
  }
  var tampung = munculkanAngkaDua();
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>2. Function Dengan Return</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>tampung = {tampung}</Text>
      </View>
    </View>
  );
};

const Soal3 = () => {
  // Function dengan parameter
  function kalikanDua(angka) {
    return angka * 2;
  }
  var tampung = kalikanDua(2);
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>3. Function Dengan Parameter</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>kalikanDua(2) {"->"} {tampung}</Text>
      </View>
    </View>
  );
};

const Soal4 = () => {
  // Pengiriman parameter lebih dari satu
  function tampilkanAngka(angkaPertama, angkaKedua) {
    return angkaPertama + angkaKedua;
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>4. Parameter Lebih Dari Satu</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>tampilkanAngka(5, 3) {"->"} {tampilkanAngka(5, 3)}</Text>
      </View>
    </View>
  );
};

const Soal5 = () => {
  // Inisialisasi parameter dengan nilai default
  function tampilkanAngkaDefault(angka = 1) {
    return angka;
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>5. Default Parameters</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>tampilkanAngkaDefault(5) {"->"} {tampilkanAngkaDefault(5)}</Text>
        <Text style={styles.consoleText}>tampilkanAngkaDefault()  {"->"} {tampilkanAngkaDefault()}</Text>
      </View>
    </View>
  );
};

const Soal6 = () => {
  // Function dengan Conditional
  function tampilAngka(angkaPertama, angkaKedua){
    var hasil = angkaPertama + angkaKedua;
    if(hasil > 10){
      return "hasil lebih besar dari 10";
    } else if(hasil > 0 && hasil < 10 ){
      return "hasil lebih kecil dari 10";
    } else if(hasil === 0 ){
      return "hasil 0";
    } else {
      return "Tidak ada nilai dari parameter";
    }
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>6. Function & Conditional</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>tampilAngka(5, 10) {"->"} "{tampilAngka(5, 10)}"</Text>
      </View>
    </View>
  );
};

const Soal7 = () => {
  // Function dengan Looping
  function looping(iteration) {
    let hasil = [];
    for(var i = 0; i < iteration; i++){
      hasil.push(i);
    }
    return hasil;
  }
  let cetakLooping = looping(2);
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>7. Function & Looping</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>looping(2):</Text>
        {cetakLooping.map((angka, idx) => (
          <Text key={idx} style={styles.consoleText}>{angka}</Text>
        ))}
      </View>
    </View>
  );
};

const Soal8 = () => {
  // Anonymous Function
  var fungsiPerkalian = function(angkaPertama, angkaKedua) {
    return angkaPertama * angkaKedua;
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>8. Anonymous Function</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>fungsiPerkalian(2, 4) {"->"} {fungsiPerkalian(2, 4)}</Text>
      </View>
    </View>
  );
};

const Soal9 = () => {
  // Arrow Function & Rest Parameter (ES6)
  const fullName = (...rest) => {
    let [firstName, lastName] = rest;
    return `${firstName} ${lastName}`;
  }
  return (
    <View style={styles.card}>
      <Text style={styles.soalTitle}>9. Arrow Function & Rest Parameter</Text>
      <View style={styles.consoleBox}>
        <Text style={styles.consoleText}>fullName("John", "Doe") {"->"} "{fullName("John", "Doe")}"</Text>
      </View>
    </View>
  );
};

export default function TugasFunction() {
  return (
    <ScrollView style={styles.layar} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.judulHeader}>Tugas JavaScript</Text>
        <Text style={styles.subHeader}>Materi: ES6 Functions</Text>
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
  
  consoleBox: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  consoleText: { color: '#4B5563', fontFamily: 'monospace', fontSize: 13, lineHeight: 22 }
});