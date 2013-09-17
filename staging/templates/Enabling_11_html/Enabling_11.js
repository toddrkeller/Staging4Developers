$(document).ready(function() {
//	audioInit();
	
	$('#feedback').hide();
	
	//Default values (for testing)
	if ( getPassedParameters() == false){
		mediaPath = "sampleData/";
	//	cssFilename = "styles/enabling_11_default.css";
		cssFilename = "styles/enabling_11_dlilearn.css";
		xmlFilename = mediaPath + "enabling11_noNamespaces.xml";
		jsonFilename = mediaPath + "enabling11_json.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		$('.activity_hd').html('');
	}
	loadjscssfile("../common/css/activityDefault.css", "css");
	cssFilename = "styles/enabling_11_dlilearn.css";
	//alert(xmlFilename)
	testVideoSupport();	
	loadActivity(parseXml);
	
});


var numItems;
var numItemsPerSet = 9;
var setItemCompleted = 0;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = 3; //Math.ceil(numItems/3);
	//alert(xml);
	//Randomize sets
	$(xml).find("item").shuffle()
	
	loadSet(0);
}

var numberItemsInSet;
var fbAry = []
function loadSet(value){
	currentSet = value;
	setCompletedShown = false;
	$("#clickGuard").css("display", "none");
	updateSetText();

	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	}
	//Set every div to the original state
	var sLen = $(".showResult").length;
	for (var i=0; i < sLen; i++){
		$($(".showResult")[i]).css('display', 'none');
		$($(".showResult")[i]).html('');
		$($(".playBtnDiv")[i]).css('display', 'block');
	}
	////Set videos to play	
	var startIndex = currentSet*numItemsPerSet
	for(var i = 0; i< 9; i++)
	{
		var file_video = $($(xml).find("file_video")[i]).text();
		file_video = file_video.substring(0, file_video.lastIndexOf("."));		
		var playVidStr = '<span id="oid_main_menu_' + i + '" class="css_menu" ><img  class="playBtnImg" id="playBtn' + i + '" onclick="vidBtnClicked(\'' + file_video + '\',' + i + ')" src="../common/img/btn_play_sm_off.png" border="0" onmouseover="turn_on(this)" onmouseout="turn_off(this)"></span>';
		//alert(playVidStr);
		$($(".playBtnDiv")[i]).html(playVidStr);
		var theAns = $($(xml).find("lang_en")[i]).text();
		var themenuChoices = hidden_menu(i);
		//alert(themenuChoices);
		var menuStr = spf('<table class="css_menu_table" cellspacing="0" cellpadding="5">~<caption style="display: none;">~</caption></table>',[themenuChoices,theAns]); 
		$($(".css_menu_def")[i]).html(menuStr);
	}	 
}
function turn_on(x){
	x.src = "../common/img/btn_play_sm_on.png"
}
function turn_off(x){
	x.src = "../common/img/btn_play_sm_off.png"
}
function hidden_menu(N){
	var hatA = new randomNumbers( numItems );
	var newAry = [];
	for(var i=0; i<5; i++){
		var a = hatA.get();
		if (a != N)
		  newAry.push(a);
	}
	newAry[4] = N;
	var hatB = new randomNumbers( 5 );
	var shuffledAry = [];
	for (var i=0; i<5; i++){
		var b = hatB.get();
		shuffledAry.push(newAry[b]);
	}
	var menuTRstr = '<tr class="menuTR"><td id="xyz~_~" class="menuTD"><div class="menuChoice">~</div></td></tr>';
	var choiceStr = ''
	for (var i=0;i<5; i++){
		var choiceTxt = $($(xml).find("lang_en")[shuffledAry[i]]).text();
		choiceStr += spf(menuTRstr, [N, i, choiceTxt])
	}
	var fbTxt = $($(xml).find("feedback_l1")[N]).text();
	choiceStr += '<tr class="fbTR"><td style="display: none;"><div class="fbDiv">' + fbTxt + '</div></td></tr>';
	return choiceStr
}

