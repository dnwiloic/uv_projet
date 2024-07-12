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
import DropDownPicker from "react-native-dropdown-picker";
import PredictModal from "../components/PredictModal";
import { api_url } from "../context/Constant";

const cities = [
  { label: "City 1", value: { lat: "33.44", lon: "-94.04" }, key: "1" },
  { label: "City 2", value: { lat: "40.71", lon: "-74.01" }, key: "2" },
];

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
  const [savedFormData, setSavedFormData] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(cities);
  const [errors, setErrors] = useState({
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    ph: null,
    city: null,
  });

  const [selectedCity, setSelectedCity] = useState(null);

  const validateForm = () => {
    const validationErrors = {};

    const isInteger = (value) => Number.isInteger(Number(value));

    if (
      !formData.nitrogen ||
      !isInteger(formData.nitrogen) ||
      formData.nitrogen <= 0
    ) {
      validationErrors.nitrogen =
        "Nitrogen is required and must be a positive integer.";
    }

    if (
      !formData.phosphorus ||
      !isInteger(formData.phosphorus) ||
      formData.phosphorus <= 0
    ) {
      validationErrors.phosphorus =
        "Phosphorus is required and must be a positive integer.";
    }

    if (
      !formData.potassium ||
      !isInteger(formData.potassium) ||
      formData.potassium <= 0
    ) {
      validationErrors.potassium =
        "Potassium is required and must be a positive integer.";
    }

    const ph = parseFloat(formData.ph);
    const humidity = parseFloat(formData.humidity);
    const rainfall = parseFloat(formData.rainfall);
    const temperature = parseFloat(formData.temperature);

    if (!ph || ph <= 0 || ph > 14) {
      validationErrors.ph =
        "pH is required and must be a positive number between 0 and 14.";
    }

    if (!selectedCity) {
      validationErrors.city = "City selection is required.";
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

  const resetForm = () => {
    setFormData({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      ph: "",
      humidity: "",
      rainfall: "",
      temperature: "",
    });
    setErrors({
      nitrogen: null,
      phosphorus: null,
      potassium: null,
      ph: null,
      city: null,
    });
    setSelectedCity(null);
    setValue(null);
  };

  const handleCityChange = async (city) => {
    setSelectedCity(city);
    if (city) {
      setIsLoading(true);
      try {
        const weatherResponse = await axios.get(api_url + "/weather", {
          params: {
            lat: city.lat,
            lon: city.lon,
          },
        });

        const weatherData = weatherResponse.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          temperature: `${weatherData.current.temp_c}`,
          humidity: `${weatherData.current.humidity}`,
          rainfall: `${weatherData.current.precip_mm}`,
        }));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        api_url + "/predictCrop",
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Form Data:", formData);
      console.log("API Response:", response.data);
      setPredictionResult(response.data.result);
      console.log(response.data.result);
      setSavedFormData({ ...formData });
      setModalVisible(true);
      resetForm();
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log("Form Data:", savedFormData);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <View style={styles.inputWrapper}>
            <Text>Select City</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              onChangeValue={(value) => handleCityChange(value)}
              placeholder="Select a city"
              style={styles.inputD}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              maxHeight={300}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>
          {Object.keys(formData).map((key) => (
            <View key={key} style={styles.inputWrapper}>
              <Text style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange(key, text)}
                value={formData[key]}
                editable={
                  key !== "humidity" &&
                  key !== "rainfall" &&
                  key !== "temperature"
                }
              />
              {errors[key] && (
                <Text style={styles.errorText}>{errors[key]}</Text>
              )}
            </View>
          ))}
          <View style={styles.buttonContainer}>
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
        formData={savedFormData}
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
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    zIndex: 1,
    color: "rgba(0, 0, 0, 0.6)",
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "rgba(0, 0, 0, 0.2)",
    paddingLeft: 15,
    fontSize: 10,
  },
  inputD: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "rgba(0, 0, 0, 0.2)",
    paddingLeft: 15,
    fontSize: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
    marginTop: 5,
    fontSize: 12,
  },
  dropdown: {
    marginBottom: 20,
  },
  placeholderStyle: {
    color: "gray",
  },
  selectedTextStyle: {
    color: "black",
  },
  inputSearchStyle: {
    color: "black",
  },
  iconStyle: {
    color: "black",
  },
});

export default Recommend;

{
  /*import axios from "axios";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import PredictModal from "../components/PredictModal";
import { api_url } from "../context/Constant";

const cities = [
  { label: "City 1", value: { lat: "33.44", lon: "-94.04" } },
  { label: "City 2", value: { lat: "40.71", lon: "-74.01" } },
  // Ajoutez d'autres villes ici
];

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
  const [savedFormData, setSavedFormData] = useState(null);
  const [errors, setErrors] = useState({
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    ph: null,
    humidity: null,
    rainfall: null,
    temperature: null,
  });

  const [selectedCity, setSelectedCity] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(cities);

  const validateForm = () => {
    const validationErrors = {};

    const isInteger = (value) => Number.isInteger(Number(value));

    if (!formData.nitrogen || !isInteger(formData.nitrogen) || formData.nitrogen <= 0) {
      validationErrors.nitrogen = "Nitrogen is required and must be a positive integer.";
    }

    if (!formData.phosphorus || !isInteger(formData.phosphorus) || formData.phosphorus <= 0) {
      validationErrors.phosphorus = "Phosphorus is required and must be a positive integer.";
    }

    if (!formData.potassium || !isInteger(formData.potassium) || formData.potassium <= 0) {
      validationErrors.potassium = "Potassium is required and must be a positive integer.";
    }

    // Convert values to float for the following fields
    const ph = parseFloat(formData.ph);
    const humidity = parseFloat(formData.humidity);
    const rainfall = parseFloat(formData.rainfall);
    const temperature = parseFloat(formData.temperature);

    // Validate pH
    if (!ph || ph <= 0 || ph > 14) {
      validationErrors.ph = "pH is required and must be a positive number between 0 and 14.";
    }

    // Validate Humidity
    if (!humidity || humidity <= 0) {
      validationErrors.humidity = "Humidity is required and must be a positive number.";
    }

    // Validate Rainfall
    if (!rainfall || rainfall <= 0) {
      validationErrors.rainfall = "Rainfall is required and must be a positive number.";
    }

    // Validate Temperature
    if (!temperature || temperature <= 0) {
      validationErrors.temperature = "Temperature is required and must be a positive number.";
    }
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      ph: "",
      humidity: "",
      rainfall: "",
      temperature: "",
    });
    setErrors({
      nitrogen: null,
      phosphorus: null,
      potassium: null,
      ph: null,
      humidity: null,
      rainfall: null,
      temperature: null,
    });
  };

  const handleCityChange = async (city) => {
    setSelectedCity(city);
    if (city) {
      setIsLoading(true);
      try {
        const weatherResponse = await axios.get(api_url + "/weather", {
          params: {
            lat: city.lat,
            lon: city.lon,
          },
        });

        const weatherData = weatherResponse.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          temperature: `${weatherData.current.temp_c}`,
          humidity: `${weatherData.current.humidity}`,
          rainfall: `${weatherData.current.precip_mm}`,
        }));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        api_url + "/predictCrop",
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Form Data:", formData);
      console.log("API Response:", response.data);
      setPredictionResult(response.data.result);
      console.log(response.data.result);
      setSavedFormData({ ...formData });
      setModalVisible(true);
      resetForm();
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log("Form Data:", savedFormData);
    setModalVisible(false);
  };

  return (
    <ImageBackground source={require("../../assets/background.png")} style={styles.backgroundImage}>
      <View style={{ marginTop: 20 }}>
        <Text>Select City</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={(value) => handleCityChange(value)}
          placeholder="Select a city"
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          maxHeight={300}
        />
        {Object.keys(formData).map((key) => (
          <View key={key} style={styles.inputWrapper}>
            <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <TextInput
              style={styles.input}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange(key, text)}
              value={formData[key]}
              editable={key !== "humidity" && key !== "rainfall" && key !== "temperature"}
            />
            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
          </View>
        ))}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Predict</Text>
          </Pressable>
        )}
        <PredictModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          predictionResult={predictionResult}
          formData={savedFormData}
        />
      </View>
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
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    zIndex: 1,
    color: "rgba(0, 0, 0, 0.6)",
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "rgba(0, 0, 0, 0.2)",
    paddingLeft: 15,
    fontSize: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
    marginTop: 5,
    fontSize: 12,
  },
  dropdown: {
    marginBottom: 20,
  },
  placeholderStyle: {
    color: "gray",
  },
  selectedTextStyle: {
    color: "black",
  },
  inputSearchStyle: {
    color: "black",
  },
  iconStyle: {
    color: "black",
  },
});

export default Recommend;*/
}

