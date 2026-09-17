import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { initDB } from '../../database/setup'; // Pastikan path ini sesuai letak file lu

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        initDB();
        setIsDbReady(true);
      } catch (error) {
        console.error("Gagal nyalain database:", error);
        setIsDbReady(true); // Tetep buka pintu walau error biar ngga stuck
      }
    };

    setupDatabase();
  }, []);

  // Layar tunggu sementara
  if (!isDbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#dc2626', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Memuat Command Center...</Text>
      </View>
    );
  }

  // Buka rute halaman
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}