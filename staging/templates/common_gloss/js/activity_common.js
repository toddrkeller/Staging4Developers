String.prototype.L_Trim  = new Function( "return this.replace(/^\\s+/,'')"  )
String.prototype.R_Trim  = new Function( "return this.replace(/\\s+$/,'')"  )
String.prototype.Trim    = new Function( "return this.L_Trim().R_Trim()"    )
var gv_server = false

function xid( a )
  {
  return window.document.getElementById( a )
  }
function spf( s, t )
  {
  var n=0
  function F()
    {
    return t[n++]
    }
  return s.replace(/~/g, F)
  }
function globalize_id(_name)
  {
  window[_name] = xid(_name)
  }
function IE()
  {
  var a = navigator.userAgent.toLowerCase()
  return a.indexOf("msie") != -1
  }

function w_tool()
  {
  function F()
    {
    var wr = ''
    function ws()
      {
      wr += ''.concat.apply('', arguments)
      }
    function wl()
      {
      wr += ''.concat.apply('', arguments) + '\r\n'
      }
    function w_get_str()
      {
      return wr
      }
    function w_init_str()
      {
      wr = ''
      }
    function wx( A, B )
      {
      wl( spf(A, B) )
      }
    }
  var S = F.toString()
  S = S.substr(S.indexOf('{')+1)
  S = S.substr(0,S.lastIndexOf('}'))
  return S
  }
function classify( the_node, the_name, the_class )
  {
  the_class = ' ' + the_class + ' '
  var r = []
  var a = the_node.getElementsByTagName(the_name)
  for (var i=0, L=a.length; i<L; i++)
    {
    var b = a[i]
    var c = ' ' + b.className + ' '
    if (c.indexOf(the_class) >= 0)
      r.push(b)
    }
  return r
  }

function set_global_var( name, val )
  {
  eval( 'window[name] = val' )
  }

function foundation_gif_btn_class( the_id )
  {
  var _this = this
  var e = xid(the_id)
  if (e)
    {
    var a = e.src+''
    var b = a.substr(0, a.length-4) + '_on.gif'
    if (document.images)
      new Image().src = b
    e.onclick = function()
      {
      _this.do_click()
      }
    e.onmouseover = function()
      {
      this.src= b
      }
    e.onmouseout = function()
      {
      this.src= a
      }
    this.do_click = function()
      {
      }
    }
  }
function foundation_hat_class()
  {
  var d = {ff: [], count:0}
  this.get_d = function()
    {
    return d
    }
  this.inhat  = function(n)
    {
    return d.ff[n]
    }
  this.remove = function(n)
    {
    if (d.ff[n])
      {
      d.ff[n] = false
      count--
      }
    }
  this.size = function()
    {
    return d.count
    }
  this.fill   = function(n)
    {
    d.ff = []
    for (var i=0; i<n; i++)
      d.ff[i] = true
    d.count = n
    }
  this.get = function()
    {
    var n, k, r
    r = d.count
    if (r > 0)
      {
      n = Math.ceil(Math.random()*r)
      r = k = 0
      do
        if (d.ff[r++])
          k++
      while (k < n)
        d.ff[r-1] = false
      d.count--
      }
    return r-1
    }
  }//foundation_hat_class

var w0
var w1
var w2
var w3

