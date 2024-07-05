@startuml
actor Utilisateur
participant React_Native
participant NexGen_AgriChatbot
participant TraitementDuLangageNaturel as TLN
participant GenerateurDeReponses as GR
participant BaseDeConnaissances as BC
participant BaseDeDonnées

Utilisateur ->> React_Native : Demande de message
React_Native ->> NexGen_AgriChatbot : Envoyer le message
NexGen_AgriChatbot ->> TLN : Traiter le message
TLN -->> NexGen_AgriChatbot : Message analysé
NexGen_AgriChatbot ->> GR : Générer une réponse
GR ->> BC : Interroger la base de connaissances
BC -->> GR : Récupérer les informations pertinentes
GR -->> NexGen_AgriChatbot : Construire la réponse
NexGen_AgriChatbot -->> React_Native : Envoyer la réponse
React_Native -->> BaseDeDonnées : Sauvegarder les messages (demande, réponse)
React_Native -->> Utilisateur : Afficher la réponse
@enduml
