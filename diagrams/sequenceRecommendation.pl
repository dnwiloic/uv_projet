@startuml
actor Utilisateur
participant React_Native
participant Flask_API
participant Modèle_Python
participant BaseDeDonnées

Utilisateur ->> React_Native : Entrer les paramètres
React_Native ->> Flask_API : Envoyer les paramètres
Flask_API ->> Modèle_Python : Prédire en fonction des paramètres
Modèle_Python -->> Flask_API : Résultats de la prédiction
Flask_API -->> React_Native : Envoyer les résultats
React_Native -->> BaseDeDonnées : Sauvegarder les résultats
React_Native -->> Utilisateur : Afficher les recommandations
@enduml
