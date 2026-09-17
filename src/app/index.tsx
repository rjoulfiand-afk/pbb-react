import { FontAwesome5 } from '@expo/vector-icons';
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
    // Jalankan animasi (Nyambar & Muncul)
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

    // Pindah ke Login setelah 3 detik
    const timer = setTimeout(() => {
      router.replace('/login');
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
    backgroundColor: '#dc2626', // Merah cetar Tailwind (red-600)
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