'use strict'
/**
  Class State
  -----------
  Gestion des états du projet
**/

class State {
  static get DATA(){ return this._data || (this._data = this.getData())}

  /**
    Retourne un menu pour la propriété +prop+ du projet +projet+
    @param {String} prop    Propriété, 'state' par défaut
  **/
  static menuFor(projet, prop){
    return Dom.createSelect({value:this.selectValues, name:`projet-${projet.id}-${prop||'state'}`})
  }

  static get selectValues(){
    let values = []
    for(var k in this.DATA){ values.push([k, this.DATA[k].hname])}
    return values
  }

  static getData(){
    return {
        'current':  {hname: 'Projet en cours'}
      , 'next':     {hname: 'Projet suivant'}
      , 'futur':    {hname: 'Projet futur'}
      , 'wait':     {hname: 'Projet en attente'}
      , 'done':     {hname: 'Projet achevé'}
      , 'givenup':  {hname: 'Projet abandonné'}
    }
  }
}
