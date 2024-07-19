import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { api_url } from "../context/Constant";

const WeatherScreen = () => {
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    latitude: 5.4527273,
    longitude: 10.0618887,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const CAMEROON_REGION = {
    latitude: 7.3697,
    longitude: 12.3547,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const handleLocationChange = async (region) => {
    if (region) {
      setIsLoading(true);
      try {
        const weatherResponse = await axios.get(`${api_url}/weather`, {
          params: {
            lat: region.latitude,
            lon: region.longitude,
          },
        });

        const forecastResponse = await axios.get(`${api_url}/forecast`, {
          params: {
            lat: region.latitude,
            lon: region.longitude,
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        ...location,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      handleLocationChange(currentLocation.coords);
    })();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        onRegionChangeComplete={(region) => {
          setLocation(region);
          handleLocationChange(region);
        }}
        initialRegion={CAMEROON_REGION}
        minZoomLevel={5}
        maxZoomLevel={10}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          draggable
          onDragEnd={(e) => {
            const coords = e.nativeEvent.coordinate;
            setLocation({
              ...location,
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
            handleLocationChange(coords);
          }}
        />
      </MapView>

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
    // backgroundColor: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "white",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
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
