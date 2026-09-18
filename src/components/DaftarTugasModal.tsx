import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const db = SQLite.openDatabaseSync('primenotes_v2.db');
const { height: screenHeight } = Dimensions.get('screen');

export default function DaftarTugasModal({ visible, onClose, onUpdate }: { visible: boolean, onClose: () => void, onUpdate: () => void }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [konfirmasiSelesai, setKonfirmasiSelesai] = useState<number | null>(null);

  // === 1. TARIK SEMUA TUGAS DARI DATABASE ===
  const fetchTasks = () => {
    try {
      // Diurutkan dari yang paling MENDESAK, lalu NORMAL, lalu SANTAI
      const res = db.getAllSync(`
        SELECT * FROM tasks 
        WHERE is_completed = 0 
        ORDER BY CASE priority WHEN 'mendesak' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, id DESC
      `);
      setTasks(res);
    } catch (error) {
      console.log("Error fetch tasks", error);
    }
  };

  // Setiap kali modal dibuka, tarik ulang datanya
  useEffect(() => {
    if (visible) fetchTasks();
  }, [visible]);

  // === 2. FUNGSI SELESAIKAN & HAPUS TUGAS ===
  const selesaiTugas = (id: number) => {
    try {
      db.runSync("UPDATE tasks SET is_completed = 1 WHERE id = ?", [id]);
      fetchTasks();
      onUpdate(); // Biar Dashboard ikut ke-refresh
      setKonfirmasiSelesai(null);
    } catch (e) {
      Alert.alert("Error", "Gagal menyelesaikan tugas.");
    }
  };

  const hapusTugas = (id: number) => {
    Alert.alert("Hapus Misi?", "Yakin mau hapus misi ini dari radar?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => {
          db.runSync("DELETE FROM tasks WHERE id = ?", [id]);
          fetchTasks();
          onUpdate(); // Biar Dashboard ikut ke-refresh
        } 
      }
    ]);
  };

  // Helper Warna Prioritas
  const getPriorityColor = (priority: string) => {
    if (priority === 'mendesak') return { bg: '#fef2f2', text: '#ef4444', icon: 'bolt' };
    if (priority === 'normal') return { bg: '#eff6ff', text: '#3b82f6', icon: 'book' };
    return { bg: '#f0fdf4', text: '#22c55e', icon: 'coffee' }; // Santai
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.bottomSheet}>
          <View style={styles.indicatorBar} />

          {/* HEADER MODAL */}
          <LinearGradient colors={['#fff7ed', '#ffffff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
            <View style={styles.orangeGlow} />
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose} style={styles.btnBack}>
                <FontAwesome5 name="chevron-left" size={16} color="#ea580c" />
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 16, zIndex: 10 }}>
                <Text style={styles.headerTitle}>Semua Misi</Text>
                <Text style={styles.headerSub}>RADAR PRIORITAS FULL</Text>
              </View>
              <View style={styles.headerIconBox}>
                <FontAwesome5 name="tasks" size={20} color="#f97316" />
              </View>
            </View>
          </LinearGradient>

          {/* LIST TUGAS */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.listCount}>Terdapat {tasks.length} Misi Aktif</Text>

            {tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome5 name="shield-check" size={40} color="#d1d5db" style={{ marginBottom: 15 }} />
                <Text style={styles.emptyTitle}>Clear Boss!</Text>
                <Text style={styles.emptyDesc}>Ngga ada misi yang nyangkut. Waktunya rebahan atau ngopi! ☕</Text>
              </View>
            ) : (
              tasks.map((task) => {
                const pColor = getPriorityColor(task.priority);
                
                return (
                  <View key={task.id} style={styles.taskCard}>
                    {/* Garis Warna di Kiri Card */}
                    <View style={[styles.colorLine, { backgroundColor: pColor.text }]} />
                    
                    {/* Overlay Konfirmasi (Muncul kalau ditekan tombol centang) */}
                    {konfirmasiSelesai === task.id && (
                      <View style={styles.konfirmasiOverlay}>
                        <Text style={styles.konfirmasiText}>Misi kelar? Yakin nih? 🤔</Text>
                        <View style={styles.konfirmasiBtnRow}>
                          <TouchableOpacity onPress={() => setKonfirmasiSelesai(null)} style={styles.btnBatal}><Text style={styles.btnBatalText}>Batal</Text></TouchableOpacity>
                          <TouchableOpacity onPress={() => selesaiTugas(task.id)} style={[styles.btnYakin, { backgroundColor: pColor.text }]}><Text style={styles.btnYakinText}>Yakin, Selesai!</Text></TouchableOpacity>
                        </View>
                      </View>
                    )}

                    <View style={styles.taskContent}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {task.detail ? (
                          <Text style={styles.taskDetail} numberOfLines={2}>{task.detail}</Text>
                        ) : null}
                        
                        <View style={styles.metaRow}>
                          <View style={[styles.badge, { backgroundColor: pColor.bg }]}>
                            <FontAwesome5 name={pColor.icon} size={8} color={pColor.text} style={{marginRight: 4}} />
                            <Text style={[styles.badgeText, { color: pColor.text }]}>{task.priority}</Text>
                          </View>
                          <View style={styles.dateBox}>
                            <FontAwesome5 name="clock" size={10} color="#9ca3af" style={{marginRight: 4}} />
                            <Text style={styles.dateText}>
                              {task.due_date === 'hari_ini' ? 'Hari Ini' : task.due_date === 'besok' ? 'Besok' : task.due_date}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Tombol Aksi (Kanan) */}
                      <View style={styles.actionColumn}>
                        <TouchableOpacity onPress={() => setKonfirmasiSelesai(task.id)} style={[styles.btnAction, styles.btnActionCheck]}>
                          <FontAwesome5 name="check" size={12} color="#10b981" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => hapusTugas(task.id)} style={[styles.btnAction, styles.btnActionTrash]}>
                          <FontAwesome5 name="trash-alt" size={12} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  bottomSheet: { height: '90%', backgroundColor: '#f8fafc', borderTopLeftRadius: 35, borderTopRightRadius: 35, overflow: 'hidden', elevation: 25 },
  indicatorBar: { position: 'absolute', top: 12, left: '50%', marginLeft: -24, width: 48, height: 5, backgroundColor: '#e2e8f0', borderRadius: 3, zIndex: 50 },
  
  // Header
  header: { paddingHorizontal: 24, paddingVertical: 24, paddingTop: 35, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', position: 'relative' },
  orangeGlow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: '#fed7aa', borderRadius: 60, opacity: 0.4 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  btnBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffedd5', elevation: 1, zIndex: 10 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b' },
  headerSub: { fontSize: 10, fontWeight: '900', color: '#f97316', letterSpacing: 1, marginTop: 2, textTransform: 'uppercase' },
  headerIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center', transform: [{rotate: '12deg'}], zIndex: 10 },

  // Scroll Content
  scrollContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 40 },
  listCount: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 15, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 30, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'dashed', marginTop: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#64748b', marginBottom: 8 },
  emptyDesc: { fontSize: 12, fontWeight: '500', color: '#94a3b8', textAlign: 'center', lineHeight: 18 },

  // Task Card
  taskCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#f1f5f9' },
  colorLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  taskContent: { flexDirection: 'row', padding: 16, paddingLeft: 20 },
  
  taskTitle: { fontSize: 15, fontWeight: '900', color: '#1e293b', marginBottom: 4 },
  taskDetail: { fontSize: 12, fontWeight: '500', color: '#64748b', marginBottom: 10, lineHeight: 18 },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateBox: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8' },

  // Actions
  actionColumn: { justifyContent: 'center', gap: 10, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: '#f1f5f9' },
  btnAction: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  btnActionCheck: { backgroundColor: '#ecfdf5', borderColor: '#d1fae5' },
  btnActionTrash: { backgroundColor: '#fef2f2', borderColor: '#fee2e2' },

  // Konfirmasi Overlay
  konfirmasiOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 20, alignItems: 'center', justifyContent: 'center', padding: 15 },
  konfirmasiText: { fontSize: 13, fontWeight: '900', color: '#1e293b', marginBottom: 12 },
  konfirmasiBtnRow: { flexDirection: 'row', gap: 10 },
  btnBatal: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#f1f5f9', borderRadius: 10 },
  btnBatalText: { fontSize: 11, fontWeight: 'bold', color: '#64748b' },
  btnYakin: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, elevation: 2 },
  btnYakinText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
});