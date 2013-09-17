$(document).ready(function() {
//	audioInit();
	
	$('#feedback').hide();
	loadjscssfile("../common/css/activityDefault.css", "css");
	if ( getPassedParameters() == false){
	//Default values (for testing)
		mediaPath = "sampleData/";
		xmlPath = "sampleData/";	
		xmlFilename = xmlPath + "evaluation02_noNamespaces.xml";
		jsonFilename = xmlPath + "evaluation02_json.js";
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
		$('.activity_description').html('');
	}
	testVideoSupport();	
	cssFilename = "styles/evaluation_02_dlilearn.css";
	loadActivity(parseXml);
	
});


var numItems;
var numItemsPerSet = 2;
var setItemCompleted = 0;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/2);
	
	//Randomize sets
	//$(xml).find("set").shuffle()
	
	loadSet(0);
}

var numberItemsInSet;
var answerAry = [];
var inputFileAry = [];
var stuAnsAry = [];
function loadSet(value){
	currentSet = value;
	//$("#tapTL").html( $(xml).find("content").attr("target_language"));
	setCompletedShown = false;
	$("#clickGuard").css("display", "none");
	updateSetText();

	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	}
	var startIndex = currentSet*2;	
	var theInputType = ($($(xml).find("type")[startIndex]).text()).toLowerCase();
	var theInputExtension = ($($(xml).find("file_input")[startIndex]).text()).toLowerCase();
	theInputExtension = theInputExtension.substr(theInputExtension.lastIndexOf(".")+1);

	if(theInputType == 'image' || theInputExtension=='png'){
		var theImage0 = mediaPath + '/png/' + $($(xml).find("file_input")[startIndex]).text()
		var theImageText0 = '<img  class="qpic" src="' + theImage0 + '" border="0" />'
		$("#qinput0").html(theImageText0);
		var theImage1 = mediaPath + '/png/' + $($(xml).find("file_input")[startIndex +1]).text()
		var theImageText1 = '<img  class="qpic" src="' + theImage1 + '" border="0" />'
		$("#qinput1").html(theImageText1);
	}
	else{
		var theVideo0 = $($(xml).find("file_input")[startIndex]).text();
		theVideo0 = theVideo0.substring(0, theVideo0.lastIndexOf("."));
		var videoHtml0 = '<div id="videoContainer1"  class="roundCorners"></div>'
		$("#qinput0").html(videoHtml0);
		var vidContainer = "videoContainer1";
		var vidTag = "videoTag1";
//		loadVideo("../Evaluation_02_html/" + mediaPath, theVideo0, vidContainer, vidTag, true )
		loadVideo( mediaPath, theVideo0, vidContainer, vidTag, true )
		xid(vidTag).className = "videoScreen";
		xid("playBtnVid1").onclick = function(){playVideo(1)};
		
		var theVideo1 = $($(xml).find("file_input")[startIndex+1]).text();
		theVideo1 = theVideo1.substring(0, theVideo1.lastIndexOf("."));
		var videoHtml1 = '<div id="videoContainer2"  class="roundCorners"></div>'
		$("#qinput1").html(videoHtml1);
		var vidContainer = "videoContainer2";
		var vidTag = "videoTag2";
//		loadVideo("../Evaluation_02_html/" + mediaPath, theVideo1, vidContainer, vidTag, true )
		loadVideo( mediaPath, theVideo1, vidContainer, vidTag, true )
		xid(vidTag).className = "videoScreen";
		xid("playBtnVid2").onclick = function(){playVideo(2)};
	}
	
	//set the text choice
	var qStr0 = wr_qstr(startIndex);
	$("#qtext0").html(qStr0);
	var tlDir = $($(xml).find("lang_tl_phrase")[startIndex]).attr("dir").toLowerCase();
	if(tlDir == 'rtl'){
		$('.qtext').css({'textAlign':'center', 'direction':'rtl'});
		$('.qWord').css('float', 'right');
		$('.dropdownMenu').css('float', 'right');
		$("#qtext0").css({'textAlign':'right', 'direction':'rtl'});
		$("#qtext1").css({'textAlign':'right', 'direction':'rtl'});
	}
	var qStr1 = wr_qstr(startIndex+1);
	$("#qtext1").html(qStr1);
	if (stuAnsAry.length != 0){
		//alert(stuAnsAry[startIndex]);
		$("#dropdownMenu" + startIndex + " select").val(stuAnsAry[startIndex])
		$("#dropdownMenu" + (startIndex+1) + " select").val(stuAnsAry[startIndex+1])
	}
	
	function wr_qstr(no){
		var selectHtml='<select onchange="onChangeMenu(' + no +')"><option value="0"></option>';
		var theOption = [];
		theOption.push( $($(xml).find("lang_tl")[no]).text());
		theOption.push($($(xml).find("distractor_1")[no]).text())
		theOption.push($($(xml).find("distractor_2")[no]).text())
				
		var hatA = new randomNumbers( theOption.length );	//to randomize the choices
		
		for(var m=0; m<theOption.length; m++){
			var a = hatA.get();
			selectHtml += '<option value="' + theOption[a] + '">' + theOption[a] + '</option>';
		} 
		selectHtml += '</select>';
	
		var missingWordID = $($(xml).find("word_inst")[no]).text();
		missingWordID = missingWordID - 1;
		var tlSentenceAry = $($(xml).find("lang_tl_phrase")[no]).text().split('||');
		var tlDir = $($(xml).find("lang_tl_phrase")[no]).attr("dir");
		var qStr = '';
		var qLen = tlSentenceAry.length
		 
		for (var j=0; j<qLen; j++){
			if (j== missingWordID)
				qStr += '<div id="dropdownMenu' + no + '" class=" dropdownMenu">' + selectHtml+ '</div>' //
			else
				qStr += '<div class="qWord">&nbsp;' +tlSentenceAry[j] + '&nbsp;</div>';
				
		}
	return qStr	
	}	

	if (currentSet == 0 && stuAnsAry.length == 0){
		var iLen = numItems;
		for (var i=0;i<iLen;i++){			
			var theItem = $($(xml).find("item")[i]);
			var theAns = $($(xml).find("lang_tl")[i]).text();
			answerAry.push(theAns);			
			stuAnsAry.push(0);
			var inputFile =  $($(xml).find("file_input")[i]).text();
			inputFileAry.push(inputFile);
       }
	 }  
}