function vidBtnClicked(FN){
	var vidFN = FN;
	var vidContainer = "videoContainer0";
	$('#videoContainer0').html('');
	//	alert(vidFN);
	var vidTag = "videoTag0";
	loadVideo(mediaPath, vidFN, vidContainer, vidTag );
    xid(vidTag).play();
	new my_menu_class( 'gi_menus' ).init();
}

function foundation_menu_class( whoami )
  {
  //alert(whoami)
  eval( whoami + ' = this' )
  var ch_row           = null
  var ch_selected_row  = 0
  var color_hi         = 'Red'
  var color_bg         = 'Green'
  var m_timer          = null
  var e_src            = null
  var _this            = this
  var id_menu_box      = null

  function bool( a )
    {
    return a ? true : false
    }
  function IE()
    {
    var a = navigator.userAgent.toLowerCase()
    return a.indexOf("msie") != -1
    }

  function set_TR(a)
    {
    ch_row [ ch_selected_row ].style.backgroundColor  = color_bg
    ch_selected_row = a
    ch_row [ ch_selected_row ].style.backgroundColor  = color_hi
    }
  function timer_set( a )
    {
    timer_clear()
    m_timer = setTimeout( spf('~.timeout()',[whoami]), a )
    }
  function timer_clear()
    {
    if (m_timer)
      clearTimeout( m_timer )
    m_timer = null
    }
  function set_TABLE (the_tbl)
    {
    var ch_row1 = the_tbl.getElementsByTagName('TR')
    ch_row = []                                           // in case feedback has a table.
    for (var i=0; i<ch_row1.length; i++)
      {
       if (IE())
        {
        if (ch_row1[i].className == 'menuTR')
          ch_row.push(ch_row1[i])
        }
      else
       {
       if (ch_row1[i].childNodes[0].id)
         ch_row.push(ch_row1[i])
       }
     }
    for (var i=0; i<ch_row1.length; i++)
      if (ch_row1[i].name == 'menuTR')
        ch_row.push(ch_row1[i])                    // in case feedback has a table.
    for (var i=0, len=ch_row.length; i<len; i++)
      {
      var b = ch_row [ i ]
      b.onclick     = new Function( spf('~.do_click(~)',  [whoami, i]) )
      b.onmouseover = new Function( spf('~.do_over(~)',   [whoami, i]) )
      b.onmouseout  = new Function( spf('~.do_out(~)',    [whoami, i]) )
      b.style.backgroundColor = color_bg
      }
    var a = the_tbl.getElementsByTagName('td')
    if (IE())
      for (var i=0, len=a.length; i<len; i++)
        a[i].unselectable = 'on'
    }//set_TABLE
  this.set_colors = function( a, b )
    {
    color_hi = a
    color_bg = b
    }
  this.do_over = function(a)
    {
    set_TR( a )
    ch_row[a].style.cursor = 'pointer'
    timer_clear()
    }
  this.do_out = function(a)
    {
    ch_row[a].style.cursor = 'default'
    timer_set( 500 )
    }
  this.do_click = function(a)
    {
    this.clear()
    this.fire(e_src, a)
    }
  this.timeout = function()
    {
    timer_clear()
    this.clear()
    }
  this.init = function()
    {
    var y = 0
    var z = document.getElementsByTagName( 'span' )
      for(var j=0; j<z.length; j++)
        if(z[j].className == 'css_menu')
          y++
    function initHandlers()
      {
      var a = document.getElementsByTagName( 'span' )
      var b = []
      for (var i=0, a_len=a.length; i<a_len; i++)
        if (a[i].className == 'css_menu')
          {
          var c = a[i]
          c.onmouseout = function()
            {
            timer_set( 600 )
            }
          c.onclick =new Function(spf("~.m_over(arguments[0], this)", [whoami]))
          }
      }
    if(y!=0)
      initHandlers()
    }//init

  this.m_over = function(evt, src)
    {
    id_menu_box = xid('id_menu_box')
     function getScrollX()
      {
      return IE() ? document.body.scrollLeft : window.pageXOffset
      }
    function getScrollY()
      {
      return IE() ? document.body.scrollTop  : window.pageYOffset
      }
    function getOffsetLeft(o)
      {
      var r = o.offsetLeft
      while ((o = o.offsetParent) != null)
        r += o.offsetLeft
      return r
      }
    function getOffsetTop(o)
      {
      var r = o.offsetTop
      while ((o = o.offsetParent) != null)
        r += o.offsetTop
      return r
      }
    function mv(x,y)
      {
      x += getScrollX()
      y += getScrollY()
      id_menu_box.style.left = x + 'px'
      id_menu_box.style.top  = y + 'px'
      }
    evt = IE() ? event : evt
    timer_clear()
    e_src = src
	var theIdNo = e_src.id.substr(14)
	if(theIdNo > 5)
		mv( evt.clientX, evt.clientY - 170 )
	else	 
		mv( evt.clientX, evt.clientY + 18 )
    id_menu_box.style.visibility = "visible"
    id_menu_box.innerHTML = xid(e_src.id.substr(1)).innerHTML
    set_TABLE( id_menu_box )
    }

  this.clear = function()
    {
    id_menu_box = xid('id_menu_box')
    id_menu_box.innerHTML = ''
    id_menu_box.style.visibility = 'hidden'
    }
  this.fire = function(a, b)
    {
    }
  }//foundation_menu_class

