* # Quand on quitte l'application, il faut vérifier qu'aucun projet ne soit en cours (son chrono en marche). Pour le savoir, on pourrait conserver la référence générale au projet qui est en cours (en sachant qu'il ne peut pas y en avoir deux en même temps)

* Pouvoir marquer des tâches "done" et ne plus les afficher

* Préférences générales de l'application
  - projets qui doivent être affichés (on peut par exemple ne vouloir voir que les projets courants et proches)

* Pouvoir ajouter une image/icone au projet
* Une image par défaut par type de projet

* Pouvoir ajouter très simplement des tâches au projet
  - faire un petit formulaire pour gérer ça (formulaire volant — draggable)
  - ajouter les tâches dans le détail du projet, ou alors un autre bouton "tâches" plutôt

* Pouvoir afficher une vue où on voir tous les projets sur une chronologie, avec leur fin et leur début.
  - pouvoir modifier les dates par drag.

* Pouvoir afficher une vue du projet avec toutes ses tâches, même celles qui ont été marquées finies.

* Quand un projet est en dépassement et qu'on change sa date de fin attendue, et qu'elle est bonne, enlever ses styles (au li principal et au span de la date de fin attendue)

* Faire des contrôles, quand on change les dates, pour ne pas mettre d'incohérences, comme par exemple une date de fin avant une date de début (note : on ne peut pas jouer sur les options de datepicker)

## Plus tard

* Pouvoir faire des tâches pour chaque projet, qui détermineraient son avancement
  => table tâche avec projet_id comme clé externe.
