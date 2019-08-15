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
      // console.log("Affichage de ", projet)
      projet.placeInList()
    })
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
  **/


}
