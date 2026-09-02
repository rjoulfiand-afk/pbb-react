import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Soal1Kondisi = () => {

    let nilaiUjian = 80;

    const teksKelulusan = nilaiUjian >= 75 ? "Selamat, Anda Lulus!" : "Maaf, Anda Belum Lulus.";

    const warnaKelulusan = nilaiUjian >= 75 ? 'green' : 'red';

    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 1 (Cek Kelulusan):</Text>

            <Text>Nilai : {nilaiUjian}</Text>

            <Text style={{ color: warnaKelulusan }}>Status : {teksKelulusan}</Text>

        </View>

    );

};

const Soal2Kondisi = () => {

    let suhuUdara = 2;

    let teksCuaca, warnaCuaca;



    if (suhuUdara > 35) {

        teksCuaca = "Peringatan: Cuaca Sangat Panas!";

        warnaCuaca = 'red';

    } else if (suhuUdara >= 20 && suhuUdara <= 35) {

        teksCuaca = "Cuaca Normal";

        warnaCuaca = 'green';

    } else {

        teksCuaca = "Cuaca sangat dingin";

        warnaCuaca = 'blue';

    }

    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 2 (Peringatan Cuaca):</Text>

            <Text>Suhu Udara : {suhuUdara} derajat</Text>

            <Text style={{ color: warnaCuaca }}>Status : {teksCuaca}</Text>

        </View>

    );

};

const Soal3Kondisi = () => {

    let isLoggedIn = true;

    let namaUser = "Rixsan";

    const teksLogin = isLoggedIn ? `Halo, ${namaUser}!` : "Silakan Login Terlebih Dahulu";



    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 3 (Status Login):</Text>

            <Text>Login : {isLoggedIn ? "true" : "false"}, User : {namaUser}</Text>

            <Text>Status : {teksLogin}</Text>

        </View>

    );

};



const Soal4Kondisi = () => {

    let totalBelanja = 350000;

    let teksDiskon, warnaDiskon;

    if (totalBelanja > 500000) {

        teksDiskon = "Anda Mendapat Diskon 20%!";

        warnaDiskon = 'purple';

    } else if (totalBelanja >= 200000 && totalBelanja <= 500000) {

        teksDiskon = "Anda Mendapat Diskon 10%!";

        warnaDiskon = 'blue';

    } else {

        teksDiskon = "Belanja lebih banyak untuk dapat diskon!";

        warnaDiskon = 'gray';

    }

    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 4 (Diskon Belanja):</Text>

            <Text>Total Belanja : Rp {totalBelanja}</Text>

            <Text style={{ color: warnaDiskon }}>Status : {teksDiskon}</Text>

        </View>

    );

};



const Soal5Kondisi = () => {

    let jamSekarang = 14;

    const teksToko = (jamSekarang >= 8 && jamSekarang <= 17) ? "Toko Buka" : "Toko Tutup";



    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 5 (Status Toko):</Text>

            <Text>Jam Sekarang : {jamSekarang}.00</Text>

            <Text>Status : {teksToko}</Text>

        </View>

    );

};



const Soal6Kondisi = () => {

    let isDarkMode = true;

    const bgMode = isDarkMode ? '#121212' : '#FFFFFF';

    const teksMode = isDarkMode ? 'white' : 'black';



    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 6 (Theme Mode):</Text>

            <Text>Dark Mode : {isDarkMode ? "Aktif" : "Mati"}</Text>

            <View style={{ backgroundColor: bgMode, paddingHorizontal: 5 }}>

                <Text style={{ color: teksMode }}>Status : Simulasi Layar Mode</Text>

            </View>

        </View>

    );

};



const Soal7Kondisi = () => {

    let passwordReg = "rahas";

   

    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 7 (Validasi Password):</Text>

            <Text>Password Input : {passwordReg}</Text>

            {passwordReg.length < 6 && (

                <Text style={{ color: 'red' }}>Status : Password terlalu pendek (minimal 6 karakter)</Text>

            )}

        </View>

    );

};



const Soal8Kondisi = () => {

    let jenisKendaraan = "Motor";

    const teksParkir = jenisKendaraan === "Mobil" ? "Tarif Parkir: Rp 5.000 / jam" : "Tarif Parkir: Rp 2.000 / jam";



    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 8 (Tarif Parkir):</Text>

            <Text>Kendaraan : {jenisKendaraan}</Text>

            <Text>Status : {teksParkir}</Text>

        </View>

    );

};



