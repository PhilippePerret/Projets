'use strict'

const App = {
  getProductName(){
    return this.data.productName || this.data.name
  }
, version(){
    return this.data.version
  }

, get data(){
    if (undefined === this._data){
      this._data = require(path.join(app.getPath(),'package.json'))
    }
    return this._data
  }
}