function IE()
  {
  var a = navigator.userAgent.toLowerCase()
  return a.indexOf("msie") != -1
  }
var whoWin = ''
function my_menu_class( whoami )
  {
  this.inheritFrom = foundation_menu_class
  this.inheritFrom( whoami )
  this.set_colors( '#FFFFFF', '#EEEEEE' )
  this.fire = function(a, b)
    {
    var e = xid(a.id.substr(1))	
    var t = e.getElementsByTagName('table')
    t = t.length ? t[0] : null
    if (t)
      {
      var c = t.getElementsByTagName('caption')
      var correct_ans = c.length ? c[0].innerHTML : -1
	  var theSelectedChoice = t.rows[b].cells[0].firstChild.innerHTML;
	  var theFB = t.rows[5].cells[0].firstChild.innerHTML;
	  //alert(theFB)
	  var theNo = a.id.substr(14)
	  $($(".playBtnDiv")[theNo]).css('display', 'none');
      if (theSelectedChoice == correct_ans){
		$($(".showResult")[theNo]).html('<img src="../common/img/glass_o.png" border="0" />');
//		 $($(".showResult")[theNo]).html('<div>O</div>');
//		 $($(".showResult")[theNo]).css('backgroundColor', '#519a3b');
		 showFeedback('correct', theFB);
		 whoWin = 'O';
	  }	 
	  else{
		$($(".showResult")[theNo]).html('<img src="../common/img/glass_x.png" border="0" />');
//		$($(".showResult")[theNo]).html('<div>X</div>');
//		$($(".showResult")[theNo]).css('backgroundColor', '#983549');
		showFeedback('incorrect', theFB);
		whoWin = 'X';
		}
	  $($(".showResult")[theNo]).css('display', 'block');
      }
    }
  }//my_menu_class
  

function evaluateThreeInARow(){
	// Flatten the two-dimensional array.
	var squareStatus = [];
	var sLen = $(".showResult").length;
	for (var i=0; i < sLen; i++){
		var theRslt = $($(".showResult")[i]).html();
		squareStatus.push( theRslt );  
	}
//    alert(squareStatus)	
	if (squareStatus[0] != ''){
		if ((squareStatus[0] == squareStatus[1]) &&(squareStatus[0] == squareStatus[2]))
			return true;
					
		if ((squareStatus[0] == squareStatus[4]) &&(squareStatus[0] == squareStatus[8]))
			return true;
					
		if ((squareStatus[0] == squareStatus[3]) &&(squareStatus[0] == squareStatus[6]))
			return true;
	} 
				
	if (squareStatus[1] != ''){
		if ((squareStatus[1] == squareStatus[4]) &&(squareStatus[1] == squareStatus[7]))
			return true;
	} 

	if (squareStatus[2] != ''){
		if ((squareStatus[2] == squareStatus[4]) &&(squareStatus[2] == squareStatus[6]))
			return true;
					
		if ((squareStatus[2] == squareStatus[5]) &&(squareStatus[2] == squareStatus[8]))
			return true;
	} 

	if (squareStatus[3] != ''){
		if ((squareStatus[3] == squareStatus[4]) &&(squareStatus[3] == squareStatus[5]))
			return true;
	} 

	if (squareStatus[6] != ''){
		if ((squareStatus[6] == squareStatus[7]) &&(squareStatus[6] == squareStatus[8]))
			return true;
	} 

	return false;
}

