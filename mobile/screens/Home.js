import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import LinearGradient from "expo-linear-gradient";

export default HomeScreen = ({ navigation }) => {
  // hard coded for now
  (sampleVideo = {
    id: 0,
    url: "https://media.istockphoto.com/id/1465604391/video/young-woman-talks-with-therapist-during-theray-session.mp4?s=mp4-640x640-is&k=20&c=p1WTvSpuEhiRGj6yjRD8bC7ds99aYfZ3bY_Vbrc_Q7I=",
    thumbnail:
      "https://st4.depositphotos.com/13194036/31587/i/450/depositphotos_315873928-stock-photo-selective-focus-happy-businessman-glasses.jpg",
    description:
      "this should be some ai generated description kinda just describing the video, not too long i guess about 30 words i think",
    length: 108, //in s
    isolatedCaption: [
      {
        start: 0, // in ms
        end: 5000,
        text: "isolated: first 5 seconds this is what was said",
      },
      {
        start: 5000, // in ms
        end: 15000,
        text: "isolated: next 10 seconds this is pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long",
      },
      {
        start: 15000, // in ms
        end: 28000,
        text: "isolated: until the end this again  is pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long",
      },
    ],
    lipreadCaption: [
      {
        start: 0, // in ms
        end: 5000,
        text: "lipread: first 5 seconds this is what was said",
      },
      {
        start: 5000, // in ms
        end: 15000,
        text: "lipread: next 10 seconds this is pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long",
      },
      {
        start: 15000, // in ms
        end: 28000,
        text: "lipread: until the end this again  is pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long pretty long",
      },
    ],
  }),
    (videos = [
      sampleVideo,
      {
        ...sampleVideo,
        id: 1,
      },
      {
        ...sampleVideo,
        id: 2,
      },
      {
        ...sampleVideo,
        id: 3,
      },
      {
        ...sampleVideo,
        id: 4,
      },
      {
        ...sampleVideo,
        id: 5,
      },
    ]);
  // starred is just a list of video ids
  starred = [1, 3];

  const [header, setHeader] = useState("Starred");
  const handleScroll = (e) => {
    console.log(e.nativeEvent.contentOffset.y);
    if (e.nativeEvent.contentOffset.y > 250) {
      setHeader("Videos");
    } else {
      setHeader("Starred");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{header}</Text>
        <TouchableOpacity>
          <FontAwesome6Icon name="bars-staggered" size={22} color={"black"} />
        </TouchableOpacity>
      </View>
      <ScrollView scrollEventThrottle={4} onScroll={handleScroll}>
        <View style={{ height: 260 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.starredVideosContainer}>
            {videos
              .filter((video) => video.id in starred)
              .map((video) => {
                return (
                  <View key={video.id} style={styles.starredVideo}>
                    <Image
                      source={{ uri: video.thumbnail }}
                      style={styles.starredThumbnail}
                    />
                    {/* <LinearGradient
                      colors={["#00000000", "#000000"]}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}></LinearGradient> */}
                  </View>
                );
              })}
          </ScrollView>
        </View>
        <Text style={styles.videosText}>
          {header === "Videos" ? " " : "Videos"}
        </Text>
        <View style={styles.videosContainer}>
          {videos.map((video) => {
            return (
              <TouchableOpacity
                key={video.id}
                onPress={() => navigation.navigate("Video", { ...video })}>
                <View style={styles.video}>
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.videoThumbnail}
                  />
                  <View style={styles.videoDescriptionContainer}>
                    <Text style={styles.videoDescription} numberOfLines={3}>
                      {video.description}
                    </Text>
                    <Text style={styles.videoLength}>
                      {video.length} seconds
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.uploadButton}>
        <FontAwesome6Icon name="camera" size={36} color={"white"} />
      </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 34,
  },
  starredVideosContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  starredVideo: {
    height: 220,
    width: 340,
    borderRadius: 20,
    backgroundColor: "red",
    display: "flex",
  },
  starredThumbnail: {
    resizeMode: "cover",
    flex: 1,
    borderRadius: 20,
  },
  videosContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
    gap: 10,
    paddingBottom: 60,
  },
  video: {
    width: "100%",
    height: 100,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  videosText: {
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  videoThumbnail: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "red",
  },
  videoDescription: {
    fontWeight: 600,
    width: 260,
  },
  videoDescriptionContainer: {
    gap: 6,
  },
  videoLength: {
    color: "rgba(0,0,0,0.25)",
    width: 280,
  },
  uploadButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3b8b7e",
    height: 80,
    width: 80,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
