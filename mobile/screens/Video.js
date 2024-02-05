import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  FlatList,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { RNTabBar, RNTabBarOption } from "react-native-ios-tab-bar";

export default VideoScreen = ({ navigation, route }) => {
  console.log(route.params);
  const { description, caption, url } = route.params;
  const words = JSON.parse(caption);
  const video = useRef(null);
  const flatlistRef = useRef();
  const [status, setStatus] = useState({});
  const [captionIndex, setCaptionIndex] = useState(0);
  console.log(words);

  const getIndex = () => {
    for (let i = 0; i < words.length; i++) {
      section = words[i];
      if (
        section[1] * 1000 <= status.positionMillis &&
        section[1] * 1000 + 5000 > status.positionMillis
      ) {
        return i;
      }
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Transcript</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: `http://10.216.63.251:5001/get_media?url=${url}`,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => {
          let newIndex = getIndex();
          if (captionIndex !== newIndex) {
            setCaptionIndex(newIndex);
            flatlistRef.current.scrollToIndex({
              animated: true,
              index: newIndex,
              viewOffset: 20,
            });
          }
          setStatus(() => status);
        }}
      />
      <View>
        {/* <RNTabBar
          width={390}
          height={40}
          backgroundColor="rgba(0,0,0,0.08)"
          activeColor="#3b8b7e"
          onActiveIndexChange={toggleCaptions}>
          <RNTabBarOption>
            <View>
              <Text
                style={[
                  { fontWeight: 600 },
                  { color: mode === 0 ? "white" : "#3b8b7e" },
                ]}>
                Noise Isolated Captions
              </Text>
            </View>
          </RNTabBarOption>

          <RNTabBarOption>
            <Text
              style={[
                { fontWeight: 600 },
                { color: mode === 1 ? "white" : "#3b8b7e" },
              ]}>
              Lip-read Captions
            </Text>
          </RNTabBarOption>
        </RNTabBar> */}
        <View
          style={{
            height: 544,
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
          <FlatList
            ref={flatlistRef}
            data={words}
            renderItem={({ item, index }) => {
              let active =
                item[1] * 1000 <= status.positionMillis &&
                item[1] * 1000 + 5000 > status.positionMillis;
              return (
                <Text
                  key={`${item[1]}`}
                  style={[
                    styles.caption,
                    { color: active ? "black" : "rgba(0,0,0,0.4)" },
                  ]}>
                  {item[0]}
                </Text>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.captionContainer}></FlatList>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
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
  video: {
    alignSelf: "center",
    width: 390,
    height: 220,
    borderRadius: 20,
    marginBottom: 30,
  },
  description: {
    marginTop: 8,
    marginBottom: 20,
    marginHorizontal: 20,
    color: "rgba(0,0,0,0.5)",
  },
  captionContainer: {
    gap: 16,
    flexGrow: 1,
    paddingBottom: 40,
    paddingTop: 20,
  },
  caption: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