const Soal9Kondisi = () => {

    let stokBarang = 5;

    let teksStok, warnaStok;

   

    if (stokBarang > 10) {

        teksStok = "Stok Tersedia";

        warnaStok = 'green';

    } else if (stokBarang >= 1 && stokBarang <= 10) {

        teksStok = "Stok Terbatas! Segera Beli";

        warnaStok = 'orange';

    } else {

        teksStok = "Stok Habis";

        warnaStok = 'red';

    }



    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 9 (Ketersediaan Stok):</Text>

            <Text>Sisa Stok : {stokBarang}</Text>

            <Text style={{ color: warnaStok }}>Status : {teksStok}</Text>

        </View>

    );

};



const Soal10Kondisi = () => {

    let usiaPenonton = 16;

    let teksFilm;

   

    if (usiaPenonton < 13) {

        teksFilm = "Kategori: Semua Umur (SU)";

    } else if (usiaPenonton >= 13 && usiaPenonton <= 17) {

        teksFilm = "Kategori: Remaja (R)";

    } else {

        teksFilm = "Kategori: Dewasa (D)";

    }



    return (

        <View style={styles.bungkusSoal}>

            <Text>Soal 10 (Rekomendasi Film):</Text>

            <Text>Usia Penonton : {usiaPenonton} tahun</Text>

            <Text>Status : {teksFilm}</Text>

        </View>

    );

};

// looping



