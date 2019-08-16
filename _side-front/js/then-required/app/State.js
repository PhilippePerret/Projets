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
  static menuFor(projet, prop, selected){
    return Dom.createSelect({values:this.selectValues, selected:selected, class:prop, id:`projet-${projet.id}-${prop||'state'}`, name:`projet-${projet.id}-${prop||'state'}`})
  }

  static get selectValues(){
    let values = []
    for(var k in this.DATA){ values.push([k, this.DATA[k].hname])}
    return values
  }

  static getData(){
    return {
        'current':  {hname: 'Projet en cours',    dateRef: 'expected_at'}
      , 'next':     {hname: 'Projet suivant',     dateRef: 'started_at' }
      , 'futur':    {hname: 'Projet futur',       dateRef: 'started_at' }
      , 'wait':     {hname: 'Projet en suspend',  dateRef: 'created_at'}
      , 'done':     {hname: 'Projet achevé',      dateRef: 'finished_at'}
      , 'givenup':  {hname: 'Projet abandonné',   dateRef: 'expected_at'}
    }
  }
}
