$(document).ready(function() {
	
	audioInit();
	$('#feedback').hide();

	if ( getPassedParameters() == false){
		//Default values (for testing)
		
		mediaPath = "sampleData/";
		cssFilename = "styles/warmup_01_dlilearn.css";
		xmlFilename = mediaPath + "warmup01_noNamespaces.xml";
		jsonFilename = mediaPath + "warmup01_json.js";
		keyboardFilename = "../common/keyboards/msa_keyboard.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		//to get the keyboard
		var lang_name_short = getURL_Parameter('language');
		var langName = {ja:'japanese', sp:'spanish', ad:'msa'};
		var lang_name_long = langName.ja;
		keyboardFilename = '../common/keyboards/' + lang_name_long + '_keyboard.js';

		$('.activity_hd').html('');
	}

//	keyboardFilename = "../common/keyboards/japanese_keyboard.js";
	loadjscssfile("../common/css/activityDefault.css", "css");
	cssFilename = "styles/warmup_01_dlilearn.css";
	//testVideoSupport();	
	loadActivity(parseXml);
	
});

var numItems;
var numItemsPerSet = 6;
var itemCompletedAry = [];
var setItemCompleted = 0;
var itemCompleted = 0;
var currentSet = 0;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/6);
	
	//Randomize sets
	//$(xml).find("item").shuffle()
	//alert(numSets)
	loadSet(0);
	for(var i=0;i<numItems; i++){
		itemCompletedAry.push(0);
	}
	//alert (itemCompletedAry);
}

var numberItemsInSet;

function loadSet(value){
	currentSet = value;
	setCompletedShown = false;	
	updateSetText();
	//to make the space key wider
	$("#id_key_space").css('width', '88px');
	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	};
	for (var i=0; i<numberItemsInSet; i++){
	var theNo = currentSet*numItemsPerSet + i;
	var audStr = '<img  class="playBtnImg" id="playBtn' + theNo + '" onclick="audBtnClicked(' + theNo + ')" src="../common/img/btn_play_small.png" border="0">';
		$($('.audBtn')[i]).html(audStr);
	var theImg = $($(xml).find("file_graphic")[theNo]).text();	
	var imgStr = '<img  class="sm_picture" id="smPic' + theNo + '" src="' + mediaPath + 'png/' + theImg +'" border="0">';	
	$($('.smImg')[i]).html(imgStr);
	var tlWordStr = $($(xml).find("lang_tl")[theNo]).text();
	$($('.tlText')[i]).html(tlWordStr);
	var tlDir = $($(xml).find("lang_tl")[theNo]).attr("dir");	
	var tlInputStr = '<input type="text" id="tlIput' + theNo + '" width="165px" />';
	$($('.tlInputfield')[i]).html(tlInputStr);
	if (tlDir.toLowerCase() == 'rtl')
		$('#tlIput'+theNo).css({'direction':'rtl', 'text-align':'right'});
	var doneStr = '<img  class="donesymbol" id="done' + theNo + '" src="../common/img/chk_circle_mark.png" border="0">';
	//alert(doneStr);
	$($('.doneImg')[i]).html(doneStr);
	$($('.doneImg')[i]).css('display','none');
	$($('.tlInputfield')[i]).css('display','none');
	if (itemCompletedAry[theNo] == 1){
		$($('.doneImg')[i]).css('display','block');
		}
	}
	
}

