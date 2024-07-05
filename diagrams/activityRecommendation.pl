@startuml
start
:Utilisateur saisit les paramètres;
:Envoyer les paramètres au backend;
:Le backend traite les paramètres;
:Interroger le modèle de recommandation de cultures;
if (Le modèle suggère une culture?) then (oui)
  :Retourner la culture recommandée;
else (non)
  :Gérer le cas sans recommandation;
endif
:Afficher la recommandation à l'utilisateur;
stop
@enduml
