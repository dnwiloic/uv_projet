@startuml
[*] --> Déconnecté
Déconnecté --> Connexion : L'utilisateur soumet ses identifiants
Connexion --> Connecté : Authentification réussie
Connexion --> Déconnecté : Authentification échouée
Connecté --> Déconnexion : L'utilisateur se déconnecte
Déconnexion --> Déconnecté
Connecté --> SessionExpirée : Délai d'inactivité
SessionExpirée --> Déconnecté
@enduml
