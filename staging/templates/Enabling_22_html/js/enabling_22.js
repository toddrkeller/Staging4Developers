/*=============================
DLiLearn - Enabling 22 Activity
Created by: Patrick Wilkes
http://www.dliflc.edu
=============================*/

//global vars
var totalSets = 0;
var currentItem = 0;
var currentAudio = "";
var itemTotal = 0;
var tl_sentence = "";
var itemXML;
var stringArray = [];

//init and load files
$(document).ready(function() {
	audioInit();
	$('#feedback').hide();
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "library/";
		cssFilename = "css/enabling_22_default.css";
		xmlFilename = mediaPath + "enabling22_interactions.xml";
		jsonFilename = mediaPath + "enabling22_interactions.js";
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
	}
	cssFilename = "css/enabling_22_default.css";
	loadActivity(parseXml);
	
	document.getElementById('playBtn').onclick = playAudio;
}); 

//parse xml
function parseXml(t_xml){
	xml = t_xml;
	numSets = $(xml).find("set").length;
	totalSets = numSets;
	loadSet(0);
}

//load the set
function loadSet(value){
	var matchText = "";
	var targetWord = "";

	currentSet = value;
	setCompletedShown = false;
	//updateSetText();
	
	setXml = $(xml).find("set").eq(currentSet);
	itemTotal = $(setXml).find("item").length+1;
	itemXML = $(setXml).find("item").eq(currentItem);
	
		//find and add drag bubbles
		$(itemXML).find("tl_word").each(function(){
			var t =($(this).text());
			var tc = document.createElement("div");

			//add each word to array for searching
			stringArray.push(t);
			tc.id = t;
			tc.innerHTML = t;
			tc.className = 'dragBubble';
			$('#dragBubbleContainer').append(tc);
		})

		//find and add sentence with blanks
		$(itemXML).find("tl_sentence").each(function(){
			tl_sentence = ($(this).text());
			for(var i= 0; i<=stringArray.length-1; i++){
				var wordCheck = stringArray[i];
				wordCheck = wordCheck.toLowerCase();
				var wordCheckUpper = wordCheck.charAt(0).toUpperCase() + wordCheck.slice(1);
				tl_sentence = tl_sentence.replace(wordCheck, '<span class = "matchText">_________</span>');
				tl_sentence = tl_sentence.replace(wordCheckUpper, '<span class = "matchText">_________</span>');
			}
			$("#dropText").html(tl_sentence);
		})

		//find and add distractor words to the mix
		$(itemXML).find("dist_word").each(function(){
			var t =($(this).text());
			var tc = document.createElement("div");
			stringArray.dist_word = t;
			tc.id = t;
			tc.innerHTML = t;
			tc.className = "dragBubble";
			$("#dragBubbleContainer").append(tc);
		})
		
		//find and add image to imageContainer
		$(itemXML).find("image").each(function(){
			var t =($(this).text());
			$('#imageContainer').css('background-image', 'url(' + mediaPath + "png/" + t + ')');		
		})
		
		//find and add audio file to object
		$(itemXML).find("audio").each(function(){
			var t =($(this).text());
			currentAudio = t;
		})

	
	$(function() {
		
		var setTotal = stringArray.length;
		$('.dragBubble').shuffle();
		
		//create draggable
		$('.dragBubble').draggable({
			revert: true,
			start: function( event, ui ) {
				$("#hintsAreaText").html('');
			}
		});
		
		
		$('#dropContainer').droppable({
		
			//stop drag
			drop: function(event, ui) {
				
				//get the id of the dropped item
				var idx = ui.draggable.attr("id");
				
				//check correct drop
				if (idx==stringArray[0]){
					
					//remove draggable from list
					 $('#'+idx).hide("fast");
					 
					 //show text in sentence
					 tl_sentence = tl_sentence.replace('_________', '<span class = "textMatched">'+idx+'</span>');
					 $("#dropText").html(tl_sentence);
					
					//remove item from array
					stringArray.shift();
					
					//increment total
					currentItem++;
					
					//display feedback hintsAreaText
					$("#hintsAreaText").html("Feedback: " + idx + " is correct.");

					//check all items correct
					if (currentItem==setTotal){
						currentSet++;
						currentItem = 0;
						$('#dragBubbleContainer').html('');
						showFeedback("set_completed", $(itemXML).find("feedback").text());

							//check all sets complete
							if (currentSet==totalSets){
								document.getElementById('setText').innerHTML = "";
								showFeedback("activity_completed", $(itemXML).find("feedback").text());
								return false;
								//LOAD NEXT ACTIVITY//
							}
						}
				}else{
					$("#hintsAreaText").html("Feedback: " + idx + " is incorrect.");
                }
			}
		 });
		 
        $( "#dragBubbleContainer" ).disableSelection();
    });
	
	//shuffle letters
	//$(".dragBubble").shuffle();
}

//audio
function playAudio(){
	audio_play('library/mp3/' + currentAudio);
}

//feedback
function showFeedback(value, text){
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
			$("#feedbackHeader").html("Set Completed!");
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed!");
			$("#feedbackText").html(text);
			break;
	}
	
	$('#feedback').show();
}

function closeFeedback(){
	$('#feedback').hide();
	$('#hintsAreaText').html('');
	loadSet(currentSet);
	updateSetText();
}

var setCompletedShown = false;
var activityCompletedShown = false;


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
