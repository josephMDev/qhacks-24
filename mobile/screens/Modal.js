import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default ModalScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Options</Text>
      </View>
      <TextInput placeholder="Search for a video..." style={styles.searchbar} />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.goBack()}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
          Search
        </Text>
        <MaterialIcon name="search" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Auth")}>
        <Text style={{ color: "#3b8b7e", fontWeight: "700", fontSize: 16 }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "white",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerText: {
    fontWeight: "800",
    fontSize: 34,
  },
  searchbar: {
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
  filterButton: {},
  searchButton: {
    marginTop: 20,
    width: "100%",
    height: 30,
    borderRadius: 5,
    width: 380,
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#3b8b7e",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  logoutButton: {
    width: "100%",
    height: 30,
    borderRadius: 5,
    width: 380,
    height: 50,
    position: "absolute",
    bottom: 50,
    marginHorizontal: 20,
    borderColor: "#3b8b7e",
    borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