var theTLinputField_id = '';
var theTLwordStr = '';
function audBtnClicked(No){
	//alert(No)
	if (itemCompletedAry[No] == 0){
		theTLinputField_id = ('tlIput'+No);
		var theInputDiv = $($('.tlInputfield')[No - currentSet*numItemsPerSet])
		for(var i=0; i<numItemsPerSet; i++){
			$($('.tlInputfield')[i]).css('display','none');		
		}
	
		theInputDiv.css('display','block');	
		$('#'+theTLinputField_id).focus();
		theTLwordStr = $($(xml).find("lang_tl")[No]).text()
	}
	var theAudFile = $($(xml).find("file_audio")[No]).text();
	playAudio(theAudFile);
}	
function playAudio(audFile){	
//	alert(audFile);
/*	var address = mediaPath + 'mp3/' + audFile;
	if (BrowserDetect.browser.toLowerCase() == "firefox")
		address = mediaPath + 'ogg/' + removeFileExt(audFile) + '.ogg';
	alert(address)	
	audio_play(address); */
	audio_play_file(removeFileExt(audFile),mediaPath);
}	
function delClicked(){
	var presentStr = $('#'+theTLinputField_id).attr('value');
	if (presentStr.length > 0)
		presentStr = presentStr.substr(0, presentStr.length-1);
	$('#'+theTLinputField_id).attr('value',presentStr);
	$('#'+theTLinputField_id).focus();
	checkAnswer(presentStr);
}
function spaceClicked(){
	var presentStr = $('#'+theTLinputField_id).attr('value');
	presentStr += ' ';
	$('#'+theTLinputField_id).attr('value',presentStr);
	$('#'+theTLinputField_id).focus();
	checkAnswer(presentStr);
}
function letterClicked(node){
//	alert($('#'+theTLinputField_id).attr('value'));
	var presentStr = $('#'+theTLinputField_id).attr('value');
	
	presentStr += $(node).html();
	$('#'+theTLinputField_id).attr('value',presentStr);
	$('#'+theTLinputField_id).focus();
	checkAnswer(presentStr);
}
function showKatakana(){
	keyboardFilename = "../common/keyboards/katakana_keyboard.js";
	if(keyboardFilename.length > 0){
		loadjscssfile(keyboardFilename, 'js',jsonKeyboardLoaded);
	}
	setTimeout( enableMcScrollbar, 75 );
				
}
function showHiragana(){
	keyboardFilename = "../common/keyboards/japanese_keyboard.js";
	if(keyboardFilename.length > 0){
		loadjscssfile(keyboardFilename, 'js',jsonKeyboardLoaded);
	}
	setTimeout( enableMcScrollbar, 75 );			
}
function enableMcScrollbar(){
	$("#keyboardContainer").mCustomScrollbar({
					scrollButtons:{
						enable:true
					}
				});
}				
function checkAnswer(inPutStr){
	//alert(inPutStr.indexOf('undefined'));
	if(inPutStr.indexOf('undefined') !=-1){
		showFeedback("incorrect", "Please select the item first.")
	}
	else{
		var currentSelectedIndex = extractLastNumber(theTLinputField_id);
		var iLen = inPutStr.length;
		var theALen = theTLwordStr.length;
		var comparedAns = theTLwordStr.substr(0, iLen);
		if (inPutStr == comparedAns){
			$('#'+theTLinputField_id).css('color', '#000');
			if(iLen == theALen){
			  showFeedback("correct", $($(xml).find("feedback_l1")[currentSelectedIndex]).text());
			  $('#'+theTLinputField_id).css('display', 'none');
			  showDoneMark(currentSelectedIndex);
			  }
		}
		else{
			$('#'+theTLinputField_id).css('color', '#FF0000');
			showFeedback("incorrect", $($(xml).find("hint_l1")[currentSelectedIndex]).text());
		}
	}
}
function showDoneMark(No){
	var inputFldDisplay = $('#tlIput'+No).css('display');
//	var doneStr = '<img  class="doneImg" id="done' + No + '" src="../common/Library/images/letterFbCorrect.png" border="0">';
	
	if (inputFldDisplay == "none" && itemCompletedAry[No] == 0){
		$($('.doneImg')[No-currentSet*numItemsPerSet]).css('display','block');
		itemCompletedAry[No] = 1;
		checkCompleteSet();
		}
}

function w_source()
  {
  var wr = ''
  function ws()
    {
    wr += ''.concat.apply('', arguments)
    }
  function wl()
    {
    wr += ''.concat.apply('', arguments) + '\n'
    }
  wl( "var wr = ''" )
  wl( ws )
  wl( wl )
  return wr
  }
  
  
var setCompletedShown = false;
var activityCompletedShown = false;
function checkCompleteSet(){
	setCompletedDone = true;
	var startIndex = currentSet*numItemsPerSet;
	var lastIndex = currentSet*numItemsPerSet + numItemsPerSet;
	for(var j= startIndex; j<lastIndex; j++){
		if(itemCompletedAry[j] == 0){
			setCompletedDone = false;
		}
	} 
	if(setCompletedDone == true){
		showFeedback("set_completed");
	}

	activityCompletedShown = true;
	for(var i=0;i<numItems; i++){
		if(itemCompletedAry[i] == 0){
			activityCompletedShown = false;
		}
	}
	if(activityCompletedShown == true){
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed");
		}
	
	}
}

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#clickGuard").css("display", "block");
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
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			break;
	}
	
	$('#feedback').show();
}
function closeFeedback(){
	$('#feedback').hide();	
    $("#clickGuard").css("display", "none");	

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

String.prototype.L_Trim = new Function("return this.replace(/^\\s+/,'')")
String.prototype.R_Trim = new Function("return this.replace(/\\s+$/,'')")
String.prototype.Trim = new Function("return this.L_Trim().R_Trim()")

// --------------------------------------------------------------
// BrowserDection
//
// ---------------------------------------------------------------

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
//alert(BrowserDetect.browser);