import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function MyButton({ title, onPress, variant = 'primary' }) {
  const colors = { primary: '#4C1D95', success: '#10B981', danger: '#EF4444' };
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: colors[variant] }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginBottom: 10, elevation: 2 },
  text: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 }
});