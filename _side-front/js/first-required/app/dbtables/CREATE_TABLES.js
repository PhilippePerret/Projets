'use strict'

const PROJET_DB = {

  /**
    La table qui tient à jour les mots clés
  **/
  create_table_projets(){
    var request = `CREATE TABLE IF NOT EXISTS projets (
      id INT PRIMARY KEY AUTO_INCREMENT,
      categorie_id  TINYINT UNSIGNED NOT NULL,
      FOREIGN KEY (categorie_id) REFERENCES categorie(id),
      description TEXT NOT NULL,
      folder VARCHAR(255) DEFAULT NULL,
      file   VARCHAR(255) DEFAULT NULL,
      expected_at   DATE,
      created_at    DATE,
      updated_at    DATE
) AUTO_INCREMENT=1 ;`
    MySql2.execute(request)
  }
  /**
    Table des thèmes (par exemple "Personnage", "Structure", etc.)
  **/
, create_table_categories(){
    // var request = `CREATE TABLE IF NOT EXISTS themes (
    var request = `CREATE TABLE themes (
      id        TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name      VARCHAR(100)  UNIQUE NOT NULL,
      created_at    DATE,
      updated_at    DATE
) AUTO_INCREMENT=1 ;`
    MySql2.execute(request)
  }

/**
  Pour créer les tables, la première fois

  ATTENTION : cela supprimer toutes les données existantes, s'il y en a
**/
, CreateTables(){
  // MySql2.execute("DROP TABLE IF EXISTS projets;")
  // this.create_table_projets()
  // MySql2.execute("DROP TABLE IF EXISTS categories;")
  // this.create_table_categories()
}

}// /PROJET_DB

// Décommenter cette ligne pour créer les tables
// (il faut aussi décommenter ci-dessus dans la fonction)
// PROJET_DB.CreateTables()
