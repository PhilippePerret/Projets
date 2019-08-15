'use strict'


const App = {
  async init(){
    UI.init()
    await Projet.init()
  }
}

const Sys = {
}

document.addEventListener('DOMContentLoaded', function(event) {
  App.init.call(App)
})
