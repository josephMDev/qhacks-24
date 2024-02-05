import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { AsyncStorage } from "react-native";

export default AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    // call api to signup username, email, password
    let temp = 1;
    try {
      await AsyncStorage.setItem("uid", temp);
      navigation.navigate("Main");
    } catch (error) {
      // Error saving data
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={{ marginTop: -100, display: "flex", alignItems: "center" }}>
        <Text
          style={{
            fontWeight: "900",
            fontSize: 24,
            color: "#3b8b7e",
            marginBottom: 30,
          }}>
          murmr
        </Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          textContentType="password"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={navigation.navigate("Home")}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={signup}>
          <Text style={{ color: "#3b8b7e", fontWeight: "700", fontSize: 16 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  input: {
    width: "100%",
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 5,
    width: 380,
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
    borderColor: "rgba(0,0,0,0.15)",
    borderWidth: 2,
  },
  loginButton: {
    width: "100%",
    height: 30,
    borderRadius: 5,
    width: 380,
    height: 50,
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#3b8b7e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
