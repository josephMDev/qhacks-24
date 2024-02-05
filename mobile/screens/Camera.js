import { Camera } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as FS from "expo-file-system";

export default function CameraScreen({ navigation }) {
  const camera = useRef(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [recording, setRecording] = useState(null);
  const [recordingState, setRecordingState] = useState(0); // 0: not recording yet, 1: recording, 2: done recording
  const [micPermission, requestMicPermission] =
    Camera.useMicrophonePermissions();

  const isFocused = useIsFocused();

  if (!permission || !micPermission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted || !micPermission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Please enable camera and microphone permissions
        </Text>
        <Button
          onPress={() => {
            requestPermission();
            requestMicPermission();
          }}
          title="Grant permission"
        />
      </View>
    );
  }

  const toggleRecording = async () => {
    if (recordingState === 0) {
      try {
        setRecordingState(1);
        let video = await camera.current.recordAsync();
        setRecording(video);
        setRecordingState(2);
      } catch (err) {
        console.log(err);
      }
    } else if (recordingState === 1) {
      try {
        await camera.current.stopRecording();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const upload = async () => {
    let response = await FS.uploadAsync(
      "http://10.216.63.251:5001/upload_video?user_id=af4f9124-d3c1-40dc-b6be-2bf142215cdc",
      recording.uri,
      {
        headers: {
          "content-type": "video/mp4",
        },
        httpMethod: "POST",
        uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
      }
    );
    console.log(response.headers);
    console.log(response.body);
    Alert.alert("Processing video...", "This may take a few minutes", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      {recordingState === 2 && recording && (
        <View
          style={{
            position: "absolute",
            top: -170,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <Video
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            source={recording}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setRecordingState(0)}>
            <MaterialIcon name="arrow-back-ios" size={28} color="#3b8b7e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={upload}>
            <MaterialIcon name="upload" size={28} color="white" />
          </TouchableOpacity>
        </View>
      )}
      {isFocused && recordingState !== 2 && (
        <Camera style={styles.camera} ref={camera}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={toggleRecording}>
            {recordingState === 1 && (
              <Icon name="square" size={40} color={"red"} />
            )}
            {recordingState === 0 && (
              <View
                style={{
                  backgroundColor: "red",
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                }}
              />
            )}
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  backButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    paddingLeft: 8,
    bottom: 50,
    left: 30,
    shadowColor: "rgba(0,0,0, .2)",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  uploadButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#3b8b7e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    right: 30,
    shadowColor: "rgba(0,0,0, .6)",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  recordButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
});