function evaluateIsTied(){
	var sLen = $(".showResult").length;
	for (var i=0; i < sLen; i++)
		if ($($(".showResult")[i]).css('display') == 'none')
			return false;  
	return true;
	}
			
function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html("Incorrect");
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html("Correct");
			$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			break;
	}
	
	$('#feedback').show();
	$("#clickGuard").css("display", "block");	
}

function closeFeedback(){
	$('#feedback').hide();
	
	checkCompleted();
    $("#clickGuard").css("display", "none");	

}

var setCompletedShown = false;
var activityCompletedShown = false;

function checkCompleted(){
	if(setCompletedShown && !activityCompletedShown){
		//Check for activity completed
		loadNextSet();
	}else if(!setCompletedShown){
		//Check for set completed
		var theTie = evaluateIsTied();
		if(theTie){
			setCompletedShown = true;
			showFeedback("set_completed", "This round is a draw.");
		}
		else{
			var winnerDecided = evaluateThreeInARow();
			if (winnerDecided && whoWin=='O'){
				showFeedback("set_completed", "You won this round.");
				setCompletedShown = true;
			}	
			else if (winnerDecided && whoWin=='X'){
				showFeedback("set_completed", "You lost this round.");
				setCompletedShown = true;
			}
		}
	}	
}

function loadNextSet(){
	if(currentSet + 1 == numSets){
		activityCompletedShown = true;
	
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed");
		}
	}else{
		$(xml).find("item").shuffle();
		loadSet(currentSet + 1);
	}
}

function getPassedParameters()
{
	mediaPath = getURL_Parameter("mediaPath");
	xmlPath   = getURL_Parameter("xmlPath");
	return mediaPath != 'undefined';
}
function getURL_Parameter(param) {
    var urlQuery = location.href.split("?")
    if (typeof urlQuery == 'undefined')
        return 'undefined';

    if (urlQuery.length < 2)
        return 'undefined';

    var urlItems = urlQuery[1].split("&")
    var paramCount = urlItems.length;
    for (i = 0; i < paramCount; i++) {
        paramItem = urlItems[i].split("=");
        paramName = paramItem[0];
        paramValue = paramItem[1];

        if (param == paramName) {
            return paramValue;
        }
    }
    return 'undefined';
}

function randomNumbers()
{
	this.inhat  = function(n){return(this.ff[n])}
	this.remove = function(n){if(this.ff[n]){this.ff[n]=false;this.count--}}
	this.fill = function (n)
	{
		this.ff = []
		for (var i=0; i < n; i++)
		this.ff[i] = true
		this.count = n
    }

	this.get = function()
	{
		var n, k, r
		r = this.count
		if (r > 0)
		{
			n = Math.ceil(Math.random()*r)
			r = k = 0
			do
			if (this.ff[r++])
				k++
			while (k < n)
				this.ff[r-1] = false
			this.count--
		}
		return r-1
	}
	if (arguments.length > 0)
		this.fill( arguments[0] )
}// randomNumbers

// --------------------------------------------------------------
// spf(): 	Macro one or more strings into a template
//
// Use:
//		spf("Thank you ~ for learning the ~ language", ['david', 'Iraqi']);
//
// --------------------------------------------------------------
function spf( s, t )
{
  var n=0
  function F()
  {
    return t[n++]
  }
  return s.replace(/~/g, F)
}

// --------------------------------------------------------------
// xid(): 	shorthand for getElementbyId
//
// --------------------------------------------------------------
function xid( a )
{
	return window.document.getElementById( a )
}

// --------------------------------------------------------------
// globalize_id(): 	create a global variable reference to a DOM object
//
// --------------------------------------------------------------
function globalize_id( the_id )
{
	window [ the_id ] = xid(the_id)
}
