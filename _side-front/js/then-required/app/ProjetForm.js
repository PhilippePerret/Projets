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
, closeForm(){this.form.remove()}
, openForm(projet){ this.build(); this.observe()}

, PROPERTIES: ['id', 'name', 'description', 'categorie', 'state','folder','file','started_at','expected_at','finished_at']
, DATE_PROPERTIES: ['started_at','expected_at','finished_at']
, INTEGER_PROPERTIES: ['id', 'categorie']
, table_name: 'projets'
, prefix: 'projet'

, async save(){
    if ( !this.dataAreValid() ) return
    const projet_id = this.values.id
        , now = new Date()
    delete this.values.id
    var columns = []
    var values  = []
    var inters  = []
    for ( var prop in this.values ){
      columns.push(prop)
      values.push(this.values[prop])
      inters.push('?')
    }
    columns.push('updated_at');inters.push('?');values.push(now)
    var request
    if ( projet_id ) {
      // <= l'identifiant du projet est défini
      // => C'est une modification
      values.push(projet_id)
      request = `UPDATE ${this.table_name} (${columns.join(', ')}) VALUES (${inters.join(', ')}) WHERE id = ?`
    } else {
      // <= L'identifiant du projet n'est pas défini
      // => C'est une création
      columns.push('created_at');inters.push('?');values.push(now)
      request = `INSERT INTO ${this.table_name} (${columns.join(', ')}) VALUES (${inters.join(', ')})`
    }
    // console.log("request:", request)
    // console.log("values:", values)
    await MySql2.execute(request, values)
    this.closeForm()
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
    // Fichier
    form.append(Dom.createFormRow('Fichier courant', Dom.createInputText({name:'projet-file', id:'projet-file'})))
    // Dates
    form.append(Dom.createFormRow('Date de début', Dom.createDateField({name:'projet-started_at'})))
    form.append(Dom.createFormRow('Date de fin espérée', Dom.createDateField({name:'projet-expected_at'})))
    form.append(Dom.createFormRow('Date de fin réelle', Dom.createDateField({name:'projet-finished_at'})))

    let divButtons = Dom.createDiv({class:'row buttons'})
    divButtons.append(Dom.createButton({text:'Enregistrer', id:'btn-save'}))
    form.append(divButtons)

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
    if ( undefined === this._form ) {
      this._form = document.querySelector('#projet-form')
    }
    return this._form
  }}
})

Object.assign(ProjetForm, FormModule)
