@startuml
skinparam componentStyle rectangle

package "React Native" {
    [Composants UI]
    [Services]
}

package "Firebase" {
    [Authentification]
}
package "Base de Données"{
    [SQLite]
}

package "Backend (API Flask)" {
    [Contrôleurs API]
    [Logique Métier]
    [Accès aux Données]
}

[Composants UI] --> [Services] : Utilise
[Services] --> [Authentification] : Authentifie
[Services] --> [SQLite] : Stocke/Récupère les Données
[Services] --> [Contrôleurs API] : Envoie des Requêtes
[Contrôleurs API] --> [Logique Métier] : Traite
[Logique Métier] --> [Accès aux Données] : Interagit
[Accès aux Données] --> [SQLite] : Opérations CRUD
@enduml
