$(document).ready(function() {
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	loadjscssfile("../common/css/activityDefault.css", "css");

	audioInit();
	
	//Create Drag Bubble
	for(var i  = 1; i<7; i++){
		$('#dragBubble_' + i).draggable({ revert: true,stack: "div" });
	}
	
	//Create drop targets	
	for(var i  = 1; i<6; i++){
		$( "#dropTarget_" + i ).droppable({
			hoverClass: "dropTargetHover",
			drop: dropFunction}); 
	}
	
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";			
		xmlFilename = "sampleData/levantine_enabling05_noNamespaces.xml";
		jsonFilename = "sampleData/levantine_enabling05_noNamespaces.js";
	}
	else{
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		$(".activity_hd").html('');
		$(".activity_description").html('');
		
	}
	cssFilename = "styles/Enabling_05_default.css";	
	cssFilename = "styles/Enabling_05_dliLearn.css";
	loadActivity(parseXml);
}); 

function parseXml(t_xml){
	numSets = $(xml).find("section").length;
	
	//Randomize sets
	$(xml).find("section").each(function(){
		randomizeSet(this);		
	});
	
	loadSet(0);
}

function randomizeSet(xml){
	$(xml).find("item").shuffle()
}

var jSection;

function loadSet(value){
	currentSet = value;
	
	$(".dragBubbleText").shuffle();
	$('.dragBubble').draggable( 'enable' );

	setCompletedShown = false;

	updateSetText();

	jSection = $($(xml).find("section")[currentSet]);

	//Load drag bubbles
	for(var i  = 1; i<7; i++){
		$('#dragBubbleText_' + i).text($(jSection.find("lang_en")[i-1]).text());
	}
	
	$('#dragBubbleText_6').text(jSection.attr("distractor"));
	
	//Load drop bubbles
	for(var i  = 1; i<6; i++){
		$("#dropTarget_" + i).droppable( 'enable' );
		$('#dropTargetText_' + i).text($(jSection.find("phrase_tl")[i-1]).text());
	}
	
	//Load images
	$("#imageContainer").empty();
	
	var imageHTML ="";
	
	var file_graphics = jSection.find("file_graphic");
		
	for(var i = 1 ; i < 6; i++){
		imageHTML = imageHTML + 
			'<img id=img_' + i + ' class="imageOverlay disabledImage" src="' + 
			mediaPath + 'png/' + $(file_graphics[i - 1]).text()
			+ '"/>';
	}
	
	$("#imageContainer").html(imageHTML);
	
}

function extractLastLetter(value){
	var out = "";
	
	out = value.substr(value.length - 1, value.length);
	
	return out;
}

function dropFunction(event, ui ) {
	$("#clickGuard").css("display","block");
	
	var dropTargetNumGot = extractLastLetter($(this).attr("id"));
	
	var dropTargetNumLookingFor = extractLastLetter(
							$(ui.draggable.find(".dragBubbleText")[0]).attr("id"));
		
	//Play audio
	var file_audio = $(jSection.find("file_audio")[dropTargetNumGot - 1]).text();
	audio_play_file(removeFileExt(file_audio) ,mediaPath );
	
	if(dropTargetNumLookingFor == dropTargetNumGot){
		//Show image
		ui.draggable.draggable( 'disable' );
		$(this).droppable( 'disable' );
		
		$("#img_" + dropTargetNumGot).removeClass('disabledImage');
		
		showFeedback("correct", $(jSection.find("feedback_l1")[dropTargetNumGot - 1]).text());
	}else{
		showFeedback("incorrect", $(jSection.find("hint_l1")[dropTargetNumGot - 1]).text());
	}	
}

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	
	
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

function playAudio(value){
	var file_audio = $(jSection.find("file_audio")[value - 1]).text();
	audio_play_file(removeFileExt(file_audio) ,mediaPath );	
}

function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	
	if(activityCompletedShown){
		$("#clickGuard").css("display","block");
	}else{
		$("#clickGuard").css("display","none");
	}
	
	checkCompleted();
	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var setCompletedShown = false;
var activityCompletedShown = false;

function checkCompleted(){
	if(setCompletedShown && !activityCompletedShown){
		//Check for activity completed
		loadNextSet();
	}else if(!setCompletedShown){
		//Check for set completed
		if($("#imageContainer img.disabledImage").length == 0){
			setCompletedShown = true;
			showFeedback("set_completed");
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
