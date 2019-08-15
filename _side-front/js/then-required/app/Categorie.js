'use strict'
/**
  Class Categorie
  -----------
  Gestion des états du projet
**/

class Categorie {
  static get DATA(){ return this._data || (this._data = this.getData())}

  /**
    Retourne un menu pour la propriété +prop+ du projet +projet+
    @param {String} prop    Propriété, 'state' par défaut
  **/
  static menuFor(projet, prop){
    return Dom.createSelect({value:this.selectValues, name:`projet-${projet.id}-${prop||'categorie'}`})
  }

  static get selectValues(){
    let values = []
    for(var k in this.DATA){ values.push([k, this.DATA[k].hname])}
    return values
  }

  static getData(){
    return {
        0:  {hname: 'Projet de roman'}
      , 1:  {hname: 'Projet de nouvelle'}
      , 1:  {hname: 'Projet de scénario'}
      , 2:  {hname: 'Autre projet d’écriture'}
      , 10: {hname: 'Tutoriel écriture'}
      , 11: {hname: 'Tutoriel musique'}
      , 12: {hname: 'Autre tutoriel'}
      , 20: {hname: 'Programme informatique'}
      , 30: {hname: 'Animation'}
      , 40: {hname: 'Analyse musicale'}
      , 60: {hname: 'Site internet'}
      , 50: {hname: 'Film'}
      , 99: {hname: 'Autre'}
    }
  }
}
