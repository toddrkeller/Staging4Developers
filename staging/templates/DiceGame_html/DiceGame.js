$(document).ready(function() {	
	$('#feedback').hide();
	
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";
		xmlFilename = mediaPath + "DiceGame_EnglishTestData.xml";
		jsonFilename = mediaPath + "DiceGame_EnglishTestData.js";		
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
		$('.activity_description').html('');
	}
	
	cssFilename = "styles/dicegame_dliLearn.css";
	//keyboardFilename = "sampleData/keyboard.js";
	loadActivity(parseXml);
	
	$("#main").css("opacity", "0");
	$("#clickToRoll").css("display", "block");
	
	startUp();	
}); 

var scrollbarLoaded = false;
function loadScrollbar(){
	if(!scrollbarLoaded){
		$("#keyboardContainer").mCustomScrollbar();
		scrollbarLoaded = true;
	}
}

function stageBubbles(pronounIndex, infinitiveIndex){
	var pronTop = (3 - pronounIndex) * 72 + 40;
	$('#pronoun_' + pronounIndex).animate( {
		left: '265px',
		top: pronTop + 'px'
	} );
	
	var infTop = (3 - infinitiveIndex) * 72 + 40;
	$('#infinitive_' + infinitiveIndex).animate( {
		left: '-269px',
		top: infTop + 'px'
	} );
}

function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

var PRONOUN_HEIGHT = 0;
var INFINITIVE_HEIGHT = 0;

function keyboardLoadCallback(){
	$(".div_submit").click(function(){
		submitClicked();
	});
	
	$(".div_del").click(function(){
		delClicked();
	});
	
	$("#keyboard > .letter").click(function(){
		letterClicked(this);		
	});
	
	$("#keyboard > div").addClass("noSelect");
	
	$("#keyboardContainer").css("opacity", "0");
}

function resetBubbles(){
	//boxes[0].shadowCast = true;
	//boxes[1].shadowCast = true;
	boxes[0].shadowCast = false;
	boxes[1].shadowCast = false;
	
	var i = 1;
	$("#main").find("div[id^='pronoun_']").each(function(){
		$(this).css("left","0px");
		$(this).css("top", (i * PRONOUN_HEIGHT) + "px");
		i++;
	});
	
	i = 1;
	$("#main").find("div[id^='infinitive_']").each(function(){
		$(this).css("left","0px");
		$(this).css("top", (i * INFINITIVE_HEIGHT) + "px");
		i++;
	});
}

//var pronounsAlreadyDrawn = new Array();
var infinitivesAlreadyDrawn = new Array();
//var randPronounValue;
//var randInfinitiveValue;
var userScore = 0;
var possibleScore = 0;

var rollAlreadyFinished = false;
function clickToRoll(){
	$("#clickToRoll").css("display", "none");
	$("#main").css("opacity", "1");
	rollAlreadyFinished = false;
	resetPositions();	
}

var diceRollLog;
var pronounDie;
var infinitiveDie;