const Soal1Looping = () => {

    let hasilLoop = [];

    for (let i = 1; i <= 8; i++) {

        hasilLoop.push(`Tiket antrean nomor: ${i}`);

    }

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 1 (Antrean Bioskop):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal2Looping = () => {

    let hasilLoop = [];

    for (let i = 5; i >= 1; i--) {

        hasilLoop.push(i.toString());

    }

    hasilLoop.push("Roket Meluncur!");

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 2 (Hitung Mundur Roket):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal3Looping = () => {

    let hasilLoop = [];

    let jumlah = 0;

    for (let deret = 5; deret > 0; deret--) {

        jumlah += deret;

        hasilLoop.push(`Jumlah saat ini: ${jumlah}`);

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 3 (Akumulasi Poin Kasir):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal4Looping = () => {

    let hasilLoop = [];

    for (let deret = 2; deret < 10; deret += 2) {

        hasilLoop.push(`Nomor meja VIP: ${deret}`);

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 4 (Meja VIP Genap):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal5Looping = () => {

    let hasilLoop = [];

    for (let i = 0; i <= 6; i++) {

        if (i === 3) {

            hasilLoop.push("Peringatan: Suhu Mesin Stabil!");

        } else {

            hasilLoop.push(`Iterasi normal: ${i}`);

        }

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 5 (Suhu Mesin Pabrik):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal6Looping = () => {

    let hasilLoop = [];

    let flag = 1;

    while (flag < 10) {

        hasilLoop.push(`Memanggil nasabah antrean ke-${flag}`);

        flag++;

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 6 (Antrean Bank While):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};

const Soal7Looping = () => {

    let hasilLoop = [];

    let deret = 4;

    let jumlah = 0;

    while (deret > 0) {

        jumlah += deret;

        hasilLoop.push(`Jumlah tabungan saat ini: ${jumlah}`);

        deret--;

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 7 (Tabungan Siswa):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal8Looping = () => {

    let hasilLoop = [];

    let i = 0;

    // While loop dengan kondisi IF

    while (i < 5) {

        if (i === 3) {

            hasilLoop.push("Awas Halangan Dekat!");

        } else {

            hasilLoop.push(`Jarak aman: iterasi ${i}`);

        }

        i++;

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 8 (Sensor Parkir):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal9Looping = () => {

    let hasilLoop = [];

    let flag = 1;

    while (flag < 5) {

        hasilLoop.push(`Iterasi ke-${flag}`);

        flag++;

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 9 (Analisis Bug Infinite Loop):</Text>

            <Text style={{ color: 'red', textAlign: 'center', marginVertical: 5 }}>

                Analisis: Aplikasi freeze karena tidak ada increment (flag++) di dalam blok while, sehingga kondisi (flag {"<"} 10) bernilai true selamanya.

            </Text>

            <Text>Hasil kode yang sudah diperbaiki:</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};



const Soal10Looping = () => {

    let hasilLoop = [];

    for (let i = 1; i <= 10; i++) {

        if (i % 2 === 0) {

            hasilLoop.push(`Kupon Genap (Angka ${i})`);

        } else {

            hasilLoop.push(`Kupon Ganjil (Angka ${i})`);

        }

    }

   

    return (

        <View style={styles.bungkusSoal}>

            <Text style={{fontWeight: 'bold'}}>Soal 10 (Undian Pemenang):</Text>

            {hasilLoop.map((item, index) => <Text key={index}>{item}</Text>)}

        </View>

    );

};





export default function Svar() {



    const firstName = "Budi";

    const lastName = "Santoso";

    let isAktif = true;

    const jwb1 = `Akun atas nama ${firstName} ${lastName} status aktif: ${isAktif}`;



    let rawUsername = " admin_smkn10 ";

    let cleanUsername = rawUsername.trim();

    const jwb2 = `Username bersih: '${cleanUsername}', Panjang: ${cleanUsername.length}`;



    let komentar = "Wah, aplikasi ini sangat lambat dan buruk!";

    const jwb3 = `Index kata 'buruk': ${komentar.indexOf("buruk")} | Potongan: ${komentar.substring(0, 19)}`;



    const string1 = "diskon";

    const string2 = "spesial50";

    const jwb4 = `Kode Kupon: ${string1.concat(string2).toUpperCase()}`;



    let harga = parseFloat("150000.50");

    let jumlahStok = parseInt("25");

    const jwb5 = `Total Harga Stok: ${harga * jumlahStok}`;



    let totalBelanja = 250000;

    totalBelanja -= 50000;

    totalBelanja += (totalBelanja * 0.10);

    const jwb6 = `Total Belanja Akhir: ${totalBelanja}`;



    let inputUsia = "17";

    let syaratUsia = 17;

    const jwb7 = `=== hasilnya: ${inputUsia === syaratUsia} | >= hasilnya: ${inputUsia >= syaratUsia}`;



    let isPasswordCorrect = true;

    let isEmailVerified = true;

    const jwb8 = `Keduanya true: ${isPasswordCorrect && isEmailVerified} | Jika email false: ${isPasswordCorrect && false}`;



    let isNilaiTinggi = true;

    let isJuaraLomba = false;

    const jwb9 = `Siswa berhak beasiswa: ${isNilaiTinggi || isJuaraLomba}`;



    let member = true;

    let jwb10 = "";

    if (member) {

        let diskon = 0.2;

        var bonus = "Poin";

    }

    try {

        jwb10 = `Bonus (var): ${bonus} | Diskon (let): Error is not defined`;

    } catch (err) {

        jwb10 = "Error menangkap variabel let";

    }



    const daftarJawabanPart1 = [jwb1, jwb2, jwb3, jwb4, jwb5, jwb6, jwb7, jwb8, jwb9, jwb10];



    return (

        <ScrollView contentContainerStyle={styles.layar}>
            <Text style={styles.judul}>JAWABAN TIPE DATA</Text>
            {daftarJawabanPart1.map((jawaban, index) => (
                <View key={index} style={styles.bungkusSoal}>
                    <Text>Soal {index + 1}:</Text>
                    <Text>{jawaban}</Text>
                </View>
            ))}



            <Text style={styles.judul2}>JAWABAN KONDISI</Text>

            <Soal1Kondisi />

            <Soal2Kondisi />

            <Soal3Kondisi />

            <Soal4Kondisi />

            <Soal5Kondisi />

            <Soal6Kondisi />

            <Soal7Kondisi />

            <Soal8Kondisi />

            <Soal9Kondisi />

            <Soal10Kondisi />
            <Text style={styles.judul2}>JAWABAN LOOPING</Text>
            <Soal1Looping />
            <Soal2Looping />

            <Soal3Looping />

            <Soal4Looping />

            <Soal5Looping />

            <Soal6Looping />

            <Soal7Looping />

            <Soal8Looping />
            <Soal9Looping />
            <Soal10Looping />
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    layar: {
        alignItems: 'center',
        paddingTop: 50,      
        paddingBottom: 40,
    },
    judul: {
        fontWeight: 'bold',
        marginBottom: 15,
        textDecorationLine: 'underline',
    },
    judul2: {
        fontWeight: 'bold',
        marginTop: 35,
        marginBottom: 15,
        textDecorationLine: 'underline',
    },
    bungkusSoal: {
        marginBottom: 20,
        alignItems: 'center',
    }
});