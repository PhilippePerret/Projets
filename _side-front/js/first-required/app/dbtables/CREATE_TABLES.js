'use strict'

const PROJET_DB = {

  /**
    La table qui tient à jour les mots clés
  **/
  create_table_projets(){
    var request = `CREATE TABLE IF NOT EXISTS projets (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      categorie  TINYINT UNSIGNED DEFAULT NULL,
      state VARCHAR(20) NOT NULL,
      description TEXT DEFAULT NULL,
      folder VARCHAR(255) DEFAULT NULL,
      open_in VARCHAR(20) DEFAULT 'finder',
      file   VARCHAR(255) DEFAULT NULL,
      working_time INT UNSIGNED DEFAULT 0,
      expected_at   DATE,
      started_at    DATE,
      finished_at   DATE,
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
    var request = `CREATE TABLE categories (
      id        TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name      VARCHAR(100)  UNIQUE NOT NULL,
      created_at    DATE,
      updated_at    DATE
) AUTO_INCREMENT=1 ;`
    MySql2.execute(request)
  }

, create_table_tasks(){
    // var request = `CREATE TABLE IF NOT EXISTS themes (
    var request = `CREATE TABLE tasks (
      id            TINYINT UNSIGNED PRIMARY KEY,
      projet_id     TINYINT UNSIGNED,
      content       TEXT NOT NULL,
      priority      CHAR(3) DEFAULT 'mmm',
      expected_at   DATE,
      done_at       DATE,
      created_at    DATE,
      updated_at    DATE
);`
    MySql2.execute(request)
  }

/**
  Pour créer les tables, la première fois

  ATTENTION : cela supprimer toutes les données existantes, s'il y en a
**/
, CreateTables(){
  // MySql2.execute("DROP TABLE IF EXISTS categories")
  // this.create_table_categories()
  // MySql2.execute("DROP TABLE IF EXISTS projets")
  // this.create_table_projets()
  MySql2.execute("DROP TABLE IF EXISTS tasks")
  this.create_table_tasks()
}

}// /PROJET_DB
