'use strict'
/**
  Gestion des tables de la base de données "lois_narration"
**/
const DB = {
  prepareTables(){
    this.tableProjets     = new DBTable('projets')
    this.tableCategories  = new DBTable('categories')
    this.tableAuteurs     = new DBTable('auteurs')
    this.tableKeywords    = new DBTable('keywords')
  }
}

class DBTable {
  constructor(name){
    this.name = name // nom de la table
  }
  /**
    Schéma de la table, pour information
  **/
  get schema(){
    // Note : on pourra le récupérer dans first-required/app/dbtables
  }
}
