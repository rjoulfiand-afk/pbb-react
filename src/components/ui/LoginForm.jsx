import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} />
      <Pressable style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.5 : 1 }]}>
        <Text style={styles.btnText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, color: '#333' },
  btn: { backgroundColor: '#007BFF', padding: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});