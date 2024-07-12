import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { api_url } from "../context/Constant";

const cities = [
  { label: "City 1", value: { lat: "33.44", lon: "-94.04" }, key: "1" },
  { label: "City 2", value: { lat: "40.71", lon: "-74.01" }, key: "2" },
  { label: "City 3", value: { lat: "41.31", lon: "-72.92" }, key: "3" },
  { label: "City 4", value: { lat: "42.36", lon: "-71.06" }, key: "4" },
  { label: "City 5", value: { lat: "43.61", lon: "-116.23" }, key: "5" },
  { label: "City 6", value: { lat: "44.98", lon: "-93.27" }, key: "6" },
  { label: "City 7", value: { lat: "45.52", lon: "-122.67" }, key: "7" },
];

const WeatherScreen = () => {
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(cities);

  const handleCityChange = async (city) => {
    if (city) {
      setIsLoading(true);
      try {
        const weatherResponse = await axios.get(api_url + "/weather", {
          params: {
            lat: city.lat,
            lon: city.lon,
          },
        });

        const forecastResponse = await axios.get(api_url + "/forecast", {
          params: {
            lat: city.lat,
            lon: city.lon,
          },
        });

        const weatherData = weatherResponse.data;
        const forecastData = forecastResponse.data;

        setWeatherDetails({
          temperature: `${weatherData.current.temp_c}°C`,
          condition: weatherData.current.condition.text,
          windSpeed: `${weatherData.current.wind_kph} kph`,
          windDirection: weatherData.current.wind_dir,
          humidity: `${weatherData.current.humidity}%`,
          visibility: `${weatherData.current.vis_km} km`,
          precipitation: `${weatherData.current.precip_mm} mm`,
          feelsLike: `${weatherData.current.feelslike_c}°C`,
          uvIndex: `${weatherData.current.uv}`,
          airQuality: `${weatherData.current.air_quality.pm2_5} μg/m³`,
        });

        setForecastData(
          forecastData.map((day, index) => ({
            day: `Day ${index + 1}`,
            temp: `${day.day.avgtemp_c}°C`,
            description: day.day.condition.text,
          }))
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
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
          style={styles.input}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          maxHeight={300}
        />
      </View>
      <ScrollView style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
          weatherDetails && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View style={styles.currentWeatherSection}>
                <Text style={styles.temperatureText}>
                  Current Weather: {weatherDetails.temperature}
                </Text>
                <Text style={styles.weatherCondition}>
                  {weatherDetails.condition}
                </Text>
                <View
                  style={{
                    padding: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    width: "100%",
                    marginBottom: 6,
                  }}
                ></View>
                <View style={styles.weatherInfo}>
                  <Text
                    style={styles.infoText}
                  >{`Wind: ${weatherDetails.windSpeed} `}</Text>
                  <Text
                    style={styles.infoText}
                  >{`Direction: ${weatherDetails.windDirection}`}</Text>
                </View>
                <Text
                  style={styles.infoText}
                >{`Humidity: ${weatherDetails.humidity}`}</Text>
                <Text
                  style={styles.infoText}
                >{`Visibility: ${weatherDetails.visibility}`}</Text>
                <Text
                  style={styles.infoText}
                >{`Precipitation: ${weatherDetails.precipitation}`}</Text>
                <Text
                  style={styles.infoText}
                >{`Feels like: ${weatherDetails.feelsLike}`}</Text>
                <Text
                  style={styles.infoText}
                >{`UV Index: ${weatherDetails.uvIndex}`}</Text>
                <Text
                  style={styles.infoText}
                >{`Air Quality: ${weatherDetails.airQuality}`}</Text>
              </View>
              <View style={styles.forecastSection}>
                {forecastData.map((day, index) => (
                  <View key={index} style={styles.forecastItem}>
                    <Entypo name="light-up" size={24} color="black" />
                    <View style={styles.forecastTextContainer}>
                      <Text style={styles.forecastDayText}>{day.day}</Text>
                      <Text
                        style={styles.forecastText}
                      >{`${day.temp} - ${day.description}`}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )
        )}
      </ScrollView>
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  currentWeatherSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "lightgray",
    borderWidth: 2,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  temperatureText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  weatherCondition: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    marginLeft: 10,
    color: "black",
  },
  forecastSection: {
    padding: 10,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 20,
  },
  forecastTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  forecastDayText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  forecastText: {
    fontSize: 16,
    color: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    padding: 10,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    //marginBottom: Dimensions.get("window").height * 0.5,
    //marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    fontSize: 16,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    //backgroundColor: "white",
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    color: "#000",
  },
  inputSearchStyle: {
    color: "#000",
  },
  iconStyle: {
    color: "#000",
  },
});

export default WeatherScreen;
