import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { database } from "./SQLite";
import Route from "./src/Route";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  useEffect(() => {
    //database.deleteDatabase();
    database.init();
  }, []);

  return (
    <AuthProvider>
      <Route />
    </AuthProvider>
    /*<View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>*/
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
