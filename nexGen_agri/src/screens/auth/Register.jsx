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
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const handleRegister = async () => {
    setIsLoading(true);
    const validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!email.endsWith("@gmail.com")) {
      validationErrors.email = "Email must be a valid Gmail address.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      validationErrors.password =
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password);
      setSnackbarMessage("Registration successful!");
      setVisible(true);
      resetAndNavigate();
    } catch (error) {
      setSnackbarMessage("Email already exist");
      setVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndNavigate = () => {
    setEmail("");

    setPassword("");
    setConfirmPassword("");
    setErrors({
      email: null,
      password: null,
      confirmPassword: null,
    });
    setTimeout(() => {
      navigation.navigate("Login");
    }, 1500);
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
          <Pressable style={styles.button} onPress={handleRegister}>
            {isLoading ? (
              <ActivityIndicator size="small" color="green" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </Pressable>
          <View style={styles.switch}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable
              style={styles.switchPressable}
              onPress={resetAndNavigate}
            >
              <Text style={styles.switchTextP}>Login</Text>
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
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </ImageBackground>
  );
};

export default Register;

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
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  text: {
    fontSize: 24,
    color: "#fff",
  },
  textColor: {
    fontSize: 24,
    marginBottom: 5,
    color: "#4CAF50",
  },
  textContainer: {
    flexDirection: "row",
    marginTop: 10,
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
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "green",
    fontSize: 16,
  },
  errorText: {
    color: "#FF0000",
    marginBottom: 10,
    fontSize: 12,
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
