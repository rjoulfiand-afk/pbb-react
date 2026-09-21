import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite'; // 👈 Cuma butuh ini dari expo-sqlite
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const PaperLines = () => (
  <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]} pointerEvents="none">
    {Array.from({ length: 30 }).map((_, i) => (
      <View key={i} style={{ height: 32, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }} />
    ))}
    <View style={{ position: 'absolute', left: 40, top: 0, bottom: 0, width: 2, backgroundColor: '#fca5a5', opacity: 0.5 }} />
  </View>
);

export default function AddMenuModal({ visible, onClose, onSuccess }: { visible: boolean, onClose: () => void, onSuccess: () => void }) {
  
  // ✅ PASANG KABEL DATABASE BARU DI SINI!
  const db = useSQLiteContext();


  const [activeForm, setActiveForm] = useState<'menu' | 'nabung' | 'keluar' | 'tugas' | 'catatan'>('menu');

  const [uangStr, setUangStr] = useState('');
  const [keteranganNabung, setKeteranganNabung] = useState('');
  const formatRupiah = (text: string) => { let angka = text.replace(/[^0-9]/g, ''); setUangStr(angka ? new Intl.NumberFormat('id-ID').format(parseInt(angka)) : ''); };
  const tambahUang = (nominal: number, reset = false) => { if (reset) { setUangStr(''); return; } let current = parseInt(uangStr.replace(/[^0-9]/g, '')) || 0; setUangStr(new Intl.NumberFormat('id-ID').format(current + nominal)); };
  const simpanNabung = () => {
    const amount = parseInt(uangStr.replace(/[^0-9]/g, '')) || 0;
    if (amount <= 0) { Alert.alert("Eits", "Masukkan nominal setoran!"); return; }
    try {
      db.runSync(`INSERT INTO savings (amount, purpose, saved_at, created_at) VALUES (?, ?, ?, datetime('now'))`, [amount, keteranganNabung === '' ? 'Tabungan Rutin' : keteranganNabung, new Date().toISOString()]);
      onSuccess(); resetAndClose();
    } catch (e: any) { Alert.alert("Gagal Database", e.message); }
  };

  const [uangKeluarStr, setUangKeluarStr] = useState('');
  const [keteranganKeluar, setKeteranganKeluar] = useState('');
  const formatRupiahKeluar = (text: string) => { let angka = text.replace(/[^0-9]/g, ''); setUangKeluarStr(angka ? new Intl.NumberFormat('id-ID').format(parseInt(angka)) : ''); };
  const tambahUangKeluar = (nominal: number, reset = false) => { if (reset) { setUangKeluarStr(''); return; } let current = parseInt(uangKeluarStr.replace(/[^0-9]/g, '')) || 0; setUangKeluarStr(new Intl.NumberFormat('id-ID').format(current + nominal)); };
  const simpanKeluar = () => {
    const amount = parseInt(uangKeluarStr.replace(/[^0-9]/g, '')) || 0;
    if (amount <= 0) { Alert.alert("Eits", "Masukkan nominal pengeluaran!"); return; }
    try {
      db.runSync(`INSERT INTO expenses (amount, description, created_at) VALUES (?, ?, datetime('now'))`, [amount, keteranganKeluar === '' ? 'Lain-lain' : keteranganKeluar]);
      onSuccess(); resetAndClose();
    } catch (e: any) { Alert.alert("Gagal Database", e.message); }
  };

  const [judulTugas, setJudulTugas] = useState('');
  const [detailTugas, setDetailTugas] = useState('');
  const [taskPriority, setTaskPriority] = useState('normal');
  const [taskDate, setTaskDate] = useState('besok');
  const [customDateVal, setCustomDateVal] = useState('');
  const simpanTugas = () => {
    if (!judulTugas) { Alert.alert("Eits", "Judul misi wajib diisi!"); return; }
    const finalDate = taskDate === 'custom' ? customDateVal : taskDate;
    try {
      db.runSync(`INSERT INTO tasks (title, priority, due_date, detail, is_completed, created_at) VALUES (?, ?, ?, ?, 0, datetime('now'))`, [judulTugas, taskPriority, finalDate, detailTugas]);
      Alert.alert("Sukses!", "Misi baru ditambahkan ke Radar! 🔥");
      onSuccess(); resetAndClose();
    } catch (e: any) { Alert.alert("Gagal Database", e.message); }
  };

  const [judulCatatan, setJudulCatatan] = useState('');
  const [isiCatatan, setIsiCatatan] = useState('');
  const simpanCatatan = () => {
    if (!judulCatatan.trim() && !isiCatatan.trim()) { Alert.alert("Waduh", "Catatannya kosong boss! 😂"); return; }
    const finalJudul = judulCatatan.trim() ? judulCatatan : 'Ide Dadakan';
    try {
      db.runSync(`INSERT INTO notes (title, content, icon) VALUES (?, ?, ?)`, [finalJudul, isiCatatan, 'lightbulb']);
      Alert.alert("Sukses!", "Ide cemerlang berhasil disimpan! 💡");
      onSuccess(); resetAndClose();
    } catch (e: any) { Alert.alert("Gagal Database", e.message); }
  };

  const resetAndClose = () => {
    setActiveForm('menu');
    setUangStr(''); setKeteranganNabung('');
    setUangKeluarStr(''); setKeteranganKeluar('');
    setJudulTugas(''); setDetailTugas('');
    setTaskPriority('normal'); setTaskDate('besok'); setCustomDateVal('');
    setJudulCatatan(''); setIsiCatatan('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={resetAndClose}>
      {/* 💡 FIX: Pakai KeyboardAvoidingView yang bener + modal auto-tinggi */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={resetAndClose} />
        
        <View style={[styles.bottomSheet, activeForm === 'menu' ? styles.sheetAuto : styles.sheetFull]}>
          <View style={styles.indicatorBar} />

          {activeForm === 'menu' && (
            <View style={styles.menuContainer}>
              <Text style={styles.mainTitle}>Mau catat apa sekarang?</Text>
              <View style={styles.gridMenu}>
                <TouchableOpacity onPress={() => setActiveForm('nabung')} style={styles.menuItem}>
                  <View style={[styles.iconBoxMenu, {backgroundColor: '#ecfdf5'}]}><FontAwesome5 name="piggy-bank" size={24} color="#10b981" /></View>
                  <Text style={styles.menuTitle}>Nabung</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveForm('keluar')} style={styles.menuItem}>
                  <View style={[styles.iconBoxMenu, {backgroundColor: '#fef2f2'}]}><FontAwesome5 name="shopping-cart" size={24} color="#ef4444" /></View>
                  <Text style={styles.menuTitle}>Keluar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveForm('tugas')} style={styles.menuItem}>
                  <View style={[styles.iconBoxMenu, {backgroundColor: '#fff7ed'}]}><FontAwesome5 name="clipboard-check" size={24} color="#f97316" /></View>
                  <Text style={styles.menuTitle}>Tugas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveForm('catatan')} style={styles.menuItem}>
                  <View style={[styles.iconBoxMenu, {backgroundColor: '#eff6ff'}]}><FontAwesome5 name="pen-nib" size={24} color="#3b82f6" /></View>
                  <Text style={styles.menuTitle}>Catatan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeForm === 'nabung' && (
            <LinearGradient colors={['#ecfdf5', '#ffffff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.emeraldHeader}>
              <View style={styles.emeraldGlow} />
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => setActiveForm('menu')} style={styles.btnBackEmerald}><FontAwesome5 name="chevron-left" size={16} color="#059669" /></TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16, zIndex: 10 }}><Text style={styles.emeraldTitle}>Setor Tabungan</Text><Text style={styles.emeraldSub}>AMANKAN UANGMU HARI INI</Text></View>
                <View style={styles.emeraldIconBox}><FontAwesome5 name="wallet" size={24} color="#10b981" /></View>
              </View>
            </LinearGradient>
          )}

          {activeForm === 'keluar' && (
            <LinearGradient colors={['#fef2f2', '#ffffff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.emeraldHeader}>
              <View style={styles.redGlow} />
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => setActiveForm('menu')} style={styles.btnBackRed}><FontAwesome5 name="chevron-left" size={16} color="#dc2626" /></TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16, zIndex: 10 }}><Text style={styles.emeraldTitle}>Pengeluaran</Text><Text style={[styles.emeraldSub, {color: '#dc2626'}]}>WADUH, JAJAN APA NIH?</Text></View>
                <View style={styles.redIconBox}><FontAwesome5 name="receipt" size={24} color="#ef4444" /></View>
              </View>
            </LinearGradient>
          )}

          {activeForm === 'tugas' && (
            <LinearGradient colors={['#fff7ed', '#ffffff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.emeraldHeader}>
              <View style={styles.orangeGlow} />
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => setActiveForm('menu')} style={styles.btnBackOrange}><FontAwesome5 name="chevron-left" size={16} color="#ea580c" /></TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16, zIndex: 10 }}><Text style={styles.emeraldTitle}>Misi Baru</Text><Text style={[styles.emeraldSub, {color: '#ea580c'}]}>SELESAIKAN & DAPATKAN PIAGAM</Text></View>
                <View style={styles.orangeIconBox}><FontAwesome5 name="award" size={24} color="#f97316" /></View>
              </View>
            </LinearGradient>
          )}

          {activeForm === 'catatan' && (
            <LinearGradient colors={['#eff6ff', '#ffffff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.emeraldHeader}>
              <View style={styles.blueGlow} />
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => setActiveForm('menu')} style={styles.btnBackBlue}><FontAwesome5 name="chevron-left" size={16} color="#2563eb" /></TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16, zIndex: 10 }}><Text style={styles.emeraldTitle}>Catatan Baru</Text><Text style={[styles.emeraldSub, {color: '#2563eb'}]}>SIMPAN IDE & RENCANAMU</Text></View>
                <View style={styles.blueIconBox}><FontAwesome5 name="book-open" size={20} color="#3b82f6" /></View>
              </View>
            </LinearGradient>
          )}

          {activeForm !== 'menu' && (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.contentScroll, activeForm === 'catatan' && { flexGrow: 1 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              
              {activeForm === 'nabung' && (
                <View style={{paddingTop: 5}}>
                  <View style={styles.darkCard}>
                    <View style={styles.darkCardGlow} />
                    <Text style={styles.darkCardLabel}>NOMINAL SETORAN</Text>
                    <View style={styles.inputAmountWrapper}>
                      <View style={styles.inputAmountRow}>
                        <Text style={styles.rpText}>Rp</Text>
                        <TextInput value={uangStr} onChangeText={formatRupiah} placeholder="0" placeholderTextColor="#4b5563" keyboardType="numeric" style={styles.bigAmountInput} />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.sectionLabel}><FontAwesome5 name="bolt" color="#10b981" />  NOMINAL CEPAT</Text>
                  <View style={styles.quickGrid}>
                    <TouchableOpacity onPress={() => tambahUang(10000)} style={styles.quickBtn}><Text style={styles.quickBtnText}>+ 10rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUang(20000)} style={styles.quickBtn}><Text style={styles.quickBtnText}>+ 20rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUang(50000)} style={styles.quickBtn}><Text style={styles.quickBtnText}>+ 50rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUang(100000)} style={styles.quickBtn}><Text style={styles.quickBtnText}>+ 100rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUang(0, true)} style={styles.resetBtn}><Text style={styles.resetBtnText}><FontAwesome5 name="eraser" />  Reset Uang</Text></TouchableOpacity>
                  </View>

                  <Text style={styles.sectionLabel}><FontAwesome5 name="tag" color="#10b981" />  SUMBER DANA</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll} keyboardShouldPersistTaps="handled">
                    {['Sisa Jajan', 'Gaji Freelance', 'Jual Project'].map((item) => (
                      <TouchableOpacity key={item} onPress={() => setKeteranganNabung(item)} style={[styles.pill, keteranganNabung === item ? styles.pillActive : styles.pillInactive]}>
                        <Text style={[styles.pillText, keteranganNabung === item ? {color: '#fff'} : {color: '#6b7280'}]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TextInput value={keteranganNabung} onChangeText={setKeteranganNabung} placeholder="Ketik keterangan sendiri..." placeholderTextColor="#9ca3af" style={styles.customInput} />
                </View>
              )}

              {activeForm === 'keluar' && (
                <View style={{paddingTop: 5}}>
                  <View style={styles.darkCard}>
                    <View style={styles.redDarkCardGlow} />
                    <Text style={styles.darkCardLabel}>NOMINAL KELUAR</Text>
                    <View style={styles.inputAmountWrapper}>
                      <View style={styles.inputAmountRow}>
                        <Text style={styles.rpTextRed}>Rp</Text>
                        <TextInput value={uangKeluarStr} onChangeText={formatRupiahKeluar} placeholder="0" placeholderTextColor="#4b5563" keyboardType="numeric" style={styles.bigAmountInput} />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.sectionLabel}><FontAwesome5 name="bolt" color="#ef4444" />  NOMINAL CEPAT</Text>
                  <View style={styles.quickGrid}>
                    <TouchableOpacity onPress={() => tambahUangKeluar(10000)} style={styles.quickBtnRed}><Text style={styles.quickBtnTextRed}>+ 10rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUangKeluar(20000)} style={styles.quickBtnRed}><Text style={styles.quickBtnTextRed}>+ 20rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUangKeluar(50000)} style={styles.quickBtnRed}><Text style={styles.quickBtnTextRed}>+ 50rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUangKeluar(100000)} style={styles.quickBtnRed}><Text style={styles.quickBtnTextRed}>+ 100rb</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => tambahUangKeluar(0, true)} style={styles.resetBtn}><Text style={styles.resetBtnText}><FontAwesome5 name="eraser" />  Reset Uang</Text></TouchableOpacity>
                  </View>

                  <Text style={styles.sectionLabel}><FontAwesome5 name="tag" color="#ef4444" />  BUAT APA?</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll} keyboardShouldPersistTaps="handled">
                    {['Makan / Minum', 'Bensin / Parkir', 'Kuota Internet'].map((item) => (
                      <TouchableOpacity key={item} onPress={() => setKeteranganKeluar(item)} style={[styles.pill, keteranganKeluar === item ? styles.pillActive : styles.pillInactive]}>
                        <Text style={[styles.pillText, keteranganKeluar === item ? {color: '#fff'} : {color: '#6b7280'}]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TextInput value={keteranganKeluar} onChangeText={setKeteranganKeluar} placeholder="Ketik rincian pengeluaranmu..." placeholderTextColor="#9ca3af" style={styles.customInput} />
                </View>
              )}

              {activeForm === 'tugas' && (
                <View style={{paddingTop: 10}}>
                  <TextInput value={judulTugas} onChangeText={setJudulTugas} placeholder="Tulis tugasmu disini..." placeholderTextColor="#d1d5db" style={styles.titleDashedInput} />
                  
                  <Text style={styles.sectionLabel}><FontAwesome5 name="fire" color="#f97316" />  SEBERAPA PENTING?</Text>
                  <View style={styles.quickGrid}>
                    <TouchableOpacity onPress={() => setTaskPriority('santai')} style={[styles.priorityCard, taskPriority === 'santai' ? styles.prioritySantai : styles.priorityInactive]}>
                      <FontAwesome5 name="coffee" size={16} color={taskPriority === 'santai' ? '#fff' : '#9ca3af'} style={{marginBottom: 8}} />
                      <Text style={[styles.priorityText, taskPriority === 'santai' && {color: '#fff'}]}>Santai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTaskPriority('normal')} style={[styles.priorityCard, taskPriority === 'normal' ? styles.priorityNormal : styles.priorityInactive]}>
                      <FontAwesome5 name="book" size={16} color={taskPriority === 'normal' ? '#fff' : '#9ca3af'} style={{marginBottom: 8}} />
                      <Text style={[styles.priorityText, taskPriority === 'normal' && {color: '#fff'}]}>Normal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTaskPriority('mendesak')} style={[styles.priorityCard, taskPriority === 'mendesak' ? styles.priorityMendesak : styles.priorityInactive]}>
                      <FontAwesome5 name="bolt" size={16} color={taskPriority === 'mendesak' ? '#fff' : '#9ca3af'} style={{marginBottom: 8}} />
                      <Text style={[styles.priorityText, taskPriority === 'mendesak' && {color: '#fff'}]}>Mendesak</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.sectionLabel}><FontAwesome5 name="clock" color="#f97316" />  KAPAN DIKUMPULKAN?</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll} keyboardShouldPersistTaps="handled">
                    {['hari_ini', 'besok', 'custom'].map((item) => (
                      <TouchableOpacity key={item} onPress={() => setTaskDate(item)} style={[styles.pill, taskDate === item ? styles.pillActive : styles.pillInactive]}>
                        {item === 'custom' ? (
                          <Text style={[styles.pillText, taskDate === item ? {color: '#fff'} : {color: '#6b7280'}]}><FontAwesome5 name="calendar-alt" /> Pilih Tanggal</Text>
                        ) : (
                          <Text style={[styles.pillText, taskDate === item ? {color: '#fff'} : {color: '#6b7280'}]}>{item === 'hari_ini' ? 'Hari Ini' : 'Besok'}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {taskDate === 'custom' && (
                    <TextInput value={customDateVal} onChangeText={setCustomDateVal} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" style={styles.customInput} />
                  )}

                  <Text style={[styles.sectionLabel, {marginTop: 5}]}><FontAwesome5 name="pen" color="#f97316" />  DETAIL (OPSIONAL)</Text>
                  <TextInput value={detailTugas} onChangeText={setDetailTugas} placeholder="Misal: Tugas dari Pak Guru..." placeholderTextColor="#d1d5db" multiline style={styles.yellowTextarea} />
                </View>
              )}

              {activeForm === 'catatan' && (
                <View style={{ paddingTop: 10, flex: 1 }}>
                  <TextInput value={judulCatatan} onChangeText={setJudulCatatan} placeholder="Judul Catatan..." placeholderTextColor="#d1d5db" style={styles.noteTitleInput} />
                  <View style={styles.paperWrapper}>
                    <PaperLines />
                    <TextInput value={isiCatatan} onChangeText={setIsiCatatan} placeholder="Mulai mengetik ide cemerlangmu di sini..." placeholderTextColor="#9ca3af" multiline style={styles.noteContentInput} />
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          {activeForm !== 'menu' && (
            <View style={styles.fixedFooter}>
              {activeForm === 'nabung' && (
                <TouchableOpacity onPress={simpanNabung} style={styles.btnSimpanNabung}>
                  <FontAwesome5 name="lock" size={14} color="#fff" />
                  <Text style={styles.btnSimpanText}>Simpan Tabungan</Text>
                </TouchableOpacity>
              )}
              {activeForm === 'keluar' && (
                <TouchableOpacity onPress={simpanKeluar} style={styles.btnSimpanKeluar}>
                  <FontAwesome5 name="minus-circle" size={16} color="#fff" />
                  <Text style={styles.btnSimpanText}>Catat Pengeluaran</Text>
                </TouchableOpacity>
              )}
              {activeForm === 'tugas' && (
                <TouchableOpacity onPress={simpanTugas} style={styles.btnSimpanTugas}>
                  <FontAwesome5 name="paper-plane" size={16} color="#fff" />
                  <Text style={styles.btnSimpanText}>Sikat Misi Ini!</Text>
                </TouchableOpacity>
              )}
              {activeForm === 'catatan' && (
                <TouchableOpacity onPress={simpanCatatan} style={styles.btnSimpanCatatan}>
                  <FontAwesome5 name="save" size={16} color="#fff" />
                  <Text style={styles.btnSimpanText}>Simpan Catatan</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.6)', justifyContent: 'flex-end' },
  
  // 💡 FIX 4: Tinggi modalnya diubah jadi persen, biar ngga error pas keyboard nongol!
  bottomSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 40, borderTopRightRadius: 40, elevation: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.2, shadowRadius: 20, overflow: 'hidden' },
  sheetAuto: { paddingBottom: 40 }, 
  sheetFull: { height: '95%' }, 

  indicatorBar: { position: 'absolute', top: 12, left: '50%', marginLeft: -24, width: 48, height: 5, backgroundColor: '#e5e7eb', borderRadius: 3, zIndex: 50 },
  
  menuContainer: { paddingHorizontal: 30, paddingTop: 35 },
  mainTitle: { fontSize: 18, fontWeight: '900', color: '#1f2937', textAlign: 'center', marginBottom: 25 },
  gridMenu: { flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  menuItem: { alignItems: 'center', width: 68 },
  iconBoxMenu: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  menuTitle: { fontSize: 10, fontWeight: 'bold', color: '#4b5563', textAlign: 'center' },

  emeraldHeader: { paddingHorizontal: 24, paddingVertical: 24, paddingTop: 35, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', position: 'relative' },
  emeraldGlow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: '#a7f3d0', borderRadius: 60, opacity: 0.4 },
  redGlow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: '#fecaca', borderRadius: 60, opacity: 0.4 },
  orangeGlow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: '#fed7aa', borderRadius: 60, opacity: 0.4 },
  blueGlow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: '#dbeafe', borderRadius: 60, opacity: 0.4 },
  
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  btnBackEmerald: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#d1fae5', elevation: 1, zIndex: 10 },
  btnBackRed: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fee2e2', elevation: 1, zIndex: 10 },
  btnBackOrange: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffedd5', elevation: 1, zIndex: 10 },
  btnBackBlue: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#bfdbfe', elevation: 1, zIndex: 10 },
  
  emeraldTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  emeraldSub: { fontSize: 10, fontWeight: '900', color: '#6b7280', letterSpacing: 1, marginTop: 2, textTransform: 'uppercase' },
  emeraldIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center', transform: [{rotate: '12deg'}], zIndex: 10 },
  redIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', transform: [{rotate: '-12deg'}], zIndex: 10 },
  orangeIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center', transform: [{rotate: '12deg'}], zIndex: 10 },
  blueIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', zIndex: 10 },

  contentScroll: { paddingHorizontal: 24, paddingBottom: 60, paddingTop: 5 },

  darkCard: { backgroundColor: '#111827', borderRadius: 24, paddingTop: 24, paddingBottom: 32, paddingHorizontal: 24, marginBottom: 24, elevation: 10, position: 'relative', overflow: 'hidden' },
  darkCardGlow: { position: 'absolute', right: -40, top: -40, width: 140, height: 140, backgroundColor: '#10b981', borderRadius: 70, opacity: 0.15 },
  redDarkCardGlow: { position: 'absolute', right: -40, top: -40, width: 140, height: 140, backgroundColor: '#ef4444', borderRadius: 70, opacity: 0.15 },
  darkCardLabel: { fontSize: 11, fontWeight: 'bold', color: '#9ca3af', letterSpacing: 1, textAlign: 'center', marginBottom: 12, textTransform: 'uppercase' },
  inputAmountWrapper: { alignItems: 'center' },
  inputAmountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: '#374151', paddingBottom: 6, minWidth: 160 },
  rpText: { fontSize: 32, fontWeight: '900', color: '#34d399', marginRight: 10 },
  rpTextRed: { fontSize: 32, fontWeight: '900', color: '#f87171', marginRight: 10 },
  bigAmountInput: { fontSize: 48, fontWeight: '900', color: '#ffffff', textAlign: 'center', padding: 0 },

  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, rowGap: 12 },
  quickBtn: { width: '31.5%', backgroundColor: '#ecfdf5', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  quickBtnText: { fontSize: 14, fontWeight: 'bold', color: '#059669' },
  quickBtnRed: { width: '31.5%', backgroundColor: '#fef2f2', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  quickBtnTextRed: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
  resetBtn: { width: '64.5%', backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  resetBtnText: { fontSize: 14, fontWeight: 'bold', color: '#6b7280' },

  pillsScroll: { gap: 10, marginBottom: 15, paddingRight: 20 },
  pill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, borderWidth: 2, borderColor: '#f3f4f6' },
  pillActive: { backgroundColor: '#1f2937', borderColor: '#1f2937' },
  pillInactive: { backgroundColor: '#ffffff' },
  pillText: { fontSize: 14, fontWeight: 'bold' },

  customInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 16, fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 20 },

  titleDashedInput: { fontSize: 24, fontWeight: '900', color: '#111827', borderBottomWidth: 2, borderBottomColor: '#e5e7eb', borderStyle: 'dashed', paddingBottom: 12, marginBottom: 25 },
  priorityCard: { width: '31.5%', paddingVertical: 16, borderRadius: 16, borderWidth: 2, alignItems: 'center' },
  priorityInactive: { backgroundColor: '#ffffff', borderColor: '#f3f4f6' },
  prioritySantai: { backgroundColor: '#22c55e', borderColor: '#22c55e', elevation: 4 },
  priorityNormal: { backgroundColor: '#3b82f6', borderColor: '#3b82f6', elevation: 4 },
  priorityMendesak: { backgroundColor: '#ef4444', borderColor: '#ef4444', elevation: 4 },
  priorityText: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af' },
  yellowTextarea: { backgroundColor: '#fefce8', borderWidth: 1, borderColor: '#fef08a', borderRadius: 16, padding: 16, fontSize: 14, fontWeight: 'bold', color: '#374151', minHeight: 120, textAlignVertical: 'top', marginBottom: 20 },
  
  noteTitleInput: { fontSize: 32, fontWeight: '900', color: '#111827', borderBottomWidth: 2, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 15 },
  paperWrapper: { flex: 1, position: 'relative', overflow: 'hidden', minHeight: 250, paddingBottom: 20 },
  noteContentInput: { flex: 1, fontSize: 16, fontWeight: '500', color: '#374151', textAlignVertical: 'top', lineHeight: 32, paddingTop: 5, paddingLeft: 48, paddingRight: 10, zIndex: 1 },
  
  fixedFooter: { paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff' },
  btnSimpanNabung: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 4 },
  btnSimpanKeluar: { backgroundColor: '#dc2626', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 4 },
  btnSimpanTugas: { backgroundColor: '#f97316', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 4 },
  btnSimpanCatatan: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 4 },
  btnSimpanText: { color: '#fff', fontSize: 18, fontWeight: '900' }
});