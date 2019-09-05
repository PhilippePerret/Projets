'use strict'

// Fréquence de confirmation de la confirmation du travail sur le projet
// lancé.
// TODO Pouvoir définir cette durée dans les préférences de l'application.
const RAPPEL_FREQUENCE = 3600

/**
  Class WorkingTime
  -----------------
  Classe permettant de gérer le temps de travail sur le projet.

  Principe :
    Dès qu'on ouvre un projet, ou qu'on clique sur le bouton indiquant
    qu'on va travailler dessus, un chrono se met en route (en fait, on
    conserve simplement la date de départ) pour compter le temps de travail
    sur le projet ouvert. À la fin, quand on quitte ou quand on clique sur
    le bouton pour arrêter le chronomètre, l'application demande s'il faut
    ajouter le temps de travail au projet.
**/
class WorkingTime {

  /**
    |
    | INSTANCE
    |
    | Elle sert pour définir la valeur 'chrono' du projet
    |
  **/
  constructor(projet){
    this.projet = projet
  }

  init(){
    this.reset()
  }

  reset() {
    const my = this
    my.duration = 0
    my.ichrono  = 0
    my.projet.timer.removeClass('visible')
  }

  start(){
    const my = this
    my.reset()
    this.startTimer()
    my.projet.timer.addClass('visible')
    my.running = true
  }
  startTimer(){
    const my = this
    my.startedAt = Number(new Date())
    my.timerChrono  = setInterval(my.playChrono.bind(my), 300)
  }
  clearTimer(){
    const my = this
    clearInterval(my.timerChrono)
    delete my.timerChrono
  }
  stop(){
    const my = this
    my.running = false
    my.clearTimer()
    my.addDuration()
    my.projet.chronometre.text('⏱')
    if ( confirm("Dois-je ajouter ce temps de travail au projet ?") ) {
      my.projet.addWorkingTime(parseInt(my.duration/1000))
    } else {
      this.reset()
    }
  }
  addDuration(){
    const my = this
    my.duration += Number(new Date()) - this.startedAt
  }

  playChrono(){
    ++ this.ichrono
    this.ichrono < 6 || (this.ichrono = 0)
    this.projet.chronometre.text(this.roto(this.ichrono))
    let laps = (Number(new Date()) - this.startedAt)/1000
    var d = this.s2h(parseInt(laps,10))
    this.projet.timer.text(d)
    // Toutes les heures (ou RAPPEL_FREQUENCE), l'utilisateur doit confirmer
    // qu'il travaille encore sur le projet
    if ( laps > RAPPEL_FREQUENCE ){
      const my = this
      my.clearTimer()
      my.addDuration()
      alert(`Merci de confirmer que vous traillez bien encore sur le projet « ${my.projet.name} ».\n\nPour le confirmer, vous avez juste à cliquer « OK » et poursuivre. Sinon, cliquez sur le chronomètre pour mettre fin au travail.`)
      my.startTimer()
    }
  }

  // Prend un nombre de millisecondes et retourne l'horloge
  s2h(s){
    var h = Math.floor(s / 3600)
    s = s - h*3600
    var m = Math.floor(s / 60)
    m = `${m}`.padStart(2,'0')
    s = s - m*60
    s = `${s}`.padStart(2,'0')
    return `${h}:${m}:${s}`
  }
  roto(i){
    return ['🕐','🕒','🕔','🕖','🕘','🕚'][i]
  }

}
