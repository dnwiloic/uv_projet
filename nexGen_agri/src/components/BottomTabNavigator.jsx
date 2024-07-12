import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../../SQLite";
import { useAuth } from "../context/AuthContext";
import Chatbot from "../screens/ChatBot";
import Dashboard from "../screens/Dashboard";
import Recommend from "../screens/Recommend";
import Weather from "../screens/Weather";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to Logout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            logout();
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleClearHistory = async () => {
    await database.deleteChatHistoryByUserId(user?.uid);
    setIsModalVisible(false);
    navigation.navigate("BottomTabNavigator", {
      screen: "ChatBot",
      params: { refresh: true, userId: user?.uid },
    });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconComponent;

          if (route.name === "Dashboard") {
            iconComponent = (
              <MaterialCommunityIcons
                name={focused ? "view-dashboard" : "view-dashboard-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Recommend") {
            iconComponent = (
              <MaterialIcons
                name={focused ? "recommend" : "recommend"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Weather") {
            iconComponent = (
              <Ionicons
                name={focused ? "cloud" : "cloud-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "ChatBot") {
            iconComponent = (
              <MaterialCommunityIcons
                name={focused ? "message" : "message-outline"}
                size={size}
                color={color}
              />
            );
          }

          return (
            <React.Fragment>
              {iconComponent}
              {focused && (
                <Text style={{ color: "green", fontSize: 10 }}>
                  {route.name}
                </Text>
              )}
            </React.Fragment>
          );
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "black",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
        },
        headerStyle: {
          backgroundColor: "green",
        },
        headerTitleStyle: {
          color: "white",
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerTitle: "Dashboard",
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout}>
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Recommend"
        component={Recommend}
        options={{ headerTitle: "Crop Prediction" }}
      />
      <Tab.Screen
        name="Weather"
        component={Weather}
        options={{ headerTitle: "Weather Forecast" }}
      />
      <Tab.Screen
        name="ChatBot"
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/profile.png")}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 10,
                  borderRadius: 50,
                }}
              />
              <Text style={{ fontSize: 18, color: "#fff" }}>
                NexGen_Agri ChatBot
              </Text>
            </View>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setIsModalVisible(false)}
                >
                  <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleClearHistory}>
                      <Text style={styles.modalText}>Clear History</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          ),
        }}
      >
        {({ route }) => (
          <Chatbot userId={user?.uid} refresh={route.params?.refresh} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: "black",
  },
});

export default BottomTabNavigator;
