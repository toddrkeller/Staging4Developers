$(document).ready(function() {	
	$('#feedback').hide();
	loadjscssfile("../common/css/activityDefault.css", "css");
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		//Default values (for testing)
		mediaPath = "sampleData/";
		xmlFilename = mediaPath + "english_enabling10_noNamespaces.xml";
		jsonFilename = mediaPath + "english_enabling10.js";
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

	testVideoSupport();
	
	cssFilename = "styles/enabling_10_dlilearn.css";
	loadActivity(parseXml);
}); 


var selectIndex = -1; 

function onChange(index){
	var select = $("#dropTarget_" + index + " select");
	var correctValue = $(select).data("correctValue");
	var options = $("#dropTarget_" + index + " select option");
	var selectValue = $(select).attr("value");
	////var optionId = $($(options)[selectValue]).attr("value");
	var itemIndex = (numItemsPerSet * currentSet) + correctValue - 1;
	
	if(selectValue == correctValue){
		$(select).addClass("itemCompleted");
		
		var optionsHtml = "<option value='" + correctValue + "'>" +
			$($(xml).find("lang_en")[itemIndex]).text()
			 + "</option>";
		$(select).html(optionsHtml);
		
		showFeedback("correct", $($(xml).find("feedback_l1")[itemIndex]).text());
	}else{
		$(select).attr("value", 0);
		selectIndex = index;
		showFeedback("incorrect", $($(xml).find("hint_l1")[itemIndex]).text());
	}
	
	
}

var numItems;
var numItemsPerSet = 5;
function parseXml(t_xml){
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems/5);
	
	//Randomize sets
	$(xml).find("item").shuffle()

	loadSet(0);
}

var numberItemsInSet;

function loadSet(value){
	currentSet = value;
	$("#clickGuard").css("display", "none");	
	setCompletedShown = false;
	$('#setIndex').html((currentSet + 1) + "/" + numSets);
	//updateSetText();

	clearVideo("videoContainer");
	//alert(currentSet)
	var lastIndexInSet = (currentSet + 1) * numItemsPerSet;
	numberItemsInSet = numItemsPerSet;
	if(lastIndexInSet > numItems){
		numberItemsInSet = lastIndexInSet - 1 - numItems;
	}

	//Reset vars
	for(var i = 0; i < numItemsPerSet; i++){
		//Set visibility on select tags
		if(i >= numberItemsInSet){
			$("#dropTarget_" + (i + 1) + " select").prop('disabled','true');
		}else{
			$("#dropTarget_" + (i + 1) + " select").prop('disabled','');
		}
	
		//Remove itemCompleted class
		$("#dropTarget_" + (i + 1) + " select").removeClass("itemCompleted");
		//$("#dropTarget_" + (i + 1) + " select").addClass("dropdown-menu");
		$("#dropTarget_" + (i + 1) + " select").html("");
	}
	
	
	//Build options
	var optionsHtml = "";
	for(var i = 0; i < numberItemsInSet; i++){
		optionsHtml += "<option value='" + (i + 1) + "'>" + 
				$($(xml).find("lang_en")[(currentSet*numItemsPerSet) + i]).text() + "</option>";
	}

	//Set options
	for(var i = 0; i < numberItemsInSet; i++){
		$("#dropTarget_" + (i + 1) + " select").data("correctValue", (i + 1));
		
		$("#dropTarget_" + (i + 1) + " select").html(optionsHtml);
		
		$("#dropTarget_" + (i + 1) + " select option").shuffle()
		$("#dropTarget_" + (i + 1) + " select").attr("value", 0);
		
		var blankOption = "<option value='0'></option>";
		$("#dropTarget_" + (i + 1) + " select").html(blankOption + 
					$("#dropTarget_" + (i + 1) + " select").html());
	}	
	
}

function playVideo(index){
	var file_video = $($(xml).find("file_video")[
					(currentSet*numItemsPerSet) + index - 1]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideo("../Enabling_10_html/" + mediaPath, file_video);
	
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
	$("#clickGuard").css("display", "block");	
}

function closeFeedback(){
	$('#feedback').hide();
			
	checkCompleted();
	$("#clickGuard").css("display", "none");
	
	if(selectIndex > 0){
		playVideo(selectIndex);
		selectIndex = -1;
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

function checkCompleted(){
	if(setCompletedShown && !activityCompletedShown){
		//Check for activity completed
		loadNextSet();
	}else if(!setCompletedShown){
		//Check for set completed
		if($(".itemCompleted").length == numberItemsInSet){
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
