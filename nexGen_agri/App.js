import { useEffect } from "react";
import { LogBox, Platform, StatusBar, StyleSheet } from "react-native";
import { database } from "./SQLite";
import Route from "./src/Route";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  useEffect(() => {
    //database.deleteDatabase();
    database.init();
  }, []);

  LogBox.ignoreAllLogs();

  return (
    <AuthProvider>
      <Route />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "green",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
