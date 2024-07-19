import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../../SQLite";
import { api_url } from "../context/Constant";

const Chatbot = ({ userId, refresh, initialMessage }) => {
  console.log(initialMessage);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Welcome to NexGen_Agri Chatbot. How can I assist you today?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchChatHistory = async () => {
      const chatHistory = await database.getChatHistoryByUserId(userId);
      if (chatHistory.length > 0) {
        setMessages(
          chatHistory.map((msg) => ({ type: msg.role, text: msg.content }))
        );
      } else {
        setMessages([
          {
            type: "bot",
            text: "Welcome to NexGen_Agri Chatbot. How can I assist you today?",
          },
        ]);
      }
      setIsLoading(false);
    };

    fetchChatHistory();
  }, [userId, refresh]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const newMessages = [...messages, { type: "user", text: newMessage }];
      setMessages(newMessages);
      await database.saveChatHistory(userId, "user", newMessage);
      fetchBotResponse(newMessage);
      setNewMessage("");
    }
  };

  const fetchBotResponse = async (message) => {
    setIsLoading(true);
    try {
      const response = await axios.post(api_url + "/chat_completion", {
        prompt: message,
      });

      const botMessage = response.data.response;
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: botMessage },
      ]);
      await database.saveChatHistory(userId, "bot", botMessage);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = "Sorry, I couldn't process your request.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: errorMessage },
      ]);
      await database.saveChatHistory(userId, "bot", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.messagesContainer}
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={() =>
            this.scrollView.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.message,
                message.type === "bot" ? styles.botMessage : styles.userMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.type === "bot"
                    ? styles.botMessageText
                    : styles.userMessageText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={initialMessage ? initialMessage : "Enter your message"}
            placeholderTextColor="#ccc"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginVertical: 5,
    padding: 8,
    borderRadius: 10,
    maxWidth: "80%",
  },
  botMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "powderblue",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "black",
  },
  botMessageText: {
    color: "black",
  },
  userMessageText: {
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#fff",
    color: "black",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chatbot;
