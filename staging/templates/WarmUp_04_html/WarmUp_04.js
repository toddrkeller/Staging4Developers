$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = "sampleData/WarmUp_04_noNamespaces.xml";
		jsonFilename = "sampleData/WarmUp_04_noNamespaces.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename  = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		jsonFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  ".js" ;
		
		$('.activity_hd').html('');
		$('.activity_description').html('');
	}
	
	$('.drag').draggable({ revert: true });

	$( "#drop" ).droppable({
		hoverClass: "dropTargetHover",
		drop: dropHandler}); 
		
	cssFilename = "styles/warmUp_04_dliLearn.css";
	loadActivity(parseXml);
}); 

var numSets = 0;
var NUM_DRAG_BUBBLES = 6;

var orderIndexArray = [];

function parseXml(t_xml){
	numSets = Math.ceil($(xml).find("item").length / NUM_DRAG_BUBBLES);
	
	$(xml).find("item").shuffle();
	
	
	loadSet(0);
}

var numAnsweredInSet = 0;

function loadSet(value){
	$('.drag').css("opacity","1");
	$('.drag').draggable( 'enable' );
	
	currentSet = value;
	updateSetText();
	
	orderIndexArray = [];
	numAnsweredInSet = 0;
	
	for(var i=0; i < NUM_DRAG_BUBBLES; i++){
		//Load drag bubble text
		$("#drag" + i).text(
			$($(xml).find("tl_word")[i + (currentSet * NUM_DRAG_BUBBLES)]).text()
		);
		
		orderIndexArray[i] = i;
		
	}
	
	//Set up the order to display the drop targets
	orderIndexArray = shuffleArray(orderIndexArray);
	
	loadStage();
}

var audioFile;
var currentDropItem;

function loadStage(){
	currentDropItem = $($(xml).find("item")[
						(currentSet * NUM_DRAG_BUBBLES) + 
						orderIndexArray[numAnsweredInSet]]);
	
	//image
	var fileName = $($(currentDropItem).find("image")).text();
	$("#stageImg").attr("src", mediaPath + "png/" + fileName);
	
	//audio
	audioFile = $($(currentDropItem).find("audio")).text();
	
}

function dropHandler(event, ui ){
	var dragIndex = extractLastNumber($(ui.draggable).attr("id"));
	
	if(orderIndexArray[numAnsweredInSet] == dragIndex){
		$(ui.draggable).css("opacity","0");
		$(ui.draggable).draggable( 'disable' );
		$("#correctAnswer").text($(ui.draggable).text());
		showFeedback("correct", $($(currentDropItem).find("feedback")).text())
	}else{
		showFeedback("incorrect", $($(currentDropItem).find("hint")).text())
	}
	
}

function playAudio(){
	audio_play_file(removeFileExt(audioFile),mediaPath);
}


var feedbackState;
function showFeedback(value, text){
	feedbackState = value;
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	
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
			
			if(currentSet + 1 != numSets){
				$("#feedbackBtn").text("Next Set");
			}
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackBtn").html("Next Activity");
			break;
	}
	
	$('#feedback').show();
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}

var activityCompletedShown = false;

function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#correctAnswer").text("");
	
	if(!activityCompletedShown){
		$("#clickGuard").css("display","none");
	}
	
	switch(feedbackState){
		case "correct":
			feedbackState = "";
			
			numAnsweredInSet++;
			if(numAnsweredInSet == NUM_DRAG_BUBBLES){
				showFeedback("set_completed");
			}else{
				loadStage();
			}
			
			break;
		case "set_completed":
			if(!activityCompletedShown){
				loadNextSet();
			}
			
			break;
	}

	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var setCompletedShown = false;
var activityCompletedShown = false;


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