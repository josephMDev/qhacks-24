import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoScreen from "./screens/Video";
import HomeScreen from "./screens/Home";
import CameraScreen from "./screens/Camera";
import ModalScreen from "./screens/Modal";
import AuthScreen from "./screens/Auth";

const Stack = createNativeStackNavigator();

export default function App() {
  const [uid, setUid] = useState("");

  useEffect(() => {
    getLoggedIn = async () => {
      try {
        const value = await AsyncStorage.getItem("uid");
        console.log(value);
        if (value === null) {
          this.props.navigation.navigate("Auth");
        } else {
          this.props.navigation.navigate("Main");
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    getLoggedIn();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Group name="Main">
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Video" component={VideoScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Group>

        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="SettingsModal" component={ModalScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
