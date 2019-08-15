'use strict'
/**
  Classe principale pour les projets
**/

class ProjetDisplay {
  /** ---------------------------------------------------------------------
    |
    | CLASSE
    |
  **/

  /**
    Méthode principale pour afficher tous les projets
  **/
  static show(){
    Projet.all.forEach(projet => {
      console.log("Affichage de ", projet)
      var container = (function(state){
        switch (state) {
          case 'current': return UI.currentProjetsList
          case 'next':    return UI.nextProjetsList
          case 'done':    return UI.doneProjetsList
          case 'givenup': return UI.givenupProjetsList
          default:
            // Sinon, on le place dans la liste des prochains projets
            return UI.nextProjetsList
        }
      })(projet.state)
      console.log("container = ", container)
      container.append(projet.asCard())
    })
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
  **/


}
