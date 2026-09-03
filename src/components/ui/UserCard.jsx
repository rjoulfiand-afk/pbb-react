import { Image, StyleSheet, Text, View } from 'react-native';

export default function UserCard({ name, status, imageUrl }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
      <View style={styles.infoBox}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={[styles.badge, status === 'Aktif' ? styles.badgeAktif : styles.badgeAlumni]}>
          <Text style={[styles.statusText, status === 'Aktif' ? styles.textAktif : styles.textAlumni]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#4C1D95', shadowOpacity: 0.05, shadowRadius: 10, alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#EDE9FE', marginRight: 16 },
  infoBox: { flex: 1, justifyContent: 'center' },
  nameText: { fontSize: 17, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeAktif: { backgroundColor: '#D1FAE5' },
  badgeAlumni: { backgroundColor: '#F3F4F6' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  textAktif: { color: '#059669' },
  textAlumni: { color: '#6B7280' }
});