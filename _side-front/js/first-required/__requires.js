'use strict'

const path      = require('path')
    , fs        = require('fs')
const glob      = require('glob')
const {app}     = require('electron').remote
const exec      = require('child_process').execSync
const { clipboard } = require('electron')
const remote = require('electron').remote
const Dialog = remote.dialog


window.onerror = function(err, url, line){
  alert("Une erreur est survenue : " + err + "\n\nConsulter la console (ALT+CMD+i) pour le détail.")
  console.log("# ERREUR :", err, url, line)
}
