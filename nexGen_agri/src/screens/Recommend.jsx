import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PredictModal from "../components/PredictModal";

const Recommend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    humidity: "",
    rainfall: "",
    temperature: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errors, setErrors] = useState({
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    ph: null,
    humidity: null,
    rainfall: null,
    temperature: null,
  });

  const validateForm = () => {
    const validationErrors = {};

    if (
      !formData.nitrogen ||
      isNaN(formData.nitrogen) ||
      formData.nitrogen <= 0
    ) {
      validationErrors.nitrogen =
        "Nitrogen is required and must be a positive number.";
    }

    if (
      !formData.phosphorus ||
      isNaN(formData.phosphorus) ||
      formData.phosphorus <= 0
    ) {
      validationErrors.phosphorus =
        "Phosphorus is required and must be a positive number.";
    }

    if (
      !formData.potassium ||
      isNaN(formData.potassium) ||
      formData.potassium <= 0
    ) {
      validationErrors.potassium =
        "Potassium is required and must be a positive number.";
    }

    if (!formData.ph || isNaN(formData.ph) || formData.ph <= 0) {
      validationErrors.ph = "pH is required and must be a positive number.";
    }

    if (
      !formData.humidity ||
      isNaN(formData.humidity) ||
      formData.humidity <= 0
    ) {
      validationErrors.humidity =
        "Humidity is required and must be a positive number.";
    }

    if (
      !formData.rainfall ||
      isNaN(formData.rainfall) ||
      formData.rainfall <= 0
    ) {
      validationErrors.rainfall =
        "Rainfall is required and must be a positive number.";
    }

    if (
      !formData.temperature ||
      isNaN(formData.temperature) ||
      formData.temperature <= 0
    ) {
      validationErrors.temperature =
        "Temperature is required and must be a positive number.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://flask-app-v8v8.onrender.com/predictCrop",
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Form Data:", formData);
      console.log("API Response:", response.data);
      setPredictionResult(response.data.result);
      console.log(response.data.result);
      setModalVisible(true);
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <TextInput
            style={styles.input}
            placeholder="Nitrogen"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("nitrogen", text)}
            value={formData.nitrogen}
          />
          {errors.nitrogen && (
            <Text style={styles.errorText}>{errors.nitrogen}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Phosphorus"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("phosphorus", text)}
            value={formData.phosphorus}
          />
          {errors.phosphorus && (
            <Text style={styles.errorText}>{errors.phosphorus}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Potassium"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("potassium", text)}
            value={formData.potassium}
          />
          {errors.potassium && (
            <Text style={styles.errorText}>{errors.potassium}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="pH"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("ph", text)}
            value={formData.ph}
          />
          {errors.ph && <Text style={styles.errorText}>{errors.ph}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Humidity (%)"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("humidity", text)}
            value={formData.humidity}
          />
          {errors.humidity && (
            <Text style={styles.errorText}>{errors.humidity}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Rainfall"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("rainfall", text)}
            value={formData.rainfall}
          />
          {errors.rainfall && (
            <Text style={styles.errorText}>{errors.rainfall}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Temperature (°C)"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("temperature", text)}
            value={formData.temperature}
          />
          {errors.temperature && (
            <Text style={styles.errorText}>{errors.temperature}</Text>
          )}

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Pressable style={styles.button} onPress={handleSubmit}>
              {isLoading ? (
                <ActivityIndicator size="small" color="green" />
              ) : (
                <Text style={styles.buttonText}>Predict</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <PredictModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        predictionResult={predictionResult}
        formData={formData}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: Dimensions.get("window").width,
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  button: {
    width: "40%",
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
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
});

export default Recommend;
