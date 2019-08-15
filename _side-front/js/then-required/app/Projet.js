'use strict'
/**
  Classe principale pour les projets
**/

class Projet {
  /** ---------------------------------------------------------------------
    |
    | CLASSE
    |
  **/

  static async init(){
    // Décommenter cette ligne pour créer les tables
    // ATTENTION : CELA PEUT AVOIR COMME EFFET DE DÉTRUIRE TOUTES LES DONNÉES
    // (il faut aussi décommenter ci-dessus dans la fonction)
    // PROJET_DB.CreateTables()
    await this.loadAll()
    ProjetDisplay.show()
  }


  /**
    Méthode qui charge tous les projets et les mets dans les données `items`
    et `all`
  **/
  static async loadAll(){
    const my = this
    this.items = {}
    this.all   = []
    let request = "SELECT * FROM projets"
    const data_projets = await MySql2.execute(request)
    console.log("data_projets", data_projets)
    data_projets.forEach(datap => {
      var projet = new Projet(datap.id)
      projet.dispatch(datap)
      Object.assign(my.items, {[datap.id]: projet})
      my.all.push(projet)
    })
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
  **/

  constructor(id){
    this.id = id
  }

  dispatch(data){
    for ( var k in data ) this[k] = data[k]
  }

  /**
    |
    | Helpers méthodes
    |
  **/

  /**
    Retourne le projet sous forme de carte, pour affichage
  **/
  asCard(options){
    let li = Dom.create('LI', {class:'projet', 'data-id':this.id, id:`projet-${this.id}`})
    li.append(Dom.createSpan({class:'projet-name', text:this.name}))
    return li
  }

  /**
    |
    | Propriétés (non définies par dispatch)
    |
  **/
}
