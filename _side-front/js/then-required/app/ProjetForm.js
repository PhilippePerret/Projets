'use strict'
/**
  Classe s'occupant du formulaire projet, donc permettant de créer ou
  d'éditer un projet.
**/

const ProjetForm = {
  toggleForm(){
    if ( this._form ) {
      this.closeForm()
    } else {
      this.openForm()
    }
  }
, closeForm(){this.form.remove(); delete this._form}
, openForm(projet){
  this.form && this.closeForm()
  this.build()
  this.form || raise("Impossible de trouver le formulaire, bizarre…")
  this.observe()
  projet && this.setFormValues(projet.data)
}

, PROPERTIES: ['id', 'name', 'description', 'categorie', 'state','folder','open_in','file','started_at','expected_at','finished_at']
, DATE_PROPERTIES: ['started_at','expected_at','finished_at']
, INTEGER_PROPERTIES: ['id', 'categorie']
, table_name: 'projets'
, prefix: 'projet'

, async save(){
    if ( !this.dataAreValid() ) return
    let projet_id = this.values.id
      , now = new Date()
      , isNew = !projet_id
    let projet
    delete this.values.id
    var columns = []
    var values  = []
    for ( var prop in this.values ){
      columns.push(`${prop} = ?`)
      values.push(this.values[prop])
    }
    columns.push('updated_at = ?');values.push(now)
    var request
    if ( ! isNew ) {
      // <= l'identifiant du projet est défini
      // => C'est une modification
      values.push(projet_id)
      request = `UPDATE ${this.table_name} SET ${columns.join(', ')} WHERE id = ?`
    } else {
      // <= L'identifiant du projet n'est pas défini
      // => C'est une création
      columns.push('created_at = ?');values.push(now)
      request = `INSERT INTO ${this.table_name} SET ${columns.join(', ')}`
    }
    console.log("request:", request)
    console.log("values:", values)
    await MySql2.execute(request, values)
    this.closeForm()
    if ( isNew ) {
      projet_id = await MySql2.lastInsertId()
      projet = new Projet(projet_id)
      Object.assign(Projet.items, {[projet_id]: projet})
      Projet.all.push(projet)
    } else {
      projet = Projet.get(projet_id)
    }
    projet.update(this.values)
  }

  // Return true si les données sont valides et les met dans `this.values`
, dataAreValid(){
    const vals = this.getFormValues()
    try {
      vals.name || raise("Il faut donner un nom au projet.")
      this.values = vals
      return true
    } catch (e) {
      alert(e.message)
      return false
    }
  }

, build(){
    let form = Dom.create('FORM', {id:'projet-form'})

    // ID caché
    form.append(Dom.createFormRow(null, Dom.createHidden({name:'projet-id'})))
    // Nom du projet
    form.append(Dom.createFormRow(null, Dom.createInputText({name:'projet-name', placeholder:'Titre/nom du projet'})))
    // Catégorie
    form.append(Dom.createFormRow(null, Dom.createSelect({name:'projet-categorie',values:Categorie.selectValues})))
    // Statut
    form.append(Dom.createFormRow(null, Dom.createSelect({name:'projet-state',values:State.selectValues})))
    // Description
    form.append(Dom.createFormRow('Description', Dom.createTextarea({name:'projet-description', placeholder:'Brève description du projet'})))
    // Dossier
    form.append(Dom.createFormRow('Dossier principal', Dom.createInputText({name:'projet-folder', id:'projet-folder'})))
    form.append(Dom.createFormRow('Ouvrir dans', Dom.createSelect({name:'projet-open_in', values:WithApp.selectValues})))
    // Fichier
    form.append(Dom.createFormRow('Fichier courant', Dom.createInputText({name:'projet-file', id:'projet-file'})))
    // Dates
    form.append(Dom.createFormRow('Date de début (MM/JJ/AAAAA)', Dom.createDateField({name:'projet-started_at'})))
    form.append(Dom.createFormRow('Date de fin espérée (MM/JJ/AAAAA)', Dom.createDateField({name:'projet-expected_at'})))
    form.append(Dom.createFormRow('Date de fin réelle (MM/JJ/AAAAA)', Dom.createDateField({name:'projet-finished_at'})))

    let divButtons = Dom.createDiv({class:'row buttons'})
    divButtons.append(Dom.createButton({text:'Enregistrer', id:'btn-save'}))
    form.append(divButtons)

    // console.log("form:", form)

    UI.rightColumn.append(form)
  }
, observe(){
    this.form.querySelector('#btn-save').addEventListener('click', this.save.bind(this))
    this.form.querySelector('#projet-folder').addEventListener('click', this.chooseMainFolder.bind(this))
    this.form.querySelector('#projet-file').addEventListener('click', this.chooseMainFile.bind(this))
  }

  // Pour choisir le dossier principal
, chooseMainFolder(){
    var res = Dialog.showOpenDialogSync({title:"Dossier principal", properties:['openDirectory'], message:"Choisir le dossier principal du projet :"})
    if ( res ){
      res = res[0]
      if ( res ){ this.form.querySelector('#projet-folder').value = res }
    }
  }

  // Pour choisir le fichier principal
, chooseMainFile(){
    var res = Dialog.showOpenDialogSync({title:"Fichier principal", properties:['openFile'], message:"Choisir le fichier principal (actuel) du projet :"})
    if ( res ){
      res = res[0]
      if ( res ){ this.form.querySelector('#projet-file').value = res }
    }
  }
}
Object.defineProperties(ProjetForm,{
  form:{get(){
    if ( ! this._form ) {
      this._form = document.querySelector('#projet-form')
    }
    return this._form
  }}
})

Object.assign(ProjetForm, FormModule)
