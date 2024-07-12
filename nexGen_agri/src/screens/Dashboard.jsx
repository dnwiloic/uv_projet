import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../../SQLite";
import DetailModal from "../components/DetailModal";
import imageMap from "../components/ImageMap";
import { useAuth } from "../context/AuthContext";

const Dashboard = ({ route }) => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const navigation = useNavigation();

  const fetchRecommendations = async () => {
    if (user) {
      const userRecommendations = await database.getRecommendationsByUserId(
        user.uid
      );
      setRecommendations(userRecommendations);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchRecommendations();
        navigation.setParams({ refresh: false });
      }

      const onBackPress = () => {
        createTwoButtonAlertQuit();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [route.params?.refresh])
  );

  useEffect(() => {
    fetchRecommendations();
  }, [user?.uid]);

  const createTwoButtonAlertQuit = () =>
    Alert.alert(
      "Confirm Quit",
      "Are you sure you want to Quit ?",
      [
        {
          text: "No",
          style: "Yes",
        },
        {
          text: "Yes",
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {
        alertContainerStyle: styles.alertContainer,
      }
    );

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleExplore = () => {
    navigation.navigate("BottomTabNavigator", {
      screen: "Recommend",
      params: { refresh: true },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={40} color="#4CAF50" />
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.emailText}>{user ? user.email : "Guest"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recommendations</Text>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {recommendations.length > 0 ? (
          <View style={{ padding: 5 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendationsContainer}
            >
              {recommendations.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => handleOpenModal(item)}
                >
                  <Image
                    source={imageMap[item.string_recommendation?.toLowerCase()]}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>
                      {item.string_recommendation.toUpperCase()}
                    </Text>
                    <Text style={styles.tapForDetailsText}>
                      Tap for details
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.noRecommendationsContainer}>
            <Text style={styles.noRecommendationsText}>
              You have no recommendations yet.
            </Text>
            <Text style={styles.noRecommendationsSubText}>
              Start exploring and adding your favorite cultural recommendations!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={handleExplore}
            >
              <Text style={styles.exploreButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        )}
        <DetailModal
          visible={modalVisible}
          item={selectedItem}
          onClose={handleCloseModal}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FFF0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    margin: 6,
    borderColor: "lightgray",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "white",
    backgroundColor: "#4CAF50",
  },
  welcomeContainer: {
    marginLeft: 5,
  },
  welcomeText: {
    color: "#4CAF50",
    fontSize: 18,
  },
  emailText: {
    color: "#4CAF50",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    paddingLeft: 20,
    color: "#4CAF50",
    marginBottom: 10,
    marginTop: 20,
  },
  recommendationsContainer: {
    //paddingLeft: 10,
    //padding: 20,
    //paddingRight: 10,
    //marginLeft: 10,
    //marginRight: 10,
    //paddingRight: 10,
    //width: Dimensions.get("window").width * 0.9,
  },
  card: {
    width: 150,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "white",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardTextContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    textAlign: "center",
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    color: "white",
    fontSize: 14,
  },
  tapForDetailsText: {
    color: "white",
    fontSize: 12,
  },
  alertContainer: {
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  noRecommendationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noRecommendationsText: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 10,
  },
  noRecommendationsSubText: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Dashboard;
