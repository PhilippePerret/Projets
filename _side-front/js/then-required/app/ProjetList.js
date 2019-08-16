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
  static classLists(){
    for ( var pref of Object.keys(State.DATA) ) {
      var listName = `${pref}ProjetsList`
      var domList = UI[listName]
      var allProjDom = domList.querySelectorAll('.projet')
      var allProjets = []
      allProjDom.forEach( domProjet => {
        var projetId = parseInt(domProjet.getAttribute('data-id'),10)
        allProjets.push(Projet.get(projetId))
      })
      var dateRef = State.DATA[pref].dateRef
      allProjets.sort(function(p1, p2){
        return new Date(p2[dateRef]) - new Date(p1[dateRef])
      })
      allProjets.reverse().forEach( projet => {
        $(domList).append(projet.domObj)
      })
    }
  }

  /**
    Méthode principale pour afficher tous les projets
  **/
  static show(){
    Projet.all.forEach(projet => {
      projet.placeInList()
    })
    this.classLists()
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
  **/


}
