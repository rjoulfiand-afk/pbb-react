import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 1. Panggil kedua file tugas lu
import Svar from "./svar";
import TugasKomponen from "./TugasKomponen";

export default function Index() {
  // 2. Bikin state untuk mendeteksi menu mana yang lagi diklik
  // Default awal kita set buka 'Logika'
  const [menuAktif, setMenuAktif] = useState("Logika"); 

  return (
    <SafeAreaView style={styles.container}>
      
      {/* AREA KONTEN UTAMA: Otomatis ganti sesuai tombol yang dipencet */}
      <View style={styles.areaKonten}>
        {menuAktif === "Logika" ? <Svar /> : <TugasKomponen />}
      </View>

      {/* AREA MENU BAWAH (Pengganti Sidebar) */}
      <View style={styles.navBar}>
        
        {/* Tombol 1: Tugas Logika (svar.jsx) */}
        <TouchableOpacity
          style={[styles.tombolMenu, menuAktif === "Logika" && styles.tombolAktif]}
          onPress={() => setMenuAktif("Logika")}
          activeOpacity={0.8}
        >
          <Text style={[styles.teksMenu, menuAktif === "Logika" && styles.teksAktif]}>
            📝 Tugas Logika
          </Text>
        </TouchableOpacity>

        {/* Tombol 2: Tugas UI (TugasKomponen.jsx) */}
        <TouchableOpacity
          style={[styles.tombolMenu, menuAktif === "UI" && styles.tombolAktif]}
          onPress={() => setMenuAktif("UI")}
          activeOpacity={0.8}
        >
          <Text style={[styles.teksMenu, menuAktif === "UI" && styles.teksAktif]}>
            🎨 Tugas UI
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// 3. Styling untuk Menu Navigasi Bawah
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  areaKonten: {
    flex: 1, // Biar konten ngisi seluruh sisa layar atas
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingBottom: 20, // Kasih jarak buat tombol home HP
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    // Efek bayangan biar kelihatan melayang
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  tombolMenu: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  tombolAktif: {
    backgroundColor: "#4C1D95", // Warna ungu elegan kalau lagi dipilih
  },
  teksMenu: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B7280", // Warna abu-abu kalau lagi ga dipilih
  },
  teksAktif: {
    color: "#FFFFFF", // Teks jadi putih kalau lagi dipilih
  },
});