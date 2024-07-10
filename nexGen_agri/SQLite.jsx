import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

let db;

const deleteDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/NexGenAgri.db`;
  try {
    await FileSystem.deleteAsync(dbPath);
    console.log("Base de données supprimée avec succès");
  } catch (error) {
    console.log(
      "Erreur lors de la suppression de la base de données : ",
      error
    );
  }
};

const init = async () => {
  db = await SQLite.openDatabaseAsync("NexGenAgri.db");

  // Création de la table Utilisateur
  const queryUser = `CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY NOT NULL,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    motDePasse TEXT NOT NULL
  );`;

  // Création de la table Recommendation avec clé étrangère
  const queryRecommendation = `CREATE TABLE IF NOT EXISTS Recommendation (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    N FLOAT,
    P FLOAT,
    K FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    rainfall FLOAT,
    pH FLOAT,
    string_recommendation TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
  );`;

  // Création de la table Weather
  const queryWeather = `CREATE TABLE IF NOT EXISTS Weather (
    id INTEGER PRIMARY KEY NOT NULL,
    ville TEXT,
    temperature TEXT,
    conditions TEXT,
    humidity TEXT,
    windSpeed TEXT,
    precipitation TEXT,
    visibility TEXT,
    uvIndex TEXT,
    airQuality TEXT
  );`;

  // Création de la table ChatHistory
  const queryChatHistory = `CREATE TABLE IF NOT EXISTS ChatHistory (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
  );`;

  try {
    await db.execAsync(queryUser);
    await db.execAsync(queryRecommendation);
    await db.execAsync(queryWeather);
    await db.execAsync(queryChatHistory);
    console.log("Tables créées ou déjà existantes");
  } catch (error) {
    console.log("Erreur lors de la création des tables : ", error);
  }
};

const register = async (nom, email, motDePasse) => {
  try {
    await db.runAsync(
      "INSERT INTO Users (nom, email, motDePasse) VALUES (?, ?, ?)",
      [nom, email, motDePasse]
    );
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "An error occurred during registration" };
  }
};

const login = async (email, password) => {
  db = await SQLite.openDatabaseAsync("NexGenAgri.db");
  try {
    const query = `SELECT id, nom, email FROM Users WHERE email = ? AND motDePasse = ?`;
    const user = await db.getFirstAsync(query, [email, password]);
    return user
      ? { success: true, user }
      : { success: false, message: "Invalid email or password." };
  } catch (error) {
    console.error("Database login error:", error);
    return { success: false, message: "An error occurred during login." };
  }
};

const saveRecommendation = async (userId, formData, predictionResult) => {
  try {
    await db.runAsync(
      "INSERT INTO Recommendation (user_id, N, P, K, temperature, humidity, rainfall, pH, string_recommendation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        formData.nitrogen,
        formData.phosphorus,
        formData.potassium,
        formData.temperature,
        formData.humidity,
        formData.rainfall,
        formData.ph,
        predictionResult,
      ]
    );
    console.log("Recommendation saved successfully");
  } catch (error) {
    console.log("Error saving recommendation: ", error);
  }
};

export const getRecommendationsByUserId = async (userId) => {
  try {
    const query = "SELECT * FROM Recommendation WHERE user_id = ?";
    const results = await db.getAllAsync(query, [userId]);
    return results;
  } catch (error) {
    console.log("Error fetching recommendations: ", error);
    return [];
  }
};

const deleteRecommendation = async (recommendationId) => {
  try {
    await db.runAsync("DELETE FROM Recommendation WHERE id = ?", [
      recommendationId,
    ]);
    console.log("Recommendation deleted successfully");
  } catch (error) {
    console.log("Error deleting recommendation: ", error);
  }
};

const saveChatHistory = async (userId, role, content) => {
  try {
    await db.runAsync(
      "INSERT INTO ChatHistory (user_id, role, content) VALUES (?, ?, ?)",
      [userId, role, content]
    );
    console.log("Chat history saved successfully");
  } catch (error) {
    console.log("Error saving chat history: ", error);
  }
};

const getChatHistoryByUserId = async (userId) => {
  try {
    const query = "SELECT role, content FROM ChatHistory WHERE user_id = ?";
    const results = await db.getAllAsync(query, [userId]);
    return results;
  } catch (error) {
    console.log("Error fetching chat history: ", error);
    return [];
  }
};
const deleteChatHistoryByUserId = async (userId) => {
  try {
    await db.runAsync("DELETE FROM ChatHistory WHERE user_id = ?", [userId]);
    console.log("Chat history deleted successfully");
  } catch (error) {
    console.log("Error deleting chat history: ", error);
  }
};

export const database = {
  init,
  register,
  login,
  saveRecommendation,
  deleteDatabase,
  getRecommendationsByUserId,
  deleteRecommendation,
  saveChatHistory,
  getChatHistoryByUserId,
  deleteChatHistoryByUserId,
};
