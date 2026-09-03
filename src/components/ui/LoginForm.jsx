import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email Sekolah" keyboardType="email-address" value={email} onChangeText={setEmail} placeholderTextColor="#9CA3AF" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} placeholderTextColor="#9CA3AF" />
      <Pressable style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
        <Text style={styles.btnText}>Login Aplikasi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, elevation: 1 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 14, color: '#1F2937' },
  btn: { backgroundColor: '#4C1D95', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});