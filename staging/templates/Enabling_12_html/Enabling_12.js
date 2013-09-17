$(document).ready(function() {
//	audioInit();
	
	$('#feedback').hide();

	loadjscssfile("../common/css/activityDefault.css", "css");
	//Default values (for testing)
	if ( getPassedParameters() == false){
		mediaPath = "sampleData/";
		
	//	cssFilename = "styles/Enabling_12_default.css";
		xmlFilename = mediaPath + "enabling12_noNamespaces.xml";
		jsonFilename = mediaPath + "enabling12_json.js";
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
	cssFilename = "styles/enabling_12_dlilearn.css";
	testVideoSupport();	
	loadActivity(parseXml);
	
});


var numItems;
var numItemsPerSet = 3;
var setItemCompleted = 0;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/3);
	
	//Randomize sets
	$(xml).find("item").shuffle()
	
	loadSet(0);
}

var numberItemsInSet;
var fbAry = []
function loadSet(value){
	currentSet = value;
	$("#tabTL").html( $(xml).find("content").attr("target_language"));
	setCompletedShown = false;
	$("#clickGuard").css("display", "none");
	updateSetText();

	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	}

	////Set videos to play	
	var startIndex = currentSet*numItemsPerSet
	for(var i = 0; i< numberItemsInSet; i++)
	{
	var file_video = $($(xml).find("file_video")[startIndex + i]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	//alert(file_video);
	var no = i+1;
	var vidContainer = "videoContainer" + no;
	var vidTag = "videoTag" + no;
	loadVideo("../Enabling_12_html/" + mediaPath, file_video, vidContainer, vidTag, true )
	var addVidtagString = '<div class="dropTargetNo" id="dropTgt' + no + '">' +
						'<img  class="dropTargetImg" src="../common/img/btn_circ_drop.png" border="0">' +
						'</div>'
  							
	$("#videoContainer" + no).append(addVidtagString);
	xid(vidTag).className = "videoScreen";
	$( "#dropTgt" + no).droppable({
			hoverClass: "dropTargetHover",
			drop: dropFunction}); 
	}
	xid("playBtnVid1").onclick = function(){playVideo(1, startIndex)};
	xid("playBtnVid2").onclick = function(){playVideo(2, (startIndex + 1))};
	xid("playBtnVid3").onclick = function(){playVideo(3, (startIndex + 2))};
	
	//Build choice texts
	var TLtextAry = [];
	var ENtextAry = [];
	var FBtextAry = [];
	var TLdir = $($(xml).find("lang_tl")[0]).attr("dir") == "rtl" ? "rtl" : "ltr";
	//alert(TLdir)
	for(var i = 0; i< numItemsPerSet; i++)
		{
		var TL = $($(xml).find("lang_tl")[startIndex + i]).text();
		var EN = $($(xml).find("lang_en")[startIndex + i]).text();
		var FB = $($(xml).find("feedback")[startIndex + i]).text();
		TLtextAry.push(TL);
		ENtextAry.push(EN);
		FBtextAry.push(FB);
		}
	var hatA = new randomNumbers( numItemsPerSet );	
	for(var i = 0; i< numItemsPerSet; i++)
		{
		var a = hatA.get()
		fbAry.push(FBtextAry[a]);
		if (TLdir == "rtl")
			$("#TLtext" + i).html('<div style="width:95%;padding-right:7px;" dir="' + TLdir + '">' + TLtextAry[a] + '</div>');
		else
			$("#TLtext" + i).html(TLtextAry[a]);
		$("#ENtext" + i).html(ENtextAry[a]);
		$("#TLtext" + i).css("direction", TLdir);
		$("#hiddenText" + i).val(a);	
		//$("#dragBtn" + i).append(hiddenText);
		
	   //to make draggable numbers	
		$("#dragBtn" + i).draggable( 'enable');
		$("#dragBtn" + i).draggable({ revert: true, helper: "clone" });
		
		}

}

function playVideo(btnNo, videoIndex){
  var vidTag = "videoTag" + btnNo;	
  for (var i=0; i<numItemsPerSet; i++)
    {
	if (i!= (btnNo-1))
	  {
	  var vidTagNoPlay = "videoTag" + (i+1);
	  xid(vidTagNoPlay).pause();
	  }	  
	}
  xid(vidTag).play();
}

function selectText(lg){
  
  if (lg)
	{
	xid("tabTL").className = "tabIn";
	xid("tabEN").className = "tabOut"; 
	xid("TLtext0").className =	xid("TLtext1").className = xid("TLtext2").className = "textOn";
	xid("ENtext0").className =	xid("ENtext1").className = xid("ENtext2").className = "textOff";
	}
  else 
	{
	xid("tabTL").className = "tabOut";
	xid("tabEN").className = "tabIn";
	xid("TLtext0").className =	xid("TLtext1").className = xid("TLtext2").className = "textOff";
	xid("ENtext0").className =	xid("ENtext1").className = xid("ENtext2").className = "textOn";
	}
}

function dropFunction(event, ui ) {
	var dropTargetNumGot = extractLastNumber($(this).attr("id"))-1;	
	var dragBubbleNum = extractLastNumber($(ui.draggable).attr("id"));
	
	var dropTargetNumLookingFor = $("#hiddenText" + dragBubbleNum).val();
	 // alert(dropTargetNumLookingFor);
	if(dropTargetNumLookingFor == dropTargetNumGot ){
		ui.draggable.draggable( 'disable' );
		$(this).droppable( 'disable' );
		var addNoString = '<div class="droppedNo">' +
						'<img class="droppedNoBtn" src="../common/img/btn_drag_0' + (dragBubbleNum+1) + '.png" border="0">' +
						'</div>'
		$("#videoContainer" + (dropTargetNumGot+1)).append(addNoString);
		setItemCompleted++;		
		showFeedback("correct", $($(xml).find("feedback")[currentSet*numItemsPerSet + dropTargetNumGot]).text());
	}
	else{
		showFeedback("incorrect");
		
	}	
	$("#clickGuard").css("display", "block");
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
			break;
	}
	
	$('#feedback').show();
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
		if(setItemCompleted == numberItemsInSet){
			setCompletedShown = true;
			showFeedback("set_completed");
			setItemCompleted = 0;
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
