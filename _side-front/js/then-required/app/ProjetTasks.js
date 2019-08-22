'use strict'

/**
  Gestion de l'ensemble des tâches d'un projet
**/
class ProjetTasks {

  /**
    Retourne la tâche d'identifiant +tid+
  **/
  static get(tid){return this.items[tid]}

  /**
    Chargement de toutes les tâches, et répartition dans leur projet
    respectif
  **/
  static async loadAll(){
    let tasks = await MySql2.execute("SELECT * FROM tasks WHERE done_at IS NULL")
    this.all = []
    this.items = {}
    Task.lastId = 0
    tasks.forEach( dataTask => {
      var task = new Task(dataTask)
      Projet.get(task.projet_id).tasks.add(task)
      this.all.push(task)
      Object.assign(this.items, {[task.id]: task})
      if ( task.id > Task.lastId ) Task.lastId = task.id
    })
  }
  /**
    |
    | INSTANCE
    |
  **/
  constructor(projet){
    this.projet = projet
    this.items  = []
  }
  // Ajout d'une tâche (appelée par exemple au chargement)
  add(task){
    this.items.push(task)
  }

  // Classement des tâches par priorité, avant leur affichage par exemple
  sort(){
    this.items.sort(function(t1,t2){return (t1.priority > t2.priority) ? 1 : -1})
  }

  // Construction de la liste de tâches à afficher dans la carte
  domList(){
    this.sort()
    let ul = Dom.create('UL',{class:'task-list', id:`task-list-${this.projet.id}`})
    this.items.forEach(task => {
      var li = Dom.create('LI',{id:`task-${task.id}`,'data-id':task.id})
      li.append(Dom.createSpan({text:task.content}))
      ul.append(li)
    })
    return ul
  }

  // Pour actualiser la liste des tâches dans la carte
  updateList(){
    $(`ul#task-list-${this.projet.id}`).replaceWith(this.domList().outerHTML)
  }

  // Création de la tâche
  // Appelée quand on clique sur le bouton "Enregistrer la tâche" dans le
  // formulaire
  async create(form){
    let data = {
        projet_id:    parseInt(this.getFormValue(form, 'projet_id'),10)
      , content:      this.getFormValue(form, 'content')
      , priority:     (this.getFormValue(form, 'priority')||'mmm').toLowerCase()
      , expected_at:  this.getFormValueAsDate(form, 'expected_at')
      , done_at:      this.getFormValueAsDate(form, 'done_at')
    }
    if ( data.projet_id != this.projet.id ) raise("Il y a un problème avec l'identifiant du projet… Je ne peux pas enregistrer la tâche.")
    const newTask = new Task(data)
    await newTask.create()
    this.add(newTask)
    this.updateList()
    form.remove()
    // alert(`La nouvelle tâche #${newTask.id} a été créé avec succès pour le projet #${newTask.projet_id}.`)
  }

  getFormValue(form, prop){
    let fieldName = `task-${prop}`
      , fieldObj  = form.find(`*[name="${fieldName}"]`)
      , value = fieldObj.val().trim()
    if ( value === '' ) value = null
    return value
  }
  getFormValueAsDate(form,prop){
    var value = this.getFormValue(form, prop)
    value && ( value = new Date(value) )
    return value
  }
  // Actualisation de la tâche
  update(){

  }

}
