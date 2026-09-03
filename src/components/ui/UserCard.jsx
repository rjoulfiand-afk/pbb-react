import { Image, StyleSheet, Text, View } from 'react-native';

export default function UserCard({ name, status, imageUrl }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
      <View style={styles.infoBox}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={[styles.statusText, status === 'Aktif' ? styles.textAktif : styles.textAlumni]}>
          Status: {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#eee' },
  infoBox: { flex: 1 },
  nameText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 14, marginTop: 2 },
  textAktif: { color: 'green' },
  textAlumni: { color: 'gray' }
});