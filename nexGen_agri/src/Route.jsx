import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./components/BottomTabNavigator";
import OnboardingScreen from "./screens/OnboardingScreen";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";

const Stack = createNativeStackNavigator();

const Route = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
        }}
      >
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
