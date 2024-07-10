import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { database } from "../../../SQLite";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });

  const handleLogin = async () => {
    setIsLoading(true);
    const validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await database.login(email, password);
      if (result.success) {
        console.log(result.user);
        login(result.user);
        setVisible(true);
        setTimeout(() => {
          navigation.navigate("BottomTabNavigator");
        }, 1500);

        resetAndNavigate();
      } else {
        console.log(result.message);
        setErrors({ email: result.message });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ email: "An error occurred during login." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndNavigate = () => {
    setEmail("");
    setPassword("");
    setErrors({
      email: null,
      password: null,
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.textColor}>N</Text>
            <Text style={styles.text}>e</Text>
            <Text style={styles.textColor}>x</Text>
            <Text style={styles.text}>G</Text>
            <Text style={styles.textColor}>e</Text>
            <Text style={styles.text}>N</Text>
            <Text style={styles.textColor}> </Text>
            <Text style={styles.textColor}>A</Text>
            <Text style={styles.text}>g</Text>
            <Text style={styles.textColor}>r</Text>
            <Text style={styles.text}>i</Text>
          </View>
          <Image
            source={require("../../../assets/logo.jpg")}
            style={styles.image}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <Pressable style={styles.button} onPress={handleLogin}>
            {isLoading ? (
              <ActivityIndicator size="small" color="green" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
          <View style={styles.switch}>
            <Text style={styles.switchText}>Not have an account? </Text>
            <Pressable
              style={styles.switchPressable}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text style={styles.switchTextP}>Register</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={styles.snackbar}
        wrapperStyle={styles.snackbarWrapper}
      >
        <Text style={styles.snackbarText}>Login successfully</Text>
      </Snackbar>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  textColor: {
    fontSize: 24,
    marginBottom: 20,
    color: "#4CAF50",
  },
  textContainer: {
    flexDirection: "row",
    marginTop: 40,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  button: {
    width: "40%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "green",
    fontSize: 16,
  },
  snackbar: {
    backgroundColor: "rgba(0, 128, 0, 0.8)",
  },
  snackbarWrapper: {
    top: 50,
  },
  snackbarText: {
    color: "black",
  },
  errorText: {
    color: "#FF0000",
    marginBottom: 10,
    fontSize: 12,
  },
  switch: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  switchPressable: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    // backgroundColor: "#555",
    color: "#fff",
  },
  switchText: {
    // backgroundColor: "#999",
    fontSize: 15,
    color: "#fff",
  },
  switchTextP: {
    color: "#ccc",
    marginTop: "15px",
    textDecorationLine: "underline",
    fontSize: 16,
    // color: "#fff",
  },
});
