import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api_url } from "../context/Constant";

const WeatherScreen = () => {
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await axios.get(api_url + "/weather", {
          params: {
            lat: "33.44",
            lon: "-94.04",
          },
        });

        const forecastResponse = await axios.get(api_url + "/forecast", {
          params: {
            lat: "33.44",
            lon: "-94.04",
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
    };

    fetchWeatherData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.currentWeatherSection}>
        <Text style={styles.temperatureText}>
          Current Weather: {weatherDetails.temperature}
        </Text>
        <Text style={styles.weatherCondition}>{weatherDetails.condition}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});

export default WeatherScreen;
