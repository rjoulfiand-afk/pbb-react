import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { setupDatabase } from '../../database/setup'; 

export default function RootLayout() {
  return (

    <Suspense fallback={
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    }>

      <SQLiteProvider databaseName="primenotes_v2.db" onInit={setupDatabase} useSuspense={true}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          {/* Halaman login udah dihapus, jadi nggak perlu didaftarin lagi di sini */}
          <Stack.Screen name="dashboard" />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#dc2626', 
    justifyContent: 'center',
    alignItems: 'center',
  }
});