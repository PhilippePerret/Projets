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
  static get(projet_id){
    return this.items[projet_id]
  }

  static edit(projet){
    if ( 'number' === typeof projet) projet = this.get(projet_id)
    ProjetForm.openForm(projet)
  }

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
    const data_projets = await MySql2.execute("SELECT * FROM projets")
    data_projets.forEach(datap => {
      var projet = new Projet(datap.id, datap)
      Object.assign(my.items, {[datap.id]: projet})
      my.all.push(projet)
    })
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
  **/

  constructor(id, data){
    this.id = id
    data && this.dispatch(data)
  }

  dispatch(data){
    this.data = data
    for ( var k in data ) this[k] = data[k]
  }

  /**
    Actualise le projet avec les données +data+
  **/
  update(data){
    this.dispatch(data)
    this.domObj && this.remove()
    this.placeInList()
  }

  placeInList(){
    this.domList.append(this.asCard())
    this.observe()
  }

  remove(){
    document.querySelector(`#${this.domId}`).remove()
    delete this._domObj
    this._domObj = undefined
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
    let li = Dom.create('LI', {class:'projet', 'data-id':this.id, id:this.domId})
    let firstLine = Dom.createDiv({class:'first-line'})
    firstLine.append(Dom.createButton({text:'Edit', class:'btn-edit'}))
    firstLine.append(Dom.createSpan({class:'name', text:this.name.toUpperCase()}))
    let secondLine = Dom.createDiv()
    secondLine.append(Dom.createSpan({text:'Ouvrir : '}))
    if ( this.folder ) {
      secondLine.append(Dom.createButton({text:'le dossier', class:'btn-open-folder'}))
    }
    if ( this.file ) {
      secondLine.append(Dom.createButton({text:'le fichier', class:'btn-open-file'}))
    }
    li.append(firstLine)
    li.append(secondLine)
    return li
  }

  /**
    |
    | Méthodes d'évènement
    |
  **/
  observe(){
    var o = this.domObj
    o.find('.btn-edit').on('click', this.onEdit.bind(this))
    o.find('.btn-open-folder').on('click', this.onOpenFolder.bind(this))
    o.find('.btn-open-file').on('click', this.onOpenFile.bind(this))
  }

  onEdit(e){
    Projet.edit(this)
    return stopEvent(e)
  }
  onOpenFolder(e){
    this.folder || raise("Impossible d'ouvrir le dossier : il n'est pas défini.")
    let cmd = ((opening)=>{switch (this.open_in) {
      case 'finder':  return `open "${this.folder}"`
      case 'atom':    return `atom "${this.folder}"`
      case 'mate':    return `mate "${this.folder}"`
      case 'xterm':   return `cd "${this.folder}"`
      default:
        return `open "${this.folder}"`
    }})(this.open_in)
    console.log("cmd = '%s'", cmd)
    exec(cmd)
    return stopEvent(e)
  }

  onOpenFile(e){
    this.file || raise("Impossible d'ouvrir le fichier : le n'est pas défini.")
    exec(`open "${this.file}"`)
    return stopEvent(e)
  }
  /**
    |
    | Propriétés (non définies par dispatch)
    |
  **/

  get domId(){ return this._domid   || (this._domid = `projet-${this.id}`) }
  get domObj(){return this._domobj  || (this._domobj = $(`#${this.domId}`))}
  /**
    Retourne l'objet DOM de la liste qui contient le projet en fonction
    de son state
  **/
  get domList(){
    switch (this.state) {
      case 'current':   return UI.currentProjetsList
      case 'next':      return UI.nextProjetsList
      case 'wait':      return UI.waitProjetsList
      case 'done':      return UI.doneProjetsList
      case 'futur':     return UI.futurProjetsList
      case 'givenup':   return UI.givenupProjetsList
      default:
        // Sinon, on le place dans la liste des prochains projets
        return UI.nextProjetsList
    }
  }
}
