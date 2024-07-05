@startuml
actor Système
participant React_Native
participant API_Météo

Système ->> React_Native : Demander les données météorologiques
React_Native ->> API_Météo : Récupérer les données météorologiques
API_Météo -->> React_Native : Envoyer les données météorologiques
React_Native -->> Système : Afficher les données météorologiques
@enduml
