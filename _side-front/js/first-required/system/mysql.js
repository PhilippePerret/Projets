'use strict'

// const MYSQL = require('mysql')
// const MYSQL_DATA = require('../data/secret/mysql.js')

// const MYSQL = require('mysql2/promise')
// const bluebird = require('bluebird')
const MYSQL = require('mysql2')

// Données secrètes pour la connexion à la base MySql
const MYSQL_DATA = require('../data/secret/mysql.js').local

const MySql2 = {
  async execute(request, values, options){
    if ( undefined === this._pool ) {
      this._pool = await MYSQL.createPool({
        // host:'localhost', user: 'root', database: 'test', Promise: bluebird
          host     : MYSQL_DATA.host
        , user     : MYSQL_DATA.user
        , password : MYSQL_DATA.password
        , database : this.database
      });
    }
    if ( undefined === this._promisePool ) {
      this._promisePool = this._pool.promise()
    }
    const [rows, fields] = await this._promisePool.query(request, values)
    if ( options && (options.only_first||options.only_one||options.first) ){
      return rows[0]
    } else {
      return rows
    }
  }

, async count(table_name, filtre) {
    var request = `SELECT COUNT(*) FROM ${table_name}`
    if ( filtre ) request += ` WHERE ${filtre}`
    var res = await this.execute({sql:request, rowsAsArray:true})
    return res[0][0]
  }
, async lastInsertId(){
    var res = await this.execute({sql:"SELECT LAST_INSERT_ID()", rowsAsArray:true})
    var lii = res[0][0]
    if ( lii === 0 ) {
      lii = await this.lastInsertId()
    }
    return lii
  }
}
Object.defineProperties(MySql2,{
database:{
    get(){return this._database || MYSQL_DATA.database}
  , set(v){this._database = v}
  }
, defaultOptions:{
    get(){return this._defopts || (this._defopts = '0000000000000000')}
  }
})
