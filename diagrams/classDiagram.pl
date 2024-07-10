@startuml
    class Utilisateur {
        -String nom
        -String email
        -String motDePasse
        +sInscrire()
        +seConnecter()
    }
    class Recommandation {
        -float N
        -float P
        -float K
        -float temperature
        -float humidité
        -float ph
        -float précipitations
        -String recommandation
        +faireRecommandation()
    }
    class HistoriqueDeChat {
        -String rôle
        -String contenu
    }
    class Météo {
        -String ville
        -String température
        -String conditions
        -String humidité
        -String vitesseDuVent
        -String précipitations
        -String visibilité
        -String indiceUV
        -String qualitéDeLair
        +afficherConditions()
    }
    class Système {
        +obtenirMétéoActuelle()
        +obtenirDonnéesPrévision()
    }

    Utilisateur "1" --> "1..n" Recommandation
    Utilisateur "1" --> "1..n" Météo
    Utilisateur "0..n" --> "0..n" HistoriqueDeChat
    Système "0..n" --> "0..n" HistoriqueDeChat
@enduml
