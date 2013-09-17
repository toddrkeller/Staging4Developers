$(document).ready(function() {
//	audioInit();
	
	$('#feedback').hide();
	loadjscssfile("../common/css/activityDefault.css", "css");
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = mediaPath + "evaluation03_noNamespaces.xml";
		jsonFilename = mediaPath + "evaluation03_json.js";
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
	cssFilename = "styles/evaluation_03_dlilearn.css";
	loadActivity(parseXml);

});


var numItems;
var numItemsPerSet = 1;
var setItemCompleted = 0;
function parseXml(t_xml){
	numItems = $(xml).find("set").length;
	numSets = Math.ceil(numItems/1);
	
	//Randomize sets
	//$(xml).find("set").shuffle()
	
	loadSet(0);
}

var numberItemsInSet;
var videoFileAry = [];
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
	//set the stml_video
	var startIndex = currentSet;
	
	var stml_video = $($(xml).find("stml_media")[startIndex]).text();
	if (stml_video != ''){
		stml_video = stml_video.substring(0, stml_video.lastIndexOf("."));
		//alert(stml_video);
		var vidContainer = "videoContainer1";
		var vidTag = "videoTag1";
		loadVideo( mediaPath, stml_video, vidContainer, vidTag, true )
		xid(vidTag).className = "videoScreen";
		xid("playBtnVid1").onclick = function(){playVideo(1)};
	}
	else{
	$("#videoContainer1").html('<img  class="no_video_mark" src="../common/Library/images/no_video_v2.png" border="0">');
		
	}	
	var localVideoFileAry = [];
	videoFileAry = [];
	var enTextAry = [];
	var hiddenvalueAry = [];
	var correct_video = $($(xml).find("correct_response_media")[startIndex]).text();
	if (correct_video != ''){
	localVideoFileAry.push(correct_video);
	}
	else{
	$("#videoContainer2").html('<img  class="no_video_mark" src="../common/Library/images/no_video_v2.png" border="0">');
	}
	var correct_text = $($(xml).find("correct_response_en")[startIndex]).text();
	enTextAry.push(correct_text);
	hiddenvalueAry.push('crrt');
	var d1_video = $($(xml).find("d_1_media")[startIndex]).text();
	if(d1_video != ''){
	localVideoFileAry.push(d1_video);
	}
	var d1_text = $($(xml).find("d_1_en")[startIndex]).text();
	enTextAry.push(d1_text);
	hiddenvalueAry.push('d1');
	var d2_video = $($(xml).find("d_2_media")[startIndex]).text();
	if(d2_video != ''){
	localVideoFileAry.push(d2_video);
	}
	var d2_text = $($(xml).find("d_2_en")[startIndex]).text();
	enTextAry.push(d2_text);
	hiddenvalueAry.push('d2');
	var hatA = new randomNumbers( 3 );
	for(var i = 0; i< 3; i++){
		var a = hatA.get()
		
		$("#id_text" + i).html(enTextAry[a]);
		$("#hiddenText" + i).val(hiddenvalueAry[a]);
		if (correct_video != ''){
			$("#playBtn" + i).click( function(){placeVideo(this)} );
			$("#playBtn" + i).css('display', 'inline');	
			videoFileAry.push(localVideoFileAry[a]);
		}
		else{
			$("#playBtn" + i).css('display', 'none');
			$("#id_text" + i).click( function(){showSubmitBtn(this)} );
			$("#id_text" + i).css('cursor', 'pointer');
		}		
	}	
	//to hide all the submit buttons	
	for (var i=0; i<3; i++)
			$("#submitBtn" + i).css('display', 'none');	
	//to start with the empty second video player
	if (correct_video != ''){
		$("#videoContainer2").html('');
	}	
}

function turn_on(x){
	x.src = "../common/img/btn_play_sm_on.png"
}
function turn_off(x){
	x.src = "../common/img/btn_play_sm_off.png"
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

function placeVideo(ID){
	var idNo = extractLastNumber($(ID).attr("id"));
	var vFN = videoFileAry[idNo];
	var theVideo = vFN.substring(0, vFN.lastIndexOf("."));
	//alert(theVideo);	
	var vidContainer = "videoContainer2";
	var vidTag = "videoTag2";
	loadVideo( mediaPath, theVideo, vidContainer, vidTag, true )
	xid(vidTag).className = "videoScreen";
	xid("playBtnVid2").onclick = function(){playVideo(2)};
	var idNo = extractLastNumber($(ID).attr("id"));
	for (var i=0; i<3; i++)
		if (i != idNo)
			$("#submitBtn" + i).css('display', 'none');
	var theSubmitBtnID = "#submitBtn" + idNo;
	$(theSubmitBtnID).css('display', 'inline');
	playVideo(2);
}
function showSubmitBtn(ID){
	var idNo = extractLastNumber($(ID).attr("id"));
	for (var i=0; i<3; i++)
		if (i != idNo)
			$("#submitBtn" + i).css('display', 'none');
	var theSubmitBtnID = "#submitBtn" + idNo;
	$(theSubmitBtnID).css('display', 'inline');
}

var crrtNumber = 0;
function submitAns(No){
	var userAnswer = $("#hiddenText" + No).val();
	if(userAnswer == 'crrt'){
		showFeedback("correct");
		crrtNumber++
		}
	else{
		var fbTxt = $($(xml).find("additional_feedback")[currentSet]).text();
		if (fbTxt)
			showFeedback("incorrect", fbTxt);
		else
			showFeedback("incorrect");
	}	
	setItemCompleted++;	
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
	$("#clickGuard").css("display", "inline");
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
