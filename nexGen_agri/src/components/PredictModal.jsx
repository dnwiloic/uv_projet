import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomAlert from "./CustomAlert";

import { useNavigation } from "@react-navigation/native";
import imageMap from "./ImageMap";

const PredictModal = ({
  visible,
  onClose,
  onSave,
  predictionResult,
  formData,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!visible) {
      setAlertVisible(false);
    }
  }, [visible]);

  const handleSave = () => {
    setAlertVisible(true);
  };

  const handleCancel = () => {
    onClose();
    navigation.navigate("BottomTabNavigator", {
      screen: "Dashboard",
      params: { refresh: true },
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>{predictionResult}</Text>
            </View>
            <Image
              source={imageMap[predictionResult?.toLowerCase()]}
              style={styles.modalImage}
            />

            <Text style={styles.modalText}>
              Learn how to cultivate {predictionResult} with the best practices
              for your soil.
            </Text>
            {formData && (
              <>
                <Text style={styles.modalText}>
                  Nitrogen: {formData.nitrogen}
                </Text>
                <Text style={styles.modalText}>
                  Phosphorus: {formData.phosphorus}
                </Text>
                <Text style={styles.modalText}>
                  Potassium: {formData.potassium}
                </Text>
                <Text style={styles.modalText}>pH: {formData.ph}</Text>
                <Text style={styles.modalText}>
                  Humidity: {formData.humidity}
                </Text>
                <Text style={styles.modalText}>
                  Rainfall: {formData.rainfall}
                </Text>
                <Text style={styles.modalText}>
                  Temperature: {formData.temperature}
                </Text>
              </>
            )}
            <Pressable
              style={[styles.button, styles.buttonChatbot]}
              onPress={() => alert("Chatbot Activated")}
            >
              <Text style={styles.textStyle}>Ask the Chatbot</Text>
            </Pressable>
            <View style={styles.saveContainer}>
              <Pressable style={styles.buttonClose} onPress={handleCancel}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.buttonClose} onPress={handleSave}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onSave={onSave}
        predictionResult={predictionResult}
        formData={formData}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 12,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    //backgroundColor: "#2196F3",
  },
  buttonChatbot: {
    backgroundColor: "white",
    width: 250,
  },
  textStyle: {
    color: "purple",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
  },
  modalImage: {
    width: 250,
    height: 230,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  saveContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 25,
    marginTop: 20,
  },
  titleContainer: {
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
});

export default PredictModal;
