import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export default function CustomImage({ source, style }) {
  const [loading, setLoading] = useState(true);
  
  return (
    <View style={[styles.container, style]}>
      {loading && <ActivityIndicator style={styles.loader} size="small" color="#000" />}
      <Image source={source} style={[style, styles.img]} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderWidth: 1, borderColor: '#ddd' },
  loader: { position: 'absolute', zIndex: 1 },
  img: { position: 'absolute', width: '100%', height: '100%' }
});