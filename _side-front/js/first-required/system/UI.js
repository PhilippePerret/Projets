'use strict'

const UI = {

  init(){
    this.middleColumn.append(Dom.createDiv({id:'tdm'}))
    this.leftColumn.append(Dom.createDiv({id:'book', class:'asbook'}))
    this.setDimensions()


    // // Pour remplir le book pour essai (jusqu'à ce qu'il y ait suffisamment
    // // de données)
    // for ( var i = 0 ; i < 100 ; ++ i ){
    //   this.book.append(Dom.createDiv({text:`La ligne d'index ${i}`}))
    // }

  }

, hideBook(){
    this.book.style.display = 'none'
  }
, showBook(){
    this.book.style.display = 'block'
  }

, setDimensions(){
    const my = this
        , hwindow = window.innerHeight
        , hheader = UI.header.offsetHeight
        , hfooter = UI.footer.offsetHeight
        , innerHeight = `${hwindow - (hheader + hfooter)}px`
    my.book.style.maxHeight = innerHeight
    my.book.style.height = innerHeight
  }

  /**
    Rend visible l'élément +o+ {HTMLElement} dans son parent
  **/
, rendVisible(o) {
    let parent = o.parentNode

    let pBounds = parent.getBoundingClientRect()
      , parentStyle = window.getComputedStyle(parent)
      , oneTiers = pBounds.height / 3
      , twoTiers = 2 * oneTiers

    var h = {
          pBounds: pBounds
        , pHeight: pBounds.height
        , pBorderTop: parseInt(parentStyle['borderTopWidth'],10)
        , pPaddingTop: parseInt(parentStyle['paddingTop'],10)
        , oneTiers: oneTiers
        , twoTiers: twoTiers
    }
    h.soust = h.pBorderTop + h.pPaddingTop

    let oBounds = o.getBoundingClientRect()

    // let oTop =  oBounds.top - (pBounds.top + soust)
    let oTop    = o.offsetTop - h.soust
      , pScroll = parent.scrollTop
      , oSpace  = {from:oTop, to: oTop + oBounds.height}
      , pSpace  = {from:pScroll, to:h.pHeight + pScroll}

    // console.log({
    //   oBounds: oBounds
    // , hdata: h
    // , oSpace: oSpace
    // , pSpace: pSpace
    // })

    if ( oSpace.from < pSpace.from || oSpace.to > pSpace.to ) {
      var tscrol
      if ( oSpace.from < pSpace.from ) {
      //   // <= On est en train de monter et l'item se trouve au-dessus
      //   // => Il faut placer l'item en bas
      //   tscroll = oSpace.from + pBounds.height - oBounds.height
      tscrol = Math.round(oSpace.from - h.twoTiers)
      } else {
      //   // <= On est en train de descendre et l'item se trouve en dessous
      //   // => Il faut placer l'item en haut
      //   tscroll = oSpace.from
      tscrol = Math.round(oSpace.from - h.oneTiers)
      }
      // console.log("L'item est en dehors, il faut le replacer. Scroll appliqué :", tscrol)
      // parent.scrollTo(0, tscrol)
      parent.scroll({top: tscrol, behavior:'smooth'})
    }
  }


}
Object.defineProperties(UI,{
  body:{get(){return document.querySelector('body')}}
, header:{get(){return document.querySelector('section#header')}}
, footer:{get(){return document.querySelector('section#footer')}}
, book:{get(){return this.leftColumn.querySelector('div#book')}}
, rightColumn:  {get(){return document.querySelector('section#right-column')}}
, middleColumn: {get(){return document.querySelector('section#middle-column')}}
, tdm: {get(){return document.querySelector('section#middle-column div#tdm')}}
, leftColumn:   {get(){return document.querySelector('section#left-column')}}
})
