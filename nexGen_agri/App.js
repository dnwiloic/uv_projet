import { useEffect } from "react";
import { LogBox, StatusBar, StyleSheet } from "react-native";
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
      <StatusBar backgroundColor="green" barStyle="light-content" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
