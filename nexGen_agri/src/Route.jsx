import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import BottomTabNavigator from "./components/BottomTabNavigator";
import { useAuth } from "./context/AuthContext";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import OnboardingScreen from "./screens/OnboardingScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();

const Route = () => {
  const { user } = useAuth();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    if (user) {
      setInitialRoute("BottomTabNavigator");
    } else {
      setInitialRoute("SplashScreen");
    }
  }, [user]);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerBackVisible: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerBackVisible: false }}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;
