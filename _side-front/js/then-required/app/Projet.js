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
    ProjetList.show()
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

  // Ajoute du temps de travail pour ce projet
  async addWorkingTime(nombreSecondes) {
    if ( !this.working_time) this.working_time = 0
    this.working_time += nombreSecondes
    let request = "UPDATE projets SET working_time = ? WHERE id = ?"
    let values  = [this.working_time, this.id]
    await MySql2.execute(request, values)
    var hduration = this.chrono.s2h(this.working_time)
    UI.message(`New working time for «${this.name}» : ${hduration}`)
    $(`#${this.domId}-working_time`).text(hduration)
  }

  // Retourne true si le projet est dépassé
  isOutOfDate(){
    return this.expected_at && (new Date() > new Date(this.expected_at))
  }

  placeInList(){
    this.domList.append(this.asCard())
    this.observe()
  }

  remove(){
    this.domObj.remove()
    delete this._domobj
    this._domobj = undefined
  }
  /** ---------------------------------------------------------------------
    |
    | Méthodes d'helpers
    |
  **/

  /**
    Retourne le projet sous forme de carte, pour affichage
  **/
  asCard (options) {
    let css = ['projet']
    this.isOutOfDate() && css.push('outofdate')
    let li = Dom.create('LI', {class:css.join(' '), 'data-id':this.id, id:this.domId})
    let firstLine = Dom.createDiv({class:'first-line'})
    let rightButtons = Dom.createDiv({class:'right-buttons'})
    rightButtons.append(Dom.createButton({text:'détail', class:'btn-details'}))
    rightButtons.append(Dom.createButton({text:'edit', class:'btn-edit'}))
    firstLine.append(rightButtons)
    firstLine.append(Dom.createSpan({class:'name', text:this.name.toUpperCase()}))
    // La ligne de détails
    let detailsLine = Dom.createDiv({class:'details hidden'})
    detailsLine.append(Dom.createDiv({class:'description', text:this.description}))
    detailsLine.append(this.spanDateFor('expected_at', 'Fin espérée'))
    detailsLine.append(this.spanDateFor('working_time', 'Durée de travail'))
    detailsLine.append(Dom.createFormRow('Déplacer vers', State.menuFor(this, 'state', this.state)))
    detailsLine.append(this.spanDateFor('started_at', 'Début du travail'))
    detailsLine.append(this.spanDateFor('finished_at', 'Fin réelle'))
    detailsLine.append(this.spanDateFor('created_at', 'Donnée créée le'))
    detailsLine.append(this.spanDateFor('updated_at', 'Dernière modification'))

    let secondLine = Dom.createDiv({class:'bottom-buttons'})
    secondLine.append(Dom.createSpan({text: '⏱', class:'chrono'}))
    secondLine.append(Dom.createSpan({text: '0:00:00', class:'timer'}))
    secondLine.append(Dom.createSpan({text:'Ouvrir : '}))
    if ( this.folder ) {
      secondLine.append(Dom.createButton({text:'le dossier', class:'btn-open-folder'}))
    }
    if ( this.file ) {
      secondLine.append(Dom.createButton({text:'le fichier', class:'btn-open-file'}))
    }
    li.append(firstLine)
    li.append(detailsLine)
    li.append(secondLine)
    return li
  }

  /**
    Construction d'un span contenant une date modifiable
  **/
  spanDateFor(prop, text){
    var css = ['date', prop]
    if ( prop === 'expected_at' ) {
      if ( this.isOutOfDate() ) {
        css.push('warning', 'bold')
      } else if ( this.expected_at ) {
        css.push('ok', 'bold')
      }
    }
    var spanDate = Dom.createDiv({class:css.join(' '), id:`span-${this.domId}-${prop}`})
    spanDate.append(Dom.create('LABEL',{text:text}))
    var val
    if ( prop != 'working_time' ) {
      val = this[prop] ? humanDateFor(this[prop],'short') : '- N/D -'
      spanDate.append(Dom.createInputText({id:`${this.domId}-${prop}`, class:'datable', value:val}))
    } else {
      val = this.chrono.s2h(this.working_time)
      spanDate.append(Dom.create('LABEL',{id:`${this.domId}-${prop}`, class:'bold center', text:val}))
    }
    return spanDate
  }

  /** ---------------------------------------------------------------------
    |
    | Méthodes d'évènement
    |
  **/
  observe(){
    const my = this
    this._domobj = undefined
    delete this._domobj
    var o = this.domObj
    o.find('.btn-edit').on('click', this.onEdit.bind(this))
    o.find('.btn-details').on('click', this.onDetails.bind(this))
    o.find('.btn-open-folder').on('click', this.onOpenFolder.bind(this))
    o.find('.btn-open-file').on('click', this.onOpenFile.bind(this))
    o.find('.details input.datable').each( (i, ui) => {
      var [rien, projId, dateProp] = $(ui).attr('id').split('-')
      // console.log("ui = ", ui, projId, dateProp)
      $(ui).datepicker({
          options:null
        , gotoCurrent: true
        , defaultDate: new Date(this[dateProp])
        , monthNamesShort: [ "Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Déc" ]
        , onClose: my.onChooseDate.bind(my)
      })
    })
    o.find(`.details select.state`).on('change', my.onChangeState.bind(my))

    // Le chronomètre pour mettre en route ou arrêter le chronomètre
    // sur le projet
    my.chronometre.on('click', my.onToggleChronometre.bind(my))
    my.timer.on('click', my.onToggleChronometre.bind(my))
  }

  /**
    Pour débuter le travail sur le projet, mais seulement si le chronomètre
    ne tourne pas encore. Dans le cas contraire, puisque le travail est déjà
    commencé, on ne fait rien.
    Cette méthode est appelée principalement lorsque l'on ouvre le dossier ou
    le fichier du projet. Quand on ouvre les deux, le second élément ne doit
    rien démarrer puisque le travail est déjà en cours
  **/
  onStartWorking(){
    if ( this.chrono.running ) return
    this.onToggleChronometre()
  }

  // Pour arrêter ou lancer le chronomètre
  onToggleChronometre(e){
    const my = this
    if ( my.chrono.running == true ) {
      my.chrono.stop(my)
    } else {
      my.chrono.start(my)
    }
    return e && stopEvent(e)
  }
  // Pour afficher les détails du projet
  onDetails(e){
    this.domObjDetails.toggle()
    return stopEvent(e)
  }
  onEdit(e){
    Projet.edit(this)
    return stopEvent(e)
  }

  // Appelée quand on clique sur le bouton "Ouvrir Fichier"
  onOpenFile(e){
    this.file || raise("Impossible d'ouvrir le fichier : le n'est pas défini.")
    exec(`open "${this.file}"`)
    // On débute le travail (s'il n'est pas déjà commencé)
    this.onStartWorking()
    return stopEvent(e)
  }

  // Appelée quand on clique sur le bouton "Ouvrir Dossier"
  onOpenFolder(e){
    this.folder || raise("Impossible d'ouvrir le dossier : il n'est pas défini.")
    let cmd = this.commandByOpenIn()
    // console.log("cmd = '%s'", cmd)
    exec(cmd, {shell: '/bin/bash'})
    // On débute le travail (s'il n'est pas déjà commencé)
    this.onStartWorking()
    return stopEvent(e)
  }

  async onChooseDate(newDate, picker){
    const my = this
    const prop = $(picker).attr('id').split('-')[2]
    newDate = new Date(newDate)
    if ( mmddyyyy(newDate) != mmddyyyy(new Date(this[prop])) ) {
      await MySql2.execute(`UPDATE projets SET ${prop} = ? WHERE id = ?`, [newDate, this.id])
    }
    let fdate = humanDateFor(newDate, 'short')
    setTimeout(()=>{
      $(`#${this.domId}-${prop}`).val(fdate)
    }, 500)
  }

  async onChangeState(e){
    var newState = this.domState.val()
    let listName = `${newState}ProjetsList`
    let list = UI[listName]
    $(list).append(this.domObj)
    this.data.state = newState
    await MySql2.execute(`UPDATE projets SET state = ? WHERE id = ?`, [newState, this.id])
  }

  // Retourne la commande d'ouverture du dossier en fonction
  // de la propriété `open_in`
  commandByOpenIn(){
    switch (this.open_in) {
      case 'finder':  return `open "${this.folder}"`
      // case 'atom':    return `/Applications/Atom.app/Contents/MacOS/Atom "${this.folder}"`
      case 'atom':    return `/usr/local/bin/atom "${this.folder}"`
      case 'mate':    return `mate "${this.folder}"`
      case 'xterm':   return `cd "${this.folder}"`
      default: return `open "${this.folder}"`
    }
  }

  /**
    |
    | Méthodes pour le temps de travail (chronométrage)
    |
  **/

  initChrono(){
    const my = this
    my.chrono.init()
  }


  get chrono(){
    return this._chrono || (this._chrono = new WorkingTime(this))
  }
  /**
    |
    | Propriétés (non définies par dispatch)
    |
  **/

  get domId(){ return this._domid   || (this._domid = `projet-${this.id}`) }
  get domObj(){return this._domobj  || (this._domobj = $(`#${this.domId}`))}
  get domObjDetails(){ return this.domObj.find('div.details')}
  get domState(){ return this.domObjDetails.find('select.state')}
  get chronometre(){
    return this._chronometre || (this._chronometre = this.domObj.find('span.chrono'))
  }
  get timer(){
    return this._timer || (this._timer = this.domObj.find('span.timer'))
  }
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
