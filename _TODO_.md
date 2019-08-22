* Quand on demande à ouvrir à un projet, on met en route un chronomètre qui va enregistrer le temps de travail sur le projet.
  - ajouter une colonne "working_time" pour conserver le temps de travail sur le projet.
  - possibilité de mettre en route ce chronomètre avec un bouton
  - bouton pour arrêter le chronomètre à la fin de la séance
  - possibilité d'annuler le chronométrage (lorsqu'on a déclenché le chrono par erreur en ouvrant un dossier).
  - affichage dans les détails du temps de travail sur le projet

* Pouvoir ajouter une image/icone au projet
* Une image par défaut par type de projet

* Pouvoir ajouter très simplement des tâches au projet
  - une table tâche avec une clé externe projet_id
  - propriétés :
    id
    projet_id
    tache     Texte de ce qu'il y a à faire
    priority  Priorité par rapport aux autres (en trois lettres, p.e. 'ccc'), pour pouvoir les classer facilement
    created_at
    updated_at
    expected_at   Plus tard ou maintenant, à voir
  - faire un petit formulaire pour gérer ça (formulaire volant — draggable)
  - ajouter les tâches dans le détail du projet, ou alors un autre bouton "tâches" plutôt

* Pouvoir afficher une vue où on voir tous les projets sur une chronologie, avec leur fin et leur début.
  - pouvoir modifier les dates par drag.

* Quand un projet est en dépassement et qu'on change sa date de fin attendue, et qu'elle est bonne, enlever ses styles (au li principal et au span de la date de fin attendue)

* Faire des contrôles, quand on change les dates, pour ne pas mettre d'incohérences, comme par exemple une date de fin avant une date de début (note : on ne peut pas jouer sur les options de datepicker)

## Plus tard

* Pouvoir faire des tâches pour chaque projet, qui détermineraient son avancement
  => table tâche avec projet_id comme clé externe.