{
  /*import axios from "axios";
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
import { api_url } from "../context/Constant";

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
  const [savedFormData, setSavedFormData] = useState(null);
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

    const isInteger = (value) => Number.isInteger(Number(value));

    if (
      !formData.nitrogen ||
      !isInteger(formData.nitrogen) ||
      formData.nitrogen <= 0
    ) {
      validationErrors.nitrogen =
        "Nitrogen is required and must be a positive integer.";
    }

    if (
      !formData.phosphorus ||
      !isInteger(formData.phosphorus) ||
      formData.phosphorus <= 0
    ) {
      validationErrors.phosphorus =
        "Phosphorus is required and must be a positive integer.";
    }

    if (
      !formData.potassium ||
      !isInteger(formData.potassium) ||
      formData.potassium <= 0
    ) {
      validationErrors.potassium =
        "Potassium is required and must be a positive integer.";
    }

    // Convert values to float for the following fields
    const ph = parseFloat(formData.ph);
    const humidity = parseFloat(formData.humidity);
    const rainfall = parseFloat(formData.rainfall);
    const temperature = parseFloat(formData.temperature);

    // Validate pH
    if (!ph || ph <= 0 || ph > 14) {
      validationErrors.ph =
        "pH is required and must be a positive number between 0 and 14.";
    }

    // Validate Humidity
    if (!humidity || humidity <= 0) {
      validationErrors.humidity =
        "Humidity is required and must be a positive number.";
    }

    // Validate Rainfall
    if (!rainfall || rainfall <= 0) {
      validationErrors.rainfall =
        "Rainfall is required and must be a positive number.";
    }

    // Validate Temperature
    if (!temperature || temperature <= 0) {
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

  const resetForm = () => {
    setFormData({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      ph: "",
      humidity: "",
      rainfall: "",
      temperature: "",
    });
    setErrors({
      nitrogen: null,
      phosphorus: null,
      potassium: null,
      ph: null,
      humidity: null,
      rainfall: null,
      temperature: null,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        api_url + "/predictCrop",
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Form Data:", formData);
      console.log("API Response:", response.data);
      setPredictionResult(response.data.result);
      console.log(response.data.result);
      setSavedFormData({ ...formData });
      setModalVisible(true);
      resetForm();
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log("Form Data:", savedFormData);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 20 }}>
          {Object.keys(formData).map((key) => (
            <View key={key} style={styles.inputWrapper}>
              <Text style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange(key, text)}
                value={formData[key]}
              />
              {errors[key] && (
                <Text style={styles.errorText}>{errors[key]}</Text>
              )}
            </View>
          ))}
          <View style={styles.buttonContainer}>
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
        formData={savedFormData}
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
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    zIndex: 1,
    color: "rgba(0, 0, 0, 0.6)",
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "rgba(0, 0, 0, 0.2)",
    paddingLeft: 15,
    fontSize: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
    marginTop: 5,
    fontSize: 12,
  },
});

export default Recommend;*/
}