function rollFinished(){
	if(rollAlreadyFinished){
		return;
	}
	
	rollAlreadyFinished = true;
	
	if($("#main").css("opacity") == "0"){
		return; //initial roll while canvas is hidden
	}
	
	$("#main").css("opacity", "1");
	
	secondTry = false;
	
	//Get random pronoun
	pronounDie = matchDice(boxes[1].rotation);
	infinitiveDie = matchDice(boxes[0].rotation);
	
	
	//Has this pair been thrown before?
	//If so try to find an unmatched infinitive
	while(1){
		var infinitiveReplaced = false;
		
		for(var i = 0 ; i < diceRollLog.length ; i++){
			var log = diceRollLog[i];
			
			if(log.pronoun == pronounDie && 
					log.infinitive == infinitiveDie){
				//Get random infinitive
				infinitiveReplaced = true;
				infinitiveDie = getRandomNumber(1, $(".infinitive").length);
			}
		}
		
		if(!infinitiveReplaced){
			break;
		}
	}
	
	diceRollLog.push({pronoun:pronounDie, infinitive:infinitiveDie});
	
	/*if(pronounsAlreadyDrawn[pronounDie] == undefined){
		pronounsAlreadyDrawn[pronounDie] = true;
		randPronounValue = pronounDie;
	}else{
		while(1){
			randPronounValue = getRandomNumber(1, $(".pronoun").length);
			
			if(pronounsAlreadyDrawn[randPronounValue] == undefined){
				pronounsAlreadyDrawn[randPronounValue] = true;
				break;
			}
		}
	}
	
	if(infinitivesAlreadyDrawn[infinitiveDie] == undefined){
		infinitivesAlreadyDrawn[infinitiveDie] = true;
		randInfinitiveValue = infinitiveDie;
	}else{
		//Get random infinitive
		while(1){
			randInfinitiveValue = getRandomNumber(1, $(".infinitive").length);
			
			if(infinitivesAlreadyDrawn[randInfinitiveValue] == undefined){
				infinitivesAlreadyDrawn[randInfinitiveValue] = true;
				break;
			}
		}
	}*/
	
	//setDieOrientation(1, randPronounValue );
	setDieOrientation(0, infinitiveDie );
	
	setTimeout(function(){
			boxes[0].position = [6,-3,-5];
			boxes[1].position = [-6,-3,-5];
			
			boxes[0].shadowCast = false;
			boxes[1].shadowCast = false;
			
			stageBubbles(pronounDie, infinitiveDie);
			
			$("#keyboardContainer").css("opacity", "1");			
		},1500);
}


var questionCount;

function updateScore() {
	$("#scoreText").text(userScore + "/" + possibleScore);
}


function parseXml(t_xml){
	if(keyboardFilename.length == 0){
		keyboardLayout();
	}
	
	numSets = $(xml).find("section").length;
	
	/*//Randomize sets
	$(xml).find("section").each(function(){
		randomizeSet(this);		
	});*/
	
	questionCount = $(xml).find("verb").length * numTakes;
	
	loadSet(currentSet);
}

function keyboardLayout() {
	//Generate the characters that should be in the keyboard
	var kbHtml = '<div id="keyboard">';

	//var maxKeys = 20;
	var keyObj = {};
	
	$($(xml).find("conjugation").text().replace(/[ ]/g,"").toLowerCase().split("").filter(function(itm,i,a){
	    return i==a.indexOf(itm);
	})).each(function(i,val){	
		keyObj[val] = val;
	});
	
	$.each(keyObj, function(i,val){
		kbHtml += '<div class="letter noSelect">' +
						val + '</div>';
	});
	
	kbHtml += 	'<div class="div_submit">Submit</div>' +
				'<div class="div_del">Del</div></div>';
	
	$("#keyboardContainer").append($(kbHtml));
	
	$('#keyboard > .letter').shuffle(); 
	
	keyboardLoadCallback();
}
function delClicked(){
	var input = $("#inputText").text();
	
	if(input.length > 0){
		input = input.substring(0, input.length - 1);
		$("#inputText").text(input);
	}	
}

function letterClicked(node){
	$("#inputText").append($(node).html());
} 

function randomizeSet(xml){
	$(xml).find("item").shuffle()
}

var jSection;
var numItemsInSet = -1;
var maxNumberItemsInSet = 9;
var answeredItems = 0;
var answeredItemsInSet = 0;


