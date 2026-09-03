import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Panggil semua file lu
import Svar from "./svar";
import TugasArray from "./TugasArray";
import TugasFunction from "./TugasFunction";
import TugasKomponen from "./TugasKomponen";

export default function Index() {
  const [menuAktif, setMenuAktif] = useState("Logika"); 

  return (
    <SafeAreaView style={styles.container}>
      
      {/* AREA KONTEN */}
      <View style={styles.areaKonten}>
        {menuAktif === "Logika" && <Svar />}
        {menuAktif === "Array" && <TugasArray />}
        {menuAktif === "Function" && <TugasFunction />}
        {menuAktif === "UI" && <TugasKomponen />}
      </View>

      {/* AREA MENU BAWAH (4 Tombol) */}
      <View style={styles.navBar}>
        
        <TouchableOpacity style={[styles.tombolMenu, menuAktif === "Logika" && styles.tombolAktif]} onPress={() => setMenuAktif("Logika")}>
          <Text style={[styles.teksMenu, menuAktif === "Logika" && styles.teksAktif]}>Dasar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tombolMenu, menuAktif === "Array" && styles.tombolAktif]} onPress={() => setMenuAktif("Array")}>
          <Text style={[styles.teksMenu, menuAktif === "Array" && styles.teksAktif]}>Array</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tombolMenu, menuAktif === "Function" && styles.tombolAktif]} onPress={() => setMenuAktif("Function")}>
          <Text style={[styles.teksMenu, menuAktif === "Function" && styles.teksAktif]}>Fungsi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tombolMenu, menuAktif === "UI" && styles.tombolAktif]} onPress={() => setMenuAktif("UI")}>
          <Text style={[styles.teksMenu, menuAktif === "UI" && styles.teksAktif]}>UI</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  areaKonten: { flex: 1 },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 10,
  },
  tombolMenu: { flex: 1, paddingVertical: 10, marginHorizontal: 2, borderRadius: 8, alignItems: "center", backgroundColor: "#F9FAFB" },
  tombolAktif: { backgroundColor: "#007BFF" },
  teksMenu: { fontSize: 12, fontWeight: "bold", color: "#6B7280" },
  teksAktif: { color: "#FFFFFF" },
});