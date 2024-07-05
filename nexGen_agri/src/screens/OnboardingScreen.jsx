import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const pages = [
  {
    title: "Discover the Best Crops",
    description:
      "Get personalized crop recommendations based on soil and environmental conditions.",
    image: require("../../assets/Onboarding/crops2.jpg"),
  },
  {
    title: "Stay Updated with Weather",
    description:
      "Check real-time weather conditions to ensure optimal farming decisions.",
    image: require("../../assets/Onboarding/weather2.jpg"),
  },
  {
    title: "Chat with AgriBot",
    description:
      "Interact with our advanced ChatBot to get instant advice on crop management and disease prevention.",
    image: require("../../assets/Onboarding/chatbot4.jpg"),
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      scrollViewRef.current.scrollTo({
        x: width * (currentPage + 1),
        animated: true,
      });
    } else {
      navigation.navigate("Register");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      scrollViewRef.current.scrollTo({
        x: width * (currentPage - 1),
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    scrollViewRef.current.scrollTo({
      x: width * (pages.length - 1),
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {pages.map((page, index) => (
          <View style={styles.page} key={index}>
            <Image source={page.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.description}>{page.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        {currentPage < pages.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePrevious} style={styles.skipButton}>
            <Text style={styles.skipText}>Preview</Text>
          </TouchableOpacity>
        )}
        <View style={styles.indicatorContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentPage === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentPage === pages.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    position: "absolute",
    width,
    height,
    resizeMode: "cover",
  },
  textContainer: {
    position: "absolute",
    top: "30%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#fff",
  },
  nextButton: {
    padding: 10,
  },
  nextText: {
    fontSize: 16,
    color: "#fff",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
});

export default OnboardingScreen;
