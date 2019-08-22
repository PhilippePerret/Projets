'use strict'
/**
  Class Task
  ----------
  Gestion des tâches de projet.

**/

class Task {
  /** ---------------------------------------------------------------------
    |
    | CLASSE
    |
    |
  **/
  static newId(){
    if ( undefined === this.lastId) this.lastId = 0
    return ++this.lastId
  }

  /**
    Construction du formulaire pour ajouter une tâche au projet +projet+
  **/
  static buildFormFor(projet){
    var form = Dom.create('FORM',{id:`task-form-${projet.id}`, class:'task-form'})
    form.append(Dom.createHidden({name:'task-projet_id', value:projet.id}))
    form.append(Dom.createFormRow('Tâche', Dom.createInputText({name:'task-content'})))
    form.append(Dom.createFormRow('Priorité', Dom.createInputText({name:'task-priority',placeholder:'mmm'})))
    form.append(Dom.createFormRow('Attendue pour', Dom.createDateField({name:'task-expected_at'})))
    form.append(Dom.createFormRow('Terminée le', Dom.createDateField({name:'task-done_at'})))
    let buttons = Dom.createDiv({class:'row buttons'})
    buttons.append(Dom.createButton({text:'Annuler', class:'btn-cancel'}))
    buttons.append(Dom.createButton({text:'Créer la tâche', class:'btn-create'}))
    form.append(buttons)
    UI.rightColumn.append(form)
    const formObj = $(`form#task-form-${projet.id}`)
    formObj.find('button.btn-create').on('click', projet.tasks.create.bind(projet.tasks,formObj))
    formObj.find('button.btn-cancel').on('click', this.cancelEdition.bind(this, formObj))
  }

  // Quand on annule la création/édition de la tâche
  static cancelEdition(form){
    form.remove()
  }

  /** ---------------------------------------------------------------------
    |
    | INSTANCE
    |
    |
  **/
  constructor(data){
    this.data = data
    this.dispatch(data)
  }

  dispatch(data){
    for(var k in data){this[k]=data[k]}
  }

  // Sauve la tâche
  async save(){
    let request = "UPDATE tasks SET projet_id = ?, content = ?, priority = ?, expected_at = ?, done_at = ?, updated_at = ? WHERE id = ?"
    await MySql2.execute(request, this.dataAsArray().push(this.id))
  }

  // Crée la tâche dans la table
  async create(){
    let request = "INSERT INTO tasks (projet_id, content, priority, expected_at, done_at, updated_at, created_at, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    let values = this.dataAsArray()
    // On ajoute la date de création et l'identifiant unique de la tâche
    this.id = this.constructor.newId()
    values.push(new Date(), this.id)
    // console.log("Création de la tâche avec request et values :", request, values)
    await MySql2.execute(request, values)
  }

  dataAsArray(){
    const now = new Date()
    return [
      this.projet_id,
      this.content,
      this.priority,
      this.expected_at,
      this.done_at,
      now // updated_at, toujours
    ]
  }

  /**
    |
    | Propriétés
    |
  **/
  get id()            {return this.data.id}
  set id(v)           {this.data.id = v}
  get projet_id()     {return this.data.projet_id}
  set projet_id(v)    {this.data.projet_id = v}
  get content()       {return this.data.content}
  set content(v)      {this.data.content = v}
  get priority()      {return this.data.priority}
  set priority(v)     {this.data.priority=v}
  get expected_at()   {return this.data.expected_at}
  set expected_at(v)  {this.data.expected_at = v}
  get done_at()       {return this.data.done_at}
  set done_at(v)      {this.data.done_at = v}
}