function loadSet(value){
	currentSet = value;
	gotoNextQuestion = false;
	
	diceRollLog = new Array();
	//pronounsAlreadyDrawn = new Array();
	infinitivesAlreadyDrawn = new Array();
	
	////$(".dragBubbleTextContainer").shuffle();
	
	jSection = $($(xml).find("section")[currentSet]);

	//Load drag bubbles
	for(var i  = 1; i<maxNumberItemsInSet + 1; i++){
		var infinitive = $(jSection.find("pronoun")[i-1]).text();
		
		$('#pronoun_' + i).css("top", (i * PRONOUN_HEIGHT) + "px" );
		
		if(infinitive.length > 0){
			$('#pronounText_' + i).text(infinitive);
			$("#pronounTextContainer_" + i ).parent().css("display", "block");
		}else{
			$('#pronounText_' + i).text("");
			$("#pronounTextContainer_" + i ).parent().css("display", "none");
		}
	}
	
	//Load infinitives
	numItemsInSet = jSection.find("infinitive").length;
	answeredItemsInSet = 0;
	
	for(var i  = 1; i<maxNumberItemsInSet + 1; i++){
		var infinitive = $(jSection.find("infinitive")[i-1]).text();
		
		$('#infinitive_' + i).css("top", (i * INFINITIVE_HEIGHT) + "px" );
		
		if(infinitive.length > 0){
			$('#infinitiveText_' + i).text(infinitive);
			$("#infinitive_" + i).css("display", "block");
		}else{
			$('#infinitiveText_' + i).text("");
			$("#infinitive_" + i).css("display", "none");
		}
	}
	
	nextQuestion();
	loadScrollbar();
//	setTimeout( enableMcScrollbar, 75 );
}

function enableMcScrollbar(){
	$("#keyboardContainer").mCustomScrollbar({
					scrollButtons:{
						enable:true
					}
				});
}		

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	//$("#clickGuard").css("display","block");
	
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
	
	/*$('#feedback').animate( {
	left: '380px',
	top: '200px',
	//width: '400px',
	//height: '100px',
	opacity: 1
	} ); */
	
}

var secondTry = false;
var gotoNextQuestion = false;

function submitClicked(){
/*-check for correct word
	-if not then feedback incorrect
		-if second time then feedback incorrect and correct answer
	Answer:
		-tag the bubbles so we don't do them again
		-update questions answered status
		-update score
		-check for finished with set
			-if not last set load next set
				-clear all tagged bubbles
		-if last set do activity completed */
	var submitted = $("#inputText").text();
	var answer = $($(jSection.find("verb")[infinitiveDie - 1]).
								find("conjugation")[pronounDie - 1]).
								text();	
	
	if(submitted.toLowerCase() == answer.toLowerCase()){
		//Correct
		answeredItems++;
		answeredItemsInSet++;
		
		userScore += infinitiveDie + pronounDie;
		possibleScore += infinitiveDie + pronounDie;	
	
		gotoNextQuestion = true;
		showFeedback("correct", "Correct.")
	
		updateScore();
	}else{
		//Wrong
		if(secondTry){
			gotoNextQuestion = true;
			showFeedback("incorrect", "The correct answer is " + answer);
			possibleScore += infinitiveDie + pronounDie;	

			answeredItems++;
			answeredItemsInSet++;
		
			updateScore();
		}else{
			secondTry = true;
			showFeedback("incorrect", "Please review your answer and try again");
		}
	}
}

function nextQuestion(){
	$("#clickToRoll").css("display", "block");
	$("#inputText").text("");
	$("#main").css("opacity", "0");
	$("#keyboardContainer").css("opacity", "0");
	updateQuestions();
	resetBubbles();
}


function updateQuestions(){
		$("#answeredText").text((answeredItems + 1) + " out of " + questionCount);
}

function closeFeedback(){
	$('#feedback').hide();
	//$("#clickGuard").css("display","none");
	
	if(answeredItemsInSet == numItemsInSet){
		//Set is finished
		if(currentSet + 1 == numSets &&
			currentTake + 1 == numTakes){
			if(!activityCompletedShown){
				activityCompletedShown = true;
			
				if(parent.activityCompleted){
					parent.activityCompleted(1,0);
				}else{
					showFeedback("activity_completed");
					$("#feedbackBtn").css("display", "none");
				}
			}
		}else{
			loadNextSet();
		}
	}else if(gotoNextQuestion){
		//Set is not finished
		nextQuestion();
		gotoNextQuestion = false;
	}
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var activityCompletedShown = false;

var currentTake = 0;
var numTakes = 2;

function loadNextSet(){
	if(currentTake + 1 != numTakes ){
		currentTake++;
		loadSet(currentSet);		
	}else{
		currentTake = 0;
		loadSet(currentSet + 1);
	}
}