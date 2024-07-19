@startuml
skinparam componentStyle rectangle

package "Modèles de Machine Learning" {
    [Recommandation de Cultures (Random Forest)]
}

package "Caractéristiques" {
    [Contenu en Azote (N)]
    [Contenu en Phosphore (P)]
    [Contenu en Potassium (K)]
    [Température]
    [Humidité]
    [Valeur du pH]
    [Précipitations]
}

package "Processus" {
    [Prétraitement des Données]
    [Entraînement du Modèle]
    [Prédiction]
    [Évaluation]
}

[Recommandation de Cultures (Random Forest)] --> [Contenu en Azote (N)]
[Recommandation de Cultures (Random Forest)] --> [Contenu en Phosphore (P)]
[Recommandation de Cultures (Random Forest)] --> [Contenu en Potassium (K)]
[Recommandation de Cultures (Random Forest)] --> [Température]
[Recommandation de Cultures (Random Forest)] --> [Humidité]
[Recommandation de Cultures (Random Forest)] --> [Valeur du pH]
[Recommandation de Cultures (Random Forest)] --> [Précipitations]

[Prétraitement des Données] --> [Recommandation de Cultures (Random Forest)]
[Entraînement du Modèle] --> [Recommandation de Cultures (Random Forest)]
[Prédiction] --> [Recommandation de Cultures (Random Forest)]
[Évaluation] --> [Recommandation de Cultures (Random Forest)]
@enduml
