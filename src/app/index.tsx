import { ScrollView, StyleSheet } from "react-native";
import Svar from "./svar";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Svar/> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 50, 
    backgroundColor: "#f0f4f8",
  },
});