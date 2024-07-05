import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../../SQLite";
import imageMap from "./ImageMap";

const DetailModal = ({ visible, item, onClose }) => {
  if (!item) return null;

  const navigation = useNavigation();

  const handleChatBot = () => {
    onClose();
    navigation.navigate("ChatBot");
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this recommendation?",
      [
        {
          text: "No",
          onPress: () => console.log("Suppression annulée"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await database.deleteRecommendation(item.id);
            onClose();
            navigation.navigate("BottomTabNavigator", {
              screen: "Dashboard",
              params: { refresh: true },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>
                {item.string_recommendation}
              </Text>
            </View>
            <Image
              source={imageMap[item.string_recommendation?.toLowerCase()]}
              style={styles.modalImage}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>pH: {item.pH}</Text>
              <Text style={styles.infoText}>Nitrogen: {item.N}</Text>
              <Text style={styles.infoText}>Phosphorus: {item.P}</Text>
              <Text style={styles.infoText}>Potassium: {item.K}</Text>
              <Text style={styles.infoText}>
                Temperature: {item.temperature}°C
              </Text>
              <Text style={styles.infoText}>Humidity: {item.humidity}%</Text>
              <Text style={styles.infoText}>Rainfall: {item.rainfall}mm</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleChatBot}>
                <Text style={styles.buttonText}>Chatbot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 250,
    height: 190,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  infoContainer: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    width: "40%",
    alignItems: "center",
    margin: 5,
  },
  buttonText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  titleContainer: {
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
});

export default DetailModal;