function onChangeMenu(no){
	var select = $("#dropdownMenu" + no + " select");
	//var correctValue = $(select).data("correctValue");
	var options = $("#dropdownMenu" + no + " select option");
	var selectValue = $(select).attr("value");
	
	stuAnsAry[no] = selectValue;
	
	if (checkAllAnswered())
		$("#submitBtn").css('visibility', 'visible');
}
function checkAllAnswered() {
	var sLen = stuAnsAry.length
	for (var i=0; i<sLen; i++){
		if (stuAnsAry[i] == 0){
			return false
		}
	}
//	alert(stuAnsAry)
	return true
}
function checkAnswers(){
	var aLen = answerAry.length;
	var correctItems = 0;
	for (var i=0; i<aLen; i++){
		if (stuAnsAry[i] == answerAry[i])
			correctItems++;
	}
	var stScore = correctItems/aLen;
	var passingScore = $(xml).find("content").attr("passing_score");	
	if(passingScore == undefined || passingScore == NaN)
			passingScore = .8;
		else
			passingScore = passingScore;
//	alert(stScore)		
	if ( stScore >= passingScore){ 
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
			}
		else
			showFeedback("activity_completed", "Passed!")
	}
	else
		showFeedback("activity_completed", "Failed!")
	$("#clickGuard").css("display", "inline");
	//alert($("#set_prev").css("disabled", "true")
	$("#set_prev").attr("disabled", "disabled");
	$("#set_next").attr("disabled", "disabled");
	$("#submitBtn").attr("disabled", "disabled");
	
	activityCompletedShown = true;
}
function playVideo(btnNo){
	var vidTag = "videoTag" + btnNo;
	//	alert(xid("videoTag2"));
	if (btnNo == 1 && xid("videoTag2")!= null)
		xid("videoTag2").pause();
	else if (btnNo == 2 && xid("videoTag1") != null)
	  xid("videoTag1").pause();
	xid(vidTag).play();
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
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackText").html(text);
			break;
	}
	
	$('#feedback').show();
}

function closeFeedback(){
	$('#feedback').hide();
	
	checkCompleted();
	if(activityCompletedShown)
		$("#clickGuard").css("display", "inline");
	else
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
		if(setItemCompleted == numberItemsInSet){
			setCompletedShown = true;
			//showFeedback("set_completed");
			setItemCompleted = 0;
			checkCompleted();
		}
	}	
}

function loadNextSet(){
	
	if(currentSet + 1 == numSets){
		activityCompletedShown = true;
		var passingScore = $(xml).find("content").attr("passing_score");	
		if(passingScore == undefined || passingScore == NaN)
			passingScore = .8;
		else
			passingScore = passingScore;
			
		var stScore = crrtNumber/numSets;
		alert('stScore= ' + stScore + ': passingScore= ' + passingScore)
		if ( stScore >= passingScore){ ;
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}
			else{
			alert('here')
			showFeedback("activity_completed", "Passed!")
			}
		}
		else
		showFeedback("activity_completed", "Failed!")		
	}
	else{
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