function popup_class()
  {
  var _this     = this
  ////var imageDir  = '../../IMG/'
  var imageDir  = '../../../../templates/common_gloss/IMG/'
  var theID     = 0
  var ie        = document.all && !window.opera
  var tjx       = []
  var PWX       = {}
  _this.resizable = true

  function xid(a)
    {
    return document.getElementById(a)
    }
  function spf(s, t)
    {
    var n=0
    function F()
      {
      return t[n++]
      }
    return s.replace(/~/g, F)
    }
  function px(A)
    {
    return A + 'px'
    }
  function IntI(a)
    {
    return parseInt(a)||0
    }
  this.registerChild = function(the_id, the_win)
    {
    var t = PWX[the_id]
    t.the_child_window = the_win
    t.onopen()
    return t
    }
  this.init = function(the_id,  af)
    {
    var wr = ''
    function ws()
      {
      for (var i=0, n=arguments.length; i<n; i++)
        wr += arguments[i]
      }
    function wl()
      {
      ws.apply(this, arguments)
      ws(String.fromCharCode(13, 10))
      }
    if (!xid('id_popup_wrapper'))
      {
      var e = document.createElement('div')
      e.id = 'id_popup_wrapper'
      e.innerHTML = '<span style="display:none">&nbsp;<\/span>'
      document.body.appendChild(e)
      }
    var e = document.createElement('div')
    e.id = the_id


    ws('<div class="css_d-h_div" style="padding: 2px; text-indent: 3px; font: 90% Arial; color: white; background-color:  #69afe4; cursor: move; width: auto; overflow : hidden;z-index:100;text-align:left;">')
    ws('<span><\/span>')
    ws('<div class="css_d-controls" style="position: absolute; right: 4px; top: 2px; cursor: pointer;">')
    ws('<img src="', imageDir, 'printer.gif"  title="Printer" \/>&nbsp;')
    ws('<img src="', imageDir, 'minimize.gif" title="Minim" \/>&nbsp;')
    ws('<img src="', imageDir, 'close.gif"    title="Close" \/>')
    ws('<\/div><\/div>')
    ws('<div class="css_d-content_div" style="background-color: #f7f7f7; padding: 4px; text-indent: 0px; font: 90% Arial; overflow: auto;z-index:100;"><\/div>')
    if(af)
      {
      ws('<div id="vir_id_mediaPlayerHolder" style="height:29px; width:100%; border-right: solid black 1px; background-color: #f7f7f7; display:none;"><\/div>')
      ws('<div id="vir_id_videoPlayerHolder" style="height:232px; width:270px; border-right: solid black 1px; background-color: #f7f7f7; display:none;"><\/div>')
      }    ws('<div id="stat" class="css_d-status_div" style="border-top: solid gray 1px; background-color: #F8F8F8; height: 13px;"><div class="css_d-resizer" style="float: right; width : 13px; height: 13px; cursor: nw-resize; font-size: 0; background: transparent url(', imageDir, 'resize.gif) top right no-repeat;"><\/div>')
    wl('<\/div>')
    e.innerHTML = wr
    xid('id_popup_wrapper').appendChild(e)
    this.z = this.z ? this.z++ : 10//z-index
    var t = xid(the_id)
    t.style.cssText = 'position: absolute; border-left: 2px solid #ffffff; border-top: 2px solid #ffffff; border-right: 1px solid #000000; border-bottom: 1px solid #000000; visibility: hidden; background-color: white;'
    var d = t.getElementsByTagName('div')
    for (var i=0; i<d.length; i++)
      if (/css_d-/.test(d[i].className))
        t[d[i].className.replace(/css_d-/, '')] = d[i]
    t.style.zIndex = this.z
    t.h_div._parent = t
    t.controls._parent = t
    t.resizer._parent = t
    t.onopen = function()
      {
      return true
      }
    t.onclose = function()
      {
      return true
      }
    t.onmousedown = function()
      {
      _this.z++
      this.style.zIndex = _this.z
      }
    t.minimize = function()                                          // the whole minimization business // MG
      {
      var divs = []
      for(var ii=0; ii<this.childNodes.length; ii++)
        {
        if(this.childNodes[ii].nodeType == 1)
          divs.push(ii)
        }
      for(var kk=0, ll=divs.length; kk<ll; kk++)                     // the battle to keep the invisible status bars as they are // MG
        {
        if( (this.childNodes[kk].nodeName == 'DIV')&&(this.childNodes[kk].style.display == "block") )
          this.childNodes[kk].style.display = "none"
        else if( ( t.resizable != false ) && (this.childNodes[kk].nodeName == 'DIV') && (this.childNodes[kk].style.display == "none") )
          this.childNodes[kk].style.display = "block"
        else if( ( t.resizable == false ) && (this.childNodes[kk].nodeName == 'DIV') && (this.childNodes[kk].style.display == "none") )
          {
          if(kk < ll-1)
            this.childNodes[kk].style.display = "block"
          }
        }
      }
    t.lock = function( L )                                           // to lock the window so it can't be dragged //MG
      {
      var yn = L.src.indexOf('unlocked') > -1 ? L.src.replace(/un(locked)(.*)(\.gif)$/,"$1$2$3") : L.src.replace(/(locked)(.*)(\.gif)$/,"un$1$2$3")
      L.src = yn
      if( yn.indexOf('unlocked') == -1 )
        this.h_div.onmousedown = function()
          {
          return true
          }
      else
        this.h_div.onmousedown = t.resizer.onmousedown
      }
    t.printout = function()
      {
      var wp = print_manager.getPrintWindow()
      var txt = this.getElementsByTagName("DIV")[2].innerHTML        //alternatively, we could name the DIV but I was lazy // MG
      wp.xid('id_out').innerHTML = txt
      wp.focus()                                                     // if not given focus, it'll print the top win // MG
      wp.print()
      }
    t.h_div.onmousedown = t.resizer.onmousedown = function(e)
      {
      dragging = true
      var d = _this
      var t = this._parent
      t.style.filter = 'alpha(opacity=50)'
      t.style.opacity = 0.5
      d.etarget = this
      var e = window.event || e
      d.initmousex = e.clientX
      d.initmousey = e.clientY
      d.initx = IntI(t.offsetLeft)
      d.inity = IntI(t.offsetTop)
      d.width = IntI(t.offsetWidth)
      d.contentheight = IntI(t.content_div.offsetHeight)
      document.onmousemove = function(e)
        {
        var d = _this
        var etarget = d.etarget
        var e = window.event || e
        d.d_x = e.clientX-d.initmousex
        d.d_y = e.clientY-d.initmousey
        if ( (etarget.className=='css_d-h_div') && dragging )
          d.move(etarget._parent)
        else if (etarget.className=='css_d-resizer')
          d.resize(etarget._parent, e)
        return false
        }
      document.onmouseup = function ceeze()        // named the function to call it from elsewhere //MG
        {
        dragging = false                           // added a variable to make DIVs draggable or docked //MG
        _this.etarget = null
        document.onmousemove = document.onmouseup = null
        document.onmouseover = document.onmouseout = null
        t.style.filter = 'alpha(opacity=100)'
        t.style.opacity = 1.0
        }
      t.onmouseout = function(e)                   // This entire function to
        {                                          // drop the window if the mouse exits the DIV and is about to mouseout the window
        var e = window.event || e                  //
        if( e.clientX < 40 || e.clientY < 20 )     // when approaching left & top egdes of the window
          ceeze()                                  // do the same as mouseup
        }                                          //
      return false                                 //
      }                                            //   MG & BL
    t.controls.onclick = function(e)
      {
      var d = _this
      var sourceobj = window.event ? window.event.srcElement : e.target
      if (/Close/i.test(sourceobj.getAttribute('title')))
        d.close(this._parent)
      else if (/Minim/i.test(sourceobj.getAttribute('title')))
        this._parent.minimize()
      else if (/Lock/i.test(sourceobj.getAttribute('title')))
        this._parent.lock( sourceobj )
      else if (/Printer/i.test(sourceobj.getAttribute('title')))
        this._parent.printout()
      return false
      }
    t.controls.onmouseover = function(e)
      {
      var d = _this
      var sourceobj = window.event ? window.event.srcElement : e.target
      if (/Close|Minim|Lock|Printer/i.test(sourceobj.getAttribute('title')))
        sourceobj.src = sourceobj.src.toString().replace(/(\.gif)/,"_on$1")
      return false
      }
    t.controls.onmouseout = function(e)
      {
      var d = _this
      var sourceobj = window.event ? window.event.srcElement : e.target
      if (/Close|Minim|Lock|Printer/i.test(sourceobj.getAttribute('title')))
        sourceobj.src = sourceobj.src.toString().replace(/_on(\.gif)/,"$1")
      return false
      }
    t.moveTo = function(x, y)
      {
      _this.moveTo(this, x, y)
      }
    t.show = function()
      {
      _this.show(this)
      }
    t.hide = function()
      {
      _this.close(this)
      }
    t.setHTML = function(HTML)
      {
      _this.setHTML(this, HTML)
      }
    t.setSize = function(w, h)
      {
      _this.setSize(this, w, h)
      }
    t.setResize = function(b)
      {
      _this.setResize(this, b)
      }
    t.setTitle = function(t, RTL)
      {
      _this.setTitle(this, t, RTL)
      }
    tjx.push(t)
    return t
    }
  this.move = function(t)
    {
    t.style.left = px(Math.max(10, this.d_x+this.initx))
    t.style.top  = px(Math.max(10, this.d_y+this.inity))
    }
  this.open = function(S)
    {
    var t = this.init(theID, S.aud)
    t.setSize(S.width, S.height)
    t.moveTo(S.x, S.y)
    t.setResize(S.resize != false ? true : false)
    t.style.visibility = 'visible'
    t.style.display = 'block'
    t.content_div.style.display = 'block'
    t.content_div.style.overflow = 'auto'
    var v = '&nbsp;'
    t.content_div.innerHTML = v
    var u = '_id_pop_win_' + t.id
    PWX[u] = t
    if (ie)
      {
      var a = xid('id_popup_wrapper').getElementsByTagName('*')
      for (var i=0, L=a.length; i<L; i++)
        a[i].unselectable = 'on'
      }
    theID++
    return t
    }
  this.setHTML = function(t, HTML)
    {
    t.content_div.innerHTML = HTML
    }
  this.setSize = function(t, w, h)
    {
    t.style.width              = px(Math.max(IntI(w), 150))
    t.content_div.style.height = px(Math.max(IntI(h), 0))
    }
  this.moveTo = function(t, x, y)
    {
    this.update_pos()
    t.style.left = px(this.scroll_left + IntI(x))
    t.style.top  = px(this.scroll_top  + IntI(y))
    }
  this.setResize = function(t, b)
    {
    if(!b)
      t.resizable = false
    t.status_div.style.display = b ? 'block' : 'none'
    }
  this.setTitle = function(t, title, RTL)
    {
    t.h_div.firstChild.innerHTML = title
    if (RTL)
      {
      var s = t.h_div.style
      //t.h_div.dir = 'rtl' --- turned off because screws up buttons in the title bar //MG
      s.paddingLeft = '5px'
      s.textAlign = 'left'
      }
    }
  this.update_pos = function()
    { 
    var domclientWidth = document.documentElement && IntI(document.documentElement.clientWidth) || 99999
    this.standardbody  = document.compatMode=='CSS1Compat' ? document.documentElement : document.body
    this.scroll_top  = ie ? this.standardbody.scrollTop    : window.pageYOffset
    this.scroll_left = ie ? this.standardbody.scrollLeft   : window.pageXOffset
    this.docwidth    = ie ? this.standardbody.clientWidth  : /Safari/i.test(navigator.userAgent) ? window.innerWidth : Math.min(domclientWidth, window.innerWidth-16)
    this.docheight   = ie ? this.standardbody.clientHeight : window.innerHeight
    }
  this.resize = function(t, e)
    {
    t.style.width = px(Math.max(this.width+this.d_x, 150))
    t.content_div.style.height = px(Math.max(this.contentheight+this.d_y, 100))
    }
  this.close = function(t)
    {
    try
      {
      if(t==w2)
        {
        var myCheck = confirm ("Are you sure to close the popup window?")
        if(myCheck)
          var b = t.onclose()
        }
      else
        var b = t.onclose()
      }
    catch(e)
      {
      //alert(e)
      var b = true
      }
    if (b)
      {
      this.update_pos()
      t.lastx = IntI((t.style.left || t.offsetLeft))-this.scroll_left
      t.lasty = IntI((t.style.top || t.offsetTop))-this.scroll_top
      t.lastwidth = t.style.width
      t.style.display = 'none'
      }
    return b
    }
  this.show = function(t)
    {
    if (t.lastx)
      {
      this.update_pos()
      t.state = ''
      t.content_div.style.display = 'block'
      t.status_div.style.display = 'block'
      var s = t.style
      s.display = 'block'
      s.left = px(IntI(t.lastx)+_this.scroll_left)
      s.top =  px(IntI(t.lasty)+_this.scroll_top)
      s.width = px(IntI(t.lastwidth))
      }
    else
      t.style.display = 'block'
    t.state = ''
    }
  this.allDone = function()
    {
    var A = tjx
    for (var i=0; i<A.length; i++)
      A[i].h_div._parent = A[i].resizer._parent = A[i].controls._parent = null
    }
  }//popup_class


