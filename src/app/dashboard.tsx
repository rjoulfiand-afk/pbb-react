import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AddMenuModal from '../components/AddMenuModal'; // Pastikan path ini benar!

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);

  // === STATE DATABASE ===
  const [totalKas, setTotalKas] = useState(0);
  const [targetName, setTargetName] = useState('Rakit PC');
  const [targetAmount, setTargetAmount] = useState(2500000);
  const [logs, setLogs] = useState<string[]>([]);
  const [topTask, setTopTask] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);

  // === STATE UI ===
  const [editTargetMode, setEditTargetMode] = useState(false);
  const [inputNamaTarget, setInputNamaTarget] = useState('');
  const [inputNominalTarget, setInputNominalTarget] = useState('');
  const [konfirmasiTask, setKonfirmasiTask] = useState(false);
  
  // State Preview Gelembung
  const [previewData, setPreviewData] = useState({ visible: false, title: '', text: '', date: '', color: '', icon: '' });

  // === 1. FUNGSI LOAD DATA DARI SQLITE ===
  const loadDataDariDatabase = () => {
    try {
      const db = SQLite.openDatabaseSync('primenotes.db');
      
      // Bikin tabel kalau belum ada
      db.execSync(`
        CREATE TABLE IF NOT EXISTS savings (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, purpose TEXT, saved_at TEXT, created_at TEXT, updated_at TEXT);
        CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, description TEXT, created_at TEXT, updated_at TEXT);
        CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, priority TEXT, due_date TEXT, detail TEXT, is_completed INTEGER, created_at TEXT, updated_at TEXT);
        CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, icon TEXT, color TEXT, created_at TEXT, updated_at TEXT);
        CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
      `);

      // Load Settings Target Tabungan
      const targetNameRow: any = db.getFirstSync("SELECT value FROM settings WHERE key = 'targetName'");
      const targetAmountRow: any = db.getFirstSync("SELECT value FROM settings WHERE key = 'targetAmount'");
      
      if (!targetNameRow) {
        db.runSync("INSERT INTO settings (key, value) VALUES ('targetName', 'Rakit PC')");
        db.runSync("INSERT INTO settings (key, value) VALUES ('targetAmount', '2500000')");
      } else {
        setTargetName(targetNameRow.value);
        setTargetAmount(parseInt(targetAmountRow?.value || '0'));
      }

      // Load Total Kas
      const resNabung: any = db.getFirstSync('SELECT SUM(amount) as total FROM savings');
      const resKeluar: any = db.getFirstSync('SELECT SUM(amount) as total FROM expenses');
      const totalNabung = resNabung?.total || 0;
      const totalKeluar = resKeluar?.total || 0;
      setTotalKas(totalNabung - totalKeluar);

      // Load Mini Terminal Logs (Gabung tabungan & pengeluaran terbaru)
      const recentSavings: any[] = db.getAllSync('SELECT amount, purpose as desc, created_at, "nabung" as type FROM savings ORDER BY id DESC LIMIT 2');
      const recentExpenses: any[] = db.getAllSync('SELECT amount, description as desc, created_at, "keluar" as type FROM expenses ORDER BY id DESC LIMIT 2');
      
      const combinedLogs = [...recentSavings, ...recentExpenses]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map(item => {
          const rp = new Intl.NumberFormat('id-ID').format(item.amount);
          return item.type === 'nabung' 
            ? `Nabung Rp ${rp} (${item.desc})` 
            : `Keluar Rp ${rp} (${item.desc})`;
        });
      setLogs(combinedLogs);

      // Load Top Task (Prioritas: Mendesak > Normal > Santai)
      const topTaskRes = db.getFirstSync(`
        SELECT * FROM tasks 
        WHERE is_completed = 0 
        ORDER BY 
          CASE priority WHEN 'mendesak' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, 
          id ASC 
        LIMIT 1
      `);
      setTopTask(topTaskRes);
      setKonfirmasiTask(false); // Reset konfirmasi

      // Load Quick Notes
      const notesRes: any[] = db.getAllSync('SELECT * FROM notes ORDER BY id DESC');
      setNotes(notesRes);

    } catch (error) {
      console.log("Gagal tarik data:", error);
    }
  };

  useEffect(() => {
    loadDataDariDatabase();
  }, []);

  // === 2. FUNGSI LOGIKA AKSI ===

  // Format Input Uang Target
  const formatInputTarget = (text: string) => {
    let angka = text.replace(/[^0-9]/g, '');
    setInputNominalTarget(angka ? new Intl.NumberFormat('id-ID').format(parseInt(angka)) : '');
  };

  // Simpan Target Tabungan Baru
  const simpanTarget = () => {
    const db = SQLite.openDatabaseSync('primenotes.db');
    const cleanAmount = parseInt(inputNominalTarget.replace(/[^0-9]/g, '')) || 0;
    
    db.runSync("UPDATE settings SET value = ? WHERE key = 'targetName'", [inputNamaTarget || 'Target Baru']);
    db.runSync("UPDATE settings SET value = ? WHERE key = 'targetAmount'", [cleanAmount.toString()]);
    
    setEditTargetMode(false);
    loadDataDariDatabase();
    Alert.alert("Sukses", "Target mimpimu udah di-update! Semangat nabung boss! 🚀");
  };

  // Selesai Tugas
  const selesaiTugas = (id: number) => {
    const db = SQLite.openDatabaseSync('primenotes.db');
    db.runSync("UPDATE tasks SET is_completed = 1 WHERE id = ?", [id]);
    loadDataDariDatabase();
    Alert.alert("Mantap!", "Satu misi kelar! Lanjutkan boss! 🔥");
  };

  // Hapus Catatan
  const hapusCatatan = (id: number) => {
    Alert.alert(
      "Hapus Catatan?",
      "Yakin mau hapus ide ini?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => {
            const db = SQLite.openDatabaseSync('primenotes.db');
            db.runSync("DELETE FROM notes WHERE id = ?", [id]);
            loadDataDariDatabase();
          } 
        }
      ]
    );
  };

  // Tema Warna Catatan (Sesuai Laravel loop themes)
  const themeList = [
    { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2' }, // Red
    { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' }, // Slate
    { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' }, // Orange
    { bg: '#f9fafb', text: '#111827', border: '#e5e7eb' }, // Gray
  ];

  const persenTabungan = targetAmount > 0 ? Math.min(100, Math.round((totalKas / targetAmount) * 100)) : 0;
  const sisaTarget = Math.max(0, targetAmount - totalKas);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* === HEADER PROFILE === */}
        <View style={styles.headerProfile}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Malam boss! Waktunya nge-push commit nih 🚀</Text>
            <Text style={styles.greetingSub}>"Satu baris kode hari ini, satu langkah menuju Pro! 🏆"</Text>
            <View style={styles.badgeLocal}>
              <View style={styles.dotRed} />
              <Text style={styles.textLocal}>SEKARANG | LOKAL</Text>
            </View>
          </View>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>RI</Text>
            <View style={styles.levelBadge}><Text style={styles.levelText}>5</Text></View>
          </View>
        </View>

        {/* === 1. KARTU SALDO MODERN PREMIUM === */}
        <View style={{ marginHorizontal: 24, borderRadius: 32, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, marginBottom: 15 }}>
          <LinearGradient colors={['#111827', '#1f2937', '#111827']} style={styles.cardKas}>
            {/* Efek Blur Glow */}
            <View style={styles.glowRed} />
            <View style={styles.glowBlue} />

            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>TOTAL KAS  <FontAwesome5 name="shield-alt" color="#34d399" /></Text>
              <FontAwesome5 name="cc-visa" color="#4b5563" size={24} style={{ opacity: 0.5 }} />
            </View>
            
            <Text style={styles.totalNominal}>
              Rp {new Intl.NumberFormat('id-ID').format(totalKas)}
            </Text>
            
            <View style={styles.progressBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.targetText}>Target: <Text style={{fontWeight: 'bold', color: '#fff'}}>{targetName}</Text></Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={styles.percentBadge}><Text style={styles.percentText}>{persenTabungan}%</Text></View>
                  <TouchableOpacity onPress={() => {
                    setInputNamaTarget(targetName);
                    setInputNominalTarget(new Intl.NumberFormat('id-ID').format(targetAmount));
                    setEditTargetMode(true);
                  }} style={styles.btnEdit}>
                    <FontAwesome5 name="pen" size={10} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.trackBar}>
                <LinearGradient colors={['#dc2626', '#f87171']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.filledBar, { width: `${persenTabungan}%` }]} />
              </View>
              <Text style={styles.sisaText}>Sisa Rp {new Intl.NumberFormat('id-ID').format(sisaTarget)}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* === 2. MINI TERMINAL LOG === */}
        <View style={styles.terminalContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={styles.terminalHeader}>Aktivitas Terakhir</Text>
            <FontAwesome5 name="history" size={12} color="#d1d5db" />
          </View>
          {logs.length === 0 ? (
            <Text style={styles.terminalTextEmpty}>Belum ada transaksi...</Text>
          ) : (
            logs.map((log, i) => (
              <Text key={i} style={styles.terminalText}>
                <Text style={{color: '#10b981', fontWeight: 'bold'}}>{'>'} </Text>{log}
              </Text>
            ))
          )}
        </View>

        {/* === 3. RADAR PRIORITAS === */}
        <View style={styles.sectionMargin}>
          <View style={styles.sectionHeaderBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.redLinePulse} />
              <Text style={styles.sectionTitle}>Radar Prioritas</Text>
            </View>
            <TouchableOpacity><Text style={styles.lihatSemua}>Lihat Semua <FontAwesome5 name="chevron-right" size={8}/></Text></TouchableOpacity>
          </View>

          {!topTask ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="shield-alt" size={24} color="#d1d5db" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>Aman boss! Ngga ada misi darurat.</Text>
            </View>
          ) : (
            <View style={styles.radarCardWrapper}>
              
              {/* Overlay Konfirmasi */}
              {konfirmasiTask && (
                <View style={styles.konfirmasiOverlay}>
                  <Text style={styles.konfirmasiText}>Yakin tugas ini udah kelar bro? 🤔</Text>
                  <View style={styles.konfirmasiBtnRow}>
                    <TouchableOpacity onPress={() => setKonfirmasiTask(false)} style={styles.btnBatal}><Text style={styles.btnBatalText}>Batal</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => selesaiTugas(topTask.id)} style={styles.btnYakin}><Text style={styles.btnYakinText}>Yakin, Sikat!</Text></TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.radarCard}>
                <View style={styles.radarRedGlow} />
                <TouchableOpacity onPress={() => setKonfirmasiTask(true)} style={styles.btnCheck}>
                  <FontAwesome5 name="check" size={10} color="#f87171" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1, padding: 8 }} onPress={() => setPreviewData({
                  visible: true,
                  title: topTask.title,
                  text: topTask.detail || 'Tidak ada detail khusus untuk misi ini.',
                  date: topTask.due_date,
                  color: '#fef2f2',
                  icon: 'bolt'
                })}>
                  <Text style={styles.radarTitle} numberOfLines={1}>{topTask.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <View style={styles.badgePriority}><FontAwesome5 name="fire" size={8} color="#fff" /> <Text style={styles.badgePriorityText}>{topTask.priority}</Text></View>
                    <Text style={styles.radarDate}><FontAwesome5 name="clock" size={8} /> {topTask.due_date === 'hari_ini' ? 'Hari Ini' : topTask.due_date === 'besok' ? 'Besok' : topTask.due_date}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* === 4. QUICK NOTES PREMIUM SCROLL === */}
        <View style={styles.sectionMargin}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}><FontAwesome5 name="bolt" color="#dc2626" />  Quick Notes</Text>
          
          {notes.length === 0 ? (
            <View style={styles.emptyNotes}><Text style={styles.emptyText}>Belum ada ide tersimpan.</Text></View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
              {notes.map((note, index) => {
                const theme = themeList[index % 4];
                return (
                  <TouchableOpacity 
                    key={note.id} 
                    style={[styles.noteCard, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => setPreviewData({
                      visible: true,
                      title: note.title,
                      text: note.content,
                      date: new Date(note.created_at).toLocaleString('id-ID', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}),
                      color: theme.bg,
                      icon: note.icon || 'lightbulb'
                    })}
                  >
                    <TouchableOpacity onPress={() => hapusCatatan(note.id)} style={styles.btnHapusCatatan}>
                      <FontAwesome5 name="times" size={10} color="#9ca3af" />
                    </TouchableOpacity>
                    
                    <FontAwesome5 name={note.icon || 'lightbulb'} size={20} color={theme.text} style={{ marginBottom: 12, marginTop: 4 }} />
                    <Text style={[styles.noteCardTitle, { color: '#111827' }]} numberOfLines={1}>{note.title}</Text>
                    <Text style={styles.noteCardSub} numberOfLines={2}>{note.content}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

      </ScrollView>

      {/* === NAVBAR BAWAH === */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}><FontAwesome5 name="home" size={20} color="#dc2626" /><Text style={[styles.navText, {color: '#dc2626'}]}>BERANDA</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><FontAwesome5 name="wallet" size={20} color="#9ca3af" /><Text style={styles.navText}>DOMPET</Text></TouchableOpacity>
        
        <View style={styles.plusContainer}>
          <View style={styles.plusGlow} />
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.btnPlus}>
            <FontAwesome5 name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem}><FontAwesome5 name="rocket" size={20} color="#9ca3af" /><Text style={styles.navText}>PORTAL</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><FontAwesome5 name="robot" size={20} color="#9ca3af" /><Text style={styles.navText}>ASISTEN</Text></TouchableOpacity>
      </View>

      {/* === MODAL ADD MENU (KOMPONEN LU YANG UDAH JADI) === */}
      <AddMenuModal visible={modalVisible} onClose={() => setModalVisible(false)} onSuccess={loadDataDariDatabase} />

      {/* === MODAL EDIT TARGET TABUNGAN === */}
      <Modal visible={editTargetMode} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => setEditTargetMode(false)} />
          <View style={styles.editTargetBox}>
            <Text style={styles.editTargetTitle}>Ubah Target Tabungan</Text>
            
            <Text style={styles.editTargetLabel}>MIMPI BARU KAMU</Text>
            <TextInput value={inputNamaTarget} onChangeText={setInputNamaTarget} placeholder="Misal: Liburan ke Bali" style={styles.editTargetInput} />
            
            <Text style={styles.editTargetLabel}>BUTUH DANA BERAPA?</Text>
            <View style={styles.inputTargetRow}>
              <Text style={styles.rpTextTarget}>Rp</Text>
              <TextInput value={inputNominalTarget} onChangeText={formatInputTarget} keyboardType="numeric" style={styles.inputNominalTarget} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
              <TouchableOpacity onPress={() => setEditTargetMode(false)} style={styles.btnBatalEdit}><Text style={styles.btnBatalEditText}>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={simpanTarget} style={styles.btnSimpanEdit}><Text style={styles.btnSimpanEditText}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* === MODAL PREVIEW GELEMBUNG (CATATAN & TUGAS) === */}
      <Modal visible={previewData.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => setPreviewData({ ...previewData, visible: false })} />
          <View style={styles.previewBox}>
            <View style={[styles.previewHeader, { backgroundColor: previewData.color }]}>
              <View style={[styles.previewIconBox, { backgroundColor: '#fff' }]}>
                <FontAwesome5 name={previewData.icon} size={18} color="#111827" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.previewTitle} numberOfLines={1}>{previewData.title}</Text>
                <Text style={styles.previewDate}>{previewData.date}</Text>
              </View>
              <TouchableOpacity onPress={() => setPreviewData({ ...previewData, visible: false })} style={styles.btnPreviewClose}>
                <FontAwesome5 name="times" size={14} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 250 }} contentContainerStyle={{ padding: 20 }}>
              <Text style={styles.previewContent}>{previewData.text}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  
  // Header Profile
  headerProfile: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 15 },
  greetingTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 4 },
  greetingSub: { fontSize: 9, fontWeight: 'bold', color: '#6b7280', marginBottom: 12, fontStyle: 'italic' },
  badgeLocal: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e7eb', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
  dotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#dc2626' },
  textLocal: { fontSize: 9, fontWeight: '900', color: '#4b5563', letterSpacing: 1 },
  avatarBox: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#ef4444', alignItems: 'center', justifyContent: 'center', marginLeft: 15, backgroundColor: '#fee2e2' },
  avatarText: { fontSize: 18, fontWeight: '900', color: '#ef4444' },
  levelBadge: { position: 'absolute', bottom: -5, right: -5, width: 20, height: 20, backgroundColor: '#dc2626', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  levelText: { fontSize: 10, fontWeight: '900', color: '#fff' },

  // Kartu Kas Premium
  cardKas: { borderRadius: 32, padding: 24, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  glowRed: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, backgroundColor: '#ef4444', borderRadius: 90, opacity: 0.15 },
  glowBlue: { position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, backgroundColor: '#3b82f6', borderRadius: 90, opacity: 0.15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, zIndex: 10 },
  cardTitle: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1 },
  totalNominal: { fontSize: 38, fontWeight: '900', color: '#fff', marginBottom: 25, zIndex: 10 },
  
  progressBox: { backgroundColor: 'rgba(255,255,255,0.08)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', zIndex: 10 },
  targetText: { fontSize: 10, color: '#9ca3af' },
  percentBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  percentText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  btnEdit: { backgroundColor: 'rgba(255,255,255,0.15)', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trackBar: { width: '100%', height: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  filledBar: { height: '100%', borderRadius: 4 },
  sisaText: { fontSize: 10, color: '#9ca3af', textAlign: 'right', fontWeight: 'bold', letterSpacing: 0.5 },

  // Mini Terminal Log
  terminalContainer: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', marginHorizontal: 24, padding: 15, borderRadius: 16, marginTop: -5 },
  terminalHeader: { fontSize: 10, fontWeight: '900', color: '#9ca3af' },
  terminalText: { fontSize: 10, fontFamily: 'monospace', color: '#4b5563', marginBottom: 4 },
  terminalTextEmpty: { fontSize: 10, fontFamily: 'monospace', color: '#9ca3af', fontStyle: 'italic' },

  // Sections Common
  sectionMargin: { marginTop: 25, paddingHorizontal: 24 },
  sectionHeaderBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  redLinePulse: { width: 4, height: 16, backgroundColor: '#dc2626', borderRadius: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: '#1f2937' },
  lihatSemua: { fontSize: 10, fontWeight: 'bold', color: '#9ca3af' },

  emptyState: { padding: 20, backgroundColor: '#f9fafb', borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af' },

  // Radar Prioritas Card
  radarCardWrapper: { position: 'relative' },
  radarCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#fee2e2', overflow: 'hidden' },
  radarRedGlow: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#ef4444' },
  btnCheck: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fecaca', alignItems: 'center', justifyContent: 'center', marginLeft: 8, elevation: 1 },
  radarTitle: { fontSize: 14, fontWeight: '900', color: '#7f1d1d' },
  badgePriority: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgePriorityText: { fontSize: 8, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },
  radarDate: { fontSize: 10, fontWeight: 'bold', color: '#ef4444' },

  konfirmasiOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 20, borderRadius: 20, borderWidth: 1, borderColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', padding: 10 },
  konfirmasiText: { fontSize: 12, fontWeight: '900', color: '#1f2937', marginBottom: 8 },
  konfirmasiBtnRow: { flexDirection: 'row', gap: 10 },
  btnBatal: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 8 },
  btnBatalText: { fontSize: 10, fontWeight: 'bold', color: '#6b7280' },
  btnYakin: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#ef4444', borderRadius: 8, elevation: 2 },
  btnYakinText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },

  // Quick Notes Horizontal
  emptyNotes: { padding: 15, backgroundColor: '#f9fafb', borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  noteCard: { width: 160, padding: 16, borderRadius: 24, borderWidth: 1, marginRight: 12, position: 'relative' },
  btnHapusCatatan: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  noteCardTitle: { fontSize: 13, fontWeight: '900', marginBottom: 4 },
  noteCardSub: { fontSize: 10, fontWeight: '600', color: '#6b7280', lineHeight: 14 },

  // Modal Overlay Standard
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  // Edit Target Modal
  editTargetBox: { width: '100%', backgroundColor: '#fff', borderRadius: 30, padding: 25, elevation: 15 },
  editTargetTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 20 },
  editTargetLabel: { fontSize: 10, fontWeight: '900', color: '#6b7280', letterSpacing: 1, marginBottom: 8 },
  editTargetInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 15, padding: 15, fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  inputTargetRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 15, paddingHorizontal: 15 },
  rpTextTarget: { fontSize: 16, fontWeight: '900', color: '#9ca3af', marginRight: 8 },
  inputNominalTarget: { flex: 1, paddingVertical: 15, fontSize: 16, fontWeight: 'bold', color: '#111827' },
  btnBatalEdit: { flex: 1, padding: 15, backgroundColor: '#f3f4f6', borderRadius: 15, alignItems: 'center' },
  btnBatalEditText: { fontSize: 14, fontWeight: 'bold', color: '#4b5563' },
  btnSimpanEdit: { flex: 1, padding: 15, backgroundColor: '#dc2626', borderRadius: 15, alignItems: 'center', elevation: 3 },
  btnSimpanEditText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  // Preview Modal
  previewBox: { width: '100%', backgroundColor: '#fff', borderRadius: 30, overflow: 'hidden', elevation: 15 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  previewIconBox: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  previewTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  previewDate: { fontSize: 10, fontWeight: 'bold', color: '#6b7280', marginTop: 2 },
  btnPreviewClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 1 },
  previewContent: { fontSize: 14, color: '#374151', lineHeight: 24, fontWeight: '500' },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 15, justifyContent: 'space-between', alignItems: 'center' },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 9, fontWeight: '900', marginTop: 5, letterSpacing: 1 },
  plusContainer: { flex: 1, alignItems: 'center', position: 'relative', top: -20 },
  plusGlow: { position: 'absolute', width: 60, height: 60, backgroundColor: '#dc2626', borderRadius: 30, opacity: 0.3, top: -4 },
  btnPlus: { width: 56, height: 56, backgroundColor: '#dc2626', borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5 },
});