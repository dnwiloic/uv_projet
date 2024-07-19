@startuml
node "Appareil Utilisateur" {
    [Application React Native]
}

node "Cloud de Rendu" {
    node "Firebase" {
        [Authentification]
    }
    node "Base de Données" {
        [SQLite]
    }

    node "Serveur API Flask" {
        [Contrôleurs API]
        [Logique Métier]
        [Accès aux Données]
    }

    node "Serveur Machine Learning" {
        [Recommandation de Cultures (Random Forest)]
    }
}

[Application React Native] --> [Authentification] : Authentifie
[Application React Native] --> [SQLite] : Stocke/Récupère les Données
[Application React Native] --> [Contrôleurs API] : Envoie des Requêtes
[Contrôleurs API] --> [Logique Métier] : Traite
[Logique Métier] --> [Accès aux Données] : Interagit
[Accès aux Données] --> [SQLite] : Opérations CRUD
[Logique Métier] --> [Recommandation de Cultures (Random Forest)] : Appelle
@enduml
