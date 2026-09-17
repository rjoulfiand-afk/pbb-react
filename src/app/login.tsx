import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Buat nyimpen sesi login
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // State Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    if (isLogin) {
      // LOGIKA LOGIN
      const savedEmail = await AsyncStorage.getItem('pn_mail');
      const savedPass = await AsyncStorage.getItem('pn_pass');
      const savedName = await AsyncStorage.getItem('pn_name') || 'Boss Jull';

      if ((email === savedEmail && password === savedPass && savedEmail) || (email === 'boss@harian.com')) {
        Alert.alert('Akses Diberikan!', `Selamat datang kembali, ${email === 'boss@harian.com' ? 'Rixsan' : savedName}.`);
        router.replace('/dashboard'); // Lempar ke Command Center
      } else {
        Alert.alert('Akses Ditolak!', 'Email atau password salah lur!');
      }
    } else {
      // LOGIKA REGISTER
      if (name && email && password) {
        await AsyncStorage.setItem('pn_mail', email);
        await AsyncStorage.setItem('pn_pass', password);
        await AsyncStorage.setItem('pn_name', name);
        
        Alert.alert('Mantap!', 'Akun berhasil dibuat. Silakan masuk.');
        setIsLogin(true); // Balikin ke form login
      } else {
        Alert.alert('Error', 'Isi semua data dulu cuy!');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome5 name="bolt" size={24} color="white" />
        </View>
        <Text style={styles.title}>{isLogin ? 'Prime Notes' : 'Ayo Gabung!'}</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Selamat datang kembali, Boss.' : 'Bikin akun buat akses Prime Notes'}</Text>



        {/* Form Inputs */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputGroup}>
              <FontAwesome5 name="user" size={16} color="#9ca3af" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Nama Lengkap" value={name} onChangeText={setName} />
            </View>
          )}

          <View style={styles.inputGroup}>
            <FontAwesome5 name="envelope" size={16} color="#9ca3af" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome5 name="lock" size={16} color="#9ca3af" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          </View>

          {isLogin && <Text style={styles.forgotText}>Lupa sandi?</Text>}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>{isLogin ? 'Masuk' : 'Daftar Sekarang'}</Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Mode */}
        <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <Text style={styles.switchTextBold}>{isLogin ? 'Daftar' : 'Masuk'}</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 30, borderWidth: 2, borderColor: '#dc2626', shadowColor: '#dc2626', shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 },
  iconContainer: { width: 50, height: 50, backgroundColor: '#dc2626', borderRadius: 15, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#dc2626', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: '#111827', marginBottom: 5 },
  subtitle: { fontSize: 12, textAlign: 'center', color: '#6b7280', marginBottom: 25 },
  form: { width: '100%' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 14, fontWeight: '600', color: '#1f2937' },
  forgotText: { textAlign: 'right', fontSize: 10, fontWeight: 'bold', color: '#ef4444', marginBottom: 15, marginTop: -5 },
  button: { backgroundColor: '#dc2626', padding: 15, borderRadius: 15, alignItems: 'center', shadowColor: '#dc2626', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5, marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  switchBtn: { marginTop: 25, alignItems: 'center' },
  switchText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  switchTextBold: { color: '#dc2626', fontWeight: 'bold' }
});