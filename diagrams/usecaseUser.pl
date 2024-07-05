@startuml
left to right direction
actor "Utilisateur" as user
rectangle Système {
  usecase "Connexion" as UC1
  usecase "Inscription" as UC2
  usecase "Lancer une recommandation" as UC3
  usecase "Obtenir les conditions météorologiques" as UC4
  usecase "Discuter avec notre chatbot spécialisé en agriculture" as UC5
}
user -- UC1
user -- UC2
user -- UC3
user -- UC4
user -- UC5
@enduml
