import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { getUser, toggleStar } from "../api/api";

export default HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState({});
  const [starred, setStarred] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let user = await getUser();
      console.log(user);
      setVideos(user.videos);
      setStarred(user.starred);
    }
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let user = await getUser();
    console.log(user.videos);
    setVideos(user.videos);
    setStarred(user.starred);
    setRefreshing(false);
  }, []);

  const changeStar = async (id) => {
    await toggleStar(id);
    if (starred.includes(id)) {
      setStarred(starred.filter((star) => star !== id));
    } else {
      setStarred([...starred, id]);
    }
  };

  const deleteVideo = (id) => {
    // calls API to delete video
  };

  const getBookmarkIcon = (id, size = 24, outlineColor = "black") => {
    if (starred.includes(id)) {
      return <FontAwesomeIcon name="bookmark" size={size} color={"gold"} />;
    } else {
      return (
        <FontAwesomeIcon name="bookmark-o" size={size} color={outlineColor} />
      );
    }
  };

  const getStarVideos = () => {
    let starVideos = [];
    Object.entries(videos).forEach((categoryVideos) => {
      starVideos.push(
        ...categoryVideos[1].filter((video) => starred.includes(video.video_id))
      );
    });
    return starVideos.map((video) => {
      return (
        <TouchableOpacity
          key={video.video_id}
          onPress={() => navigation.navigate("Video", { ...video })}>
          <ImageBackground
            source={{
              uri: `http://10.216.63.251:5001/get_media?url=${video.thumbnail_url}`,
            }}
            style={styles.starredVideo}
            imageStyle={styles.starredThumbnail}>
            <TouchableOpacity
              onPress={() => {
                changeStar(video.video_id);
              }}
              style={{ padding: 16 }}>
              {getBookmarkIcon(video.video_id, 34, "white")}
            </TouchableOpacity>
            <LinearGradient
              style={{
                position: "absolute",
                bottom: 0,
                width: 340,
                height: 100,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
              colors={[
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0.7)",
                "rgba(0,0,0,0.7)",
                "rgba(0,0,0,0.8)",
                "rgba(0,0,0,0.9)",
              ]}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 0,
                color: "rgba(255,255,255,0.9)",
                paddingHorizontal: 20,
                paddingBottom: 16,
                fontWeight: "bold",
              }}
              numberOfLines={3}>
              {video.description}
            </Text>
            <View style={{ width: "100%" }}></View>
          </ImageBackground>
        </TouchableOpacity>
      );
    });
  };

  const getVideos = (videos) => {
    return videos.map((video) => {
      return (
        <TouchableOpacity
          key={video.video_id}
          onPress={() => navigation.navigate("Video", { ...video })}>
          <View style={styles.video}>
            <Image
              source={{
                uri: `http://10.216.63.251:5001/get_media?url=${video.thumbnail_url}`,
              }}
              style={styles.videoThumbnail}
            />
            <View style={styles.videoDescriptionContainer}>
              <Text style={styles.videoDescription} numberOfLines={3}>
                {video.description}
              </Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    changeStar(video.video_id);
                  }}
                  style={{
                    padding: 0,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  <Text
                    style={{ color: "rgba(0,0,0,0.3)", fontWeight: "bold" }}>
                    Save
                  </Text>
                  {getBookmarkIcon(video.video_id, 24, "rgba(0,0,0,0.2)")}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteVideo(video.video_id);
                  }}
                  style={{
                    padding: 0,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  <Text
                    style={{ color: "rgba(0,0,0,0.3)", fontWeight: "bold" }}>
                    Delete
                  </Text>
                  <FontAwesomeIcon
                    name="trash-o"
                    size={24}
                    color={"rgba(0,0,0,0.2)"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const getCategories = () => {
    let categories = [];
    Object.entries(videos).forEach((categoryVideos) => {
      categories.push(
        <>
          <Text style={styles.videosText}>
            {categoryVideos[0]}
            {/* {header === "Videos" ? " " : "Videos"} */}
          </Text>
          {getVideos(categoryVideos[1])}
        </>
      );
    });
    return categories;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Videos</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SettingsModal");
          }}>
          <FontAwesome6Icon name="bars-staggered" size={22} color={"black"} />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {starred.length > 0 && (
          <View style={{ height: 260 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.starredVideosContainer}>
              {getStarVideos()}
            </ScrollView>
          </View>
        )}
        <View style={styles.videosContainer}>{getCategories()}</View>
      </ScrollView>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => {
          navigation.navigate("Camera");
        }}>
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
    fontWeight: "800",
    fontSize: 34,
  },
  starredVideosContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 6,
  },
  starredVideo: {
    height: 220,
    width: 340,
    borderRadius: 20,
    display: "flex",
  },
  starredThumbnail: {
    resizeMode: "cover",
    flex: 1,
    borderRadius: 20,
  },
  videosContainer: {
    marginTop: -20,
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
    marginTop: 20,
  },
  videoThumbnail: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "#3b8b7e",
  },
  videoDescription: {
    fontWeight: 600,
    width: 260,
  },
  videoDescriptionContainer: {
    gap: 6,
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
