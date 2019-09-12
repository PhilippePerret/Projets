'use strict';

Object.assign(UI,{
    nameApp: 'extension de UI pour l’application'

    // Méthode qui surclasse la méthode originale de UI
  , init(){
    this.leftColumn.append(Dom.createDiv({id:'current_projets', class:'projets-list'}))
    this.leftColumn.append(Dom.createDiv({id:'next_projets', class:'projets-list'}))
    this.leftColumn.append(Dom.createDiv({id:'futur_projets', class:'projets-list'}))
    this.middleColumn.append(Dom.createDiv({id:'wait_projets', class:'projets-list'}))
    this.middleColumn.append(Dom.createDiv({id:'givenup_projets', class:'projets-list'}))
    this.middleColumn.append(Dom.createDiv({id:'done_projets', class:'projets-list'}))
    this.setDimensions()

    this.currentProjetsList = UI.leftColumn.querySelector('#current_projets')
    this.nextProjetsList    = UI.leftColumn.querySelector('#next_projets')
    this.futurProjetsList   = UI.leftColumn.querySelector('#futur_projets')
    this.waitProjetsList    = UI.middleColumn.querySelector('#wait_projets')
    this.doneProjetsList    = UI.middleColumn.querySelector('#done_projets')
    this.givenupProjetsList = UI.middleColumn.querySelector('#givenup_projets')

    this.observe()

    // // Pour remplir le book pour essai (jusqu'à ce qu'il y ait suffisamment
    // // de données)
    // for ( var i = 0 ; i < 100 ; ++ i ){
    //   this.book.append(Dom.createDiv({text:`La ligne d'index ${i}`}))
    // }

  }

})
