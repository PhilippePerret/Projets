'use strict'


const App = {
  async init(){
    UI.init()
    await Projet.init()
    $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
  }
}

const Sys = {
}

document.addEventListener('DOMContentLoaded', function(event) {
  App.init.call(App)
})