function PopUp(fb, usg, audio, dh, dw, B, L,loname)       //revised 10/19/2007 : added 'B for auto start or not'     added L: 02/26/2009 for adjusting main text length of Click_N_Compare template
  {
  function AA()
    {
    var myTitle = usg ? usg : 'Feedback'
    w0.setTitle( myTitle )
    var fbs = fb.toString().replace(/(<div\s+.*\s*id\s*=\s*["']*)(\w*_*\w*)(["']*)/ig, "$1vir_$2$3" )
    w0.setHTML( fbs )
    if(audio)
      {
      xid('vir_id_mediaPlayerHolder').style.display = 'block'
      xid('vir_id_mediaPlayerHolder').style.zIndex = 97
      IHTML(xid('vir_id_mediaPlayerHolder'), HTML_mp3_player_1 (audio, B, loname))
      ////audio_play_file(removeFileExt(audio), loname, false)
      }
    }
  if( w0 )
    {
    while (w0.firstChild)
      w0.removeChild(w0.firstChild)
    pop_manager.close(w0)
    }
  var af = (audio != undefined) ? true : false
  if(L == 'Longest')
     w0 = pop_manager.open({x: 60, y: 120, width: 500, height: 480, aud: af})
  else if(L == 'Longer')
     w0 = pop_manager.open({x: 60, y: 120, width: 500, height: 380, aud: af})
  else
     w0 = pop_manager.open({x: 60, y: 120, width: 500, height: 280, aud: af})
  AA()
  }//PopUp

function PopUp2(fb, usg, audio, dh, dw, B, loname)
  {
  function AA()
    {
    var myTitle = usg ? usg : 'Feedback'
    w1.setTitle( myTitle )
    var fbs = fb.toString().replace(/(<div\s+.*\s*id\s*=\s*["']*)(\w*_*\w*)(["']*)/ig, "$1vir_$2$3" )
    w1.setHTML( fbs )
    if(audio)
      {
      xid('vir_id_mediaPlayerHolder').style.display = 'block'
      xid('vir_id_mediaPlayerHolder').style.zIndex = 97
      IHTML(xid('vir_id_mediaPlayerHolder'), HTML_mp3_player_1 (audio, B, loname))
      }
    }
  if( w1 )
    {
    while (w1.firstChild)
      w1.removeChild(w1.firstChild)
    pop_manager.close(w1)
    }
  var af = (audio != undefined) ? true : false
  w1 = pop_manager.open({x: 330, y: 10, width: 500, height: 250, aud: af})
  AA()
  }//PopUp2

function PopUp3(fb, usg, audio, dh, dw, B, loname)
  {
  function AA()
    {
    var myTitle = usg ? usg : 'Feedback'
    w2.setTitle( myTitle )
    var fbs = fb.toString().replace(/(<div\s+.*\s*id\s*=\s*["']*)(\w*_*\w*)(["']*)/ig, "$1vir_$2$3" )

    w2.setHTML( fbs )
    if(audio)
      {
      xid('vir_id_mediaPlayerHolder').style.display = 'block'
      xid('vir_id_mediaPlayerHolder').style.zIndex = 97
      IHTML(xid('vir_id_mediaPlayerHolder'), HTML_mp3_player_1 (audio, B, loname))
      }
    }
  if( w2 )
    {
    while (w2.firstChild)
      w2.removeChild(w2.firstChild)
    pop_manager.close(w2)
    }
  var af = (audio != undefined) ? true : false
  w2 = pop_manager.open({x: 60, y: 120, width: 500, height: 280, aud: af})
  AA()
  }//PopUp3
  
function PopUp4(fb, usg, audio, dh, dw, loname)       //Added 02/18/2010  for video popups of E_CO_Lesson_Source
  {
  function AA()
    {
    var myTitle = usg ? usg : 'Feedback'
    w3.setTitle( myTitle )
    var fbs = fb.toString().replace(/(<div\s+.*\s*id\s*=\s*["']*)(\w*_*\w*)(["']*)/ig, "$1vir_$2$3" )

    w3.setHTML( fbs )
    if(audio)
      {
      xid('vir_id_videoPlayerHolder').style.display = 'block'
      xid('vir_id_videoPlayerHolder').style.zIndex = 97
      xid('vir_id_videoPlayerHolder').innerHTML = HTML_vid_player_1(audio, false, loname)     //true means "left-magin is 0"
      }
    }
  if( w3 )
    {
    while (w3.firstChild)
      w3.removeChild(w3.firstChild)
    pop_manager.close(w3)
    }    

  var af = (audio != undefined) ? true : false
  w3 = pop_manager.open({x: 60, y: 120, width: 270, height: 0, aud: af}, true)    //added true 02/18/2010  for video size
  AA()

  }//PopUp4


var g_ie = window.ActiveXObject ? true: false;
function HTML_vid_player_1( FN, TF, LOname)
  {
  var fldn = LOname
  var mURL = '../../media/' +  fldn   + 'mp4/' + FN
  eval(w_tool())
  if(TF)
    wl('<video width="270"  height="232" controls="controls" autoplay="autoplay">')
  else
    wl('<video width="270"  height="232" controls="controls">')
    wl('<source src="' + mURL +'" type="video/mp4">')
/*
  var vidType = document.createElement('video')
  if(vidType.canPlayType('video/mp4') == "true" || vidType.canPlayType('video/mp4') == "maybe" )
    {
     var mURL = '../../media/' +  fldn   + '/audio/' + sFN + '.mp4'
     wl('<source src="' + mURL +'" type="video/mp4">')
    }
  if(vidType.canPlayType('video/ogg') == "true" || vidType.canPlayType('video/ogg') == "maybe" )
    {
     var mURL = '../../media/' +  fldn   + '/audio/' + sFN + '.ogg'
     wl('<source src="' + mURL +'" type="video/ogg">')
    }
*/
  wl('</video>')
  return wr
  }


function HTML_mp3_player_1( FN, B, LOname )
  {
  var sFN  = removeFileExt(FN)
  var fldn = LOname
  ///var mURL = '../../media/' +  fldn   + '/audio/' + FN
  eval(w_tool())
  if(B)
    wl('<audio controls="controls" autoplay="autoplay">')
  else
    wl('<audio controls="controls">')

  var audType=document.getElementById('audioPlayer')
     if(g_ie==true)
       {
       var mURL = '../../media/' +  fldn   + 'mp3/' + FN
       wl('<source src="' + mURL +'">')
       }
    if(audType.canPlayType('audio/mpeg') == "true" || audType.canPlayType('audio/mpeg') == "maybe" )
      {
       var mURL = '../../media/' +  fldn   + 'mp3/' + sFN + '.mp3'
       wl('<source src="' + mURL +'" type="audio/mpeg">')
      }
    if(audType.canPlayType('audio/ogg') == "true" ||  audType.canPlayType('audio/ogg') == "maybe" )
       {
       var mURL = '../../media/' +  fldn   + 'ogg/' + sFN + '.ogg'
       wl('<source src="' + mURL +'">')
       }
  wl('</audio>')
  return wr
  }




function recordPlayer(LOname)
  {
  var fldn = LOname
  eval(w_tool())
  var S = '../../media/'+ fldn + '/mp3/recorder_win.swf'
  ws( '<object' )
  ws( ' type="application/x-shockwave-flash"' )
  ws( ' style="width: 215px; height: 140px;"' )
  wl( ' data="', S, '">' )
  wl( '   <param name="wmode" value="transparent">' )
  wl( '   <param name="movie" value="', S, '" \/>' )
  wl( '<\/object>' )
  return wr
  }

function get_comment()
  {
  var s = get_comment.caller.toString()
  return s.substring( s.indexOf('/*')+4, s.indexOf('*/') )
  }

function span_buttonize()
  {
  var TT = classify( window.document.body, 'span', 'css_span_btn' )
  var LL = TT.length
  for (var i=0; i<LL; i++)
    {
    var U = TT[i]
    U.onmouseover = function()
      {
      this.style.textDecoration = 'underline overline'
      }
    U.onmouseout = function()
      {
      this.style.textDecoration = 'none'
      }
    }
  }

function mk_topBar(LC)
  {
  eval(w_tool())
  if (LC)
    {
    wl( '    <div class="audioPlayer" id="id_mp3_player">' )
    wl( '    <\/div>' )
    }
  return wr
  }
function IHTML(E, STR)
  {
  E.innerHTML = STR
  }


function do_ie_fixup()
  {
  function ietruebody()
    {
    return (document.compatMode && document.compatMode != 'BackCompat') ? document.documentElement : document.body
    }
  if (g_ie)
    {
    var winwidth   = g_ie&&!window.opera ? ietruebody().clientWidth : window.innerWidth-20
    if (winwidth > 67)
      xid('id_ttable').style.width = (winwidth - 67) + 'px'
    }
  }


//***************  DLiLearn homework ******************//

String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}
