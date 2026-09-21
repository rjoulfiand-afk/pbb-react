import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  
  // Siapin mesin animasi
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // 🧠 Logika Pengecekan Sesi Login
    const checkSession = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('pn_mail');
        if (savedEmail) {
          router.replace('/dashboard'); // Udah login? Langsung ke Dashboard
        } else {
          router.replace('/login'); // Belum login? Lempar ke halaman Login
        }
      } catch (error) {
        router.replace('/login'); // Kalau ada error baca storage, amanin ke login
      }
    };

    const timer = setTimeout(() => {
      checkSession();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }], alignItems: 'center' }}>
        {/* Icon Petir (Aman dari crash Android) */}
        <FontAwesome5 name="bolt" size={80} color="white" />
        {/* Teks PRINO */}
        <Text style={styles.text}>PRINO</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dc2626', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 8,
    marginTop: 10,
    textShadowColor: '#8b0000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 1,
    fontStyle: 'italic',
  }
});