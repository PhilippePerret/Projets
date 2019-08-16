'use strict'
/**
  Classe principale pour les listes de projets
**/

class ProjetList {
  /** ---------------------------------------------------------------------
    |
    | CLASSE
    |
  **/

  /**
    Méthode qui classe les projets dans les listes en fonction des dates
    de fin attendue. Plus la date est proche, plus le projet est en haut.
  **/
  static classList(){

  }

  /**
    Méthode principale pour afficher tous les projets
  **/
  static show(){
    Projet.all.forEach(projet => {
      projet.placeInList()
    })
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
  **/


}
