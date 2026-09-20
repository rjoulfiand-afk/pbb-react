import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { setupDatabase } from '../../database/setup'; // Pastikan path ini sesuai

export default function RootLayout() {
  return (

    <SQLiteProvider databaseName="primenotes_v2.db" onInit={setupDatabase}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </SQLiteProvider>
  );
}