import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function MyButton({ title, onPress, variant = 'primary' }) {
  const colors = { primary: '#007BFF', success: '#28A745', danger: '#DC3545' };
  
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: colors[variant] }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 12, alignItems: 'center', marginBottom: 8, borderRadius: 4 },
  text: { color: '#fff', fontWeight: 'bold' }
});