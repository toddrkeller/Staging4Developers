$(document).ready(function () {
	audioInit();
	$('#feedback').hide();
	$('#feedbackArrow').hide();
	$("#feedbackText").html("");
	$('#closeBtn').hide();

	cssFilename = "styles/WarmUp_02_default.css";
	
	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		
		xmlFilename = mediaPath + "hs_01_01_02_03_noNamespaces.xml";
		jsonFilename = mediaPath + "hs_01_01_02_03_noNamespaces.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		jsonFilename = xmlFilename.substring(0, xmlFilename.length-3) + "js";
	}
//	keyboardFilename = "../common/keyboards/hausa_keyboard.js";
	if (getURL_Parameter('keyboardFileName') != 'undefined') {
		keyboardFileUse = true;
		keyboardFilename = "../common/keyboards/" + getURL_Parameter('keyboardFileName') + ".js"
	}
	
	loadjscssfile("../common/css/dlilearn_activities.css", "css");
	loadActivity(parseXml);
});

var numItems;
var numItemsPerSet = 15;

// It would be multidimensional array to save checked choices.
// To check answer status 
// 0: no trial, 1: first incorrect answer, 2: second incorrect answer, 3: correct answer
var answerItemStatusArray = [];

var missingLetterIdsArray = [];
var missingLetterIdsTrialsArray = [];

var isTouchSupported = 'ontouchstart' in window;

// To use either a keyboard file or characters from contents for a keyboard layout
// true: to use a keyboard file, false: to use characters from contents
var keyboardFileUse = false;

// For homework
var homeworkStatus;
var answerAttemptsArray = [];
var answerResultsArray = [];

// For homework
String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

function parseXml(t_xml) {

	xml = t_xml;
	numItems = $(xml).find("item").length;
	numSets = Math.ceil(numItems);

	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	// Randomize sets
    $(xml).find("section").each(function(){
        randomizeSet(this);        
    });

	// It would be multidimensional array to save checked choices.
	answerItemStatusArray = new Array(numSets);
	for (var i = 0; i < numSets; i++) {
		answerItemStatusArray[i] = 0;
	}
	
	// For homework
	answerAttemptsArray.length = numSets;
	for (var i=0; i<answerAttemptsArray.length; i++){
		answerAttemptsArray[i] = 0;
	}
	answerResultsArray.length = numSets;
	
	// To use characters from contents for a keyboard layout
	if (!keyboardFileUse) {
		keyboardLayout();
	}
	loadSet(0);
}

// To use characters from contents for a keybard layout
function keyboardLayout() {
	var maxNumberOfLetters = 48;
	var questionWordCharacters = "";
    var questionWordCharactersArray = [];
	var questionWordCharactersArraySelected = [];
	var questionWordMissingLetterIdsArray = [];
	var questionWordMissingLettersArray = [];
	var numberOfDistractors = 0;	

	for (var h=0; h<$(xml).find("lang_tl").length; h++) {
		// missing_letter_ids should be single number or comma seperated. (e.g. 1 or 1, 2, 3)
		var missingLetterIds = $($(xml).find("missing_letter_ids")[h]).text().split(",");
		
		questionWordCharacters = $($(xml).find("lang_tl")[h]).text();
		questionWordMissingLetterIdsArray = [];
		
		for (g = 0; g < missingLetterIds.length; g++) {
			questionWordMissingLetterIdsArray.push(Number(missingLetterIds[g] - 1));
		}
	
		for (var i=0; i<questionWordCharacters.length; i++) {
			var checkMissingLetters = 0;
			for (var k=0; k<questionWordMissingLetterIdsArray.length; k++) {
				if (questionWordMissingLetterIdsArray[k] == i) {
					checkMissingLetters++;					
				}
			}
			
			if (checkMissingLetters == 0) {
				if (questionWordCharactersArray.length == 0) {
					questionWordCharactersArray.push(questionWordCharacters[i]);
				}
				else {
					var checkChars = 0;
					for (var j=0; j<questionWordCharactersArray.length; j++) {
						if ((questionWordCharacters[i].toLowerCase() == questionWordCharactersArray[j].toLowerCase())){
							checkChars++;
						}
					}
					if (checkChars == 0){
						questionWordCharactersArray.push(questionWordCharacters[i]);
					}
				}
			}
			else {
				if (questionWordMissingLettersArray.length == 0) {
					questionWordMissingLettersArray.push(questionWordCharacters[i]);
				}
				else {
					var checkChars = 0;
					for (var j=0; j<questionWordMissingLettersArray.length; j++) {
						if ((questionWordCharacters[i].toLowerCase() == questionWordMissingLettersArray[j].toLowerCase())){
							checkChars++;
						}
					}
					if (checkChars == 0){
						questionWordMissingLettersArray.push(questionWordCharacters[i]);
					}
				}		
			}
		}
	}
	
	for (var m=0; m<questionWordCharactersArray.length; m++) {
		var checkChars = 0;
		for (var l=0; l<questionWordMissingLettersArray.length; l++) {
			if ((questionWordCharactersArray[m].toLowerCase() == questionWordMissingLettersArray[l].toLowerCase())){
				checkChars++;
			}
		}
		if (checkChars == 0){
			questionWordCharactersArraySelected.push(questionWordCharactersArray[m]);
		}
	} 
	
	if (questionWordCharactersArraySelected.length > (maxNumberOfLetters - questionWordMissingLettersArray.length)) {
		numberOfDistractors = (maxNumberOfLetters - questionWordMissingLettersArray.length);
	}
	else {
		numberOfDistractors = questionWordCharactersArraySelected.length;
	}
	
	shuffleArray(questionWordCharactersArraySelected);

	$("#keyboardContainer").html('<div id="keyboard"></div>');
	
	for (var i=0; i<questionWordMissingLettersArray.length; i++) {
		$('#keyboard').append('<div id="letter" class="letter roundCornersLetter">' + questionWordMissingLettersArray[i] + '</div>');
	}	

	for (var i=0; i<numberOfDistractors; i++) {
		$('#keyboard').append('<div id="letter" class="letter roundCornersLetter">' + questionWordCharactersArraySelected[i] + '</div>');
	}
	
	$('#keyboard').find('#letter').shuffle();
}
function randomizeSet(xml) {
	$(xml).find("item").shuffle();
}

function nextClick() {
	if (setBtnLock)
		return;

	if (currentSet != numSets - 1) {
		loadSet(currentSet + 1);
	}
}

function prevClick() {
	if (setBtnLock)
		return;

	if (currentSet != 0) {
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;
var currentTile = 0;
var file_audio = new Array;
var file_image = new Array;

var questionWordArray = new Array;

// 580x400
// var initialLeft = 580 / 2 - 60 / 2;
// var initialTop = 400 - 60 - 14;

// 880x480
var initialLeft = 580 / 2 - 100 / 2;
var initialTop = 480 - 100 - 14;

// [tile left, tile top, popup left, popup top]
var tileAndPopupLocations = new Array(
[6, 490, 94, 430], 
[6, 370, 94, 370], 
[6, 250, 94, 246], 
[6, 130, 94, 128], 

[6, 10, 94, 80], 
[134, 10, 78, 100], 
[262, 10, 206, 100], 
[390, 10, 334, 100], 
[518, 10, 462, 100], 
[646, 10, 590, 100], 
[774, 10, 576, 80], 

[774, 130, 576, 128], 
[774, 250, 576, 246], 
[774, 370, 576, 370], 
[774, 490, 576, 430]);

function loadSet(value) {
	currentSet = value;
	setCompletedShown = false;

	// Load question
	var questionWord = $($(xml).find("lang_tl")[currentSet]).text();

	// missing_letter_ids should be single number or comma seperated. (e.g. 1 or 1, 2, 3)
	var missingLetterIds = $($(xml).find("missing_letter_ids")[currentSet]).text().split(",");

	missingLetterIdsArray = [];
	missingLetterIdsTrialsArray = [];

	for (i = 0; i < missingLetterIds.length; i++) {
		missingLetterIdsArray.push(Number(missingLetterIds[i] - 1));
	}

	missingLetterIdsTrialsArray.length = missingLetterIdsArray.length;

	var outputQuestionWord = "";

	file_audio[currentSet] = $($(xml).find("file_audio")[currentSet]).text();
	file_image[currentSet] = $($(xml).find("file_graphic")[currentSet]).text();
	
	questionWordArray[currentSet] = questionWord;

	//To show the feedback panel in the initial loading
	$('#feedback').show();
	$('#feedbackHeader').hide();
	$('#feedbackBtn').hide();

	for (var i = 0; i < questionWord.length; i++) {
		var sHavingMissingLetter = false;

		for (var j = 0; j < missingLetterIdsArray.length; j++) {

			if (i == missingLetterIdsArray[j]) {
				outputQuestionWord = outputQuestionWord + '<span id="dropTarget' + j + '" class="dropTarget hideText">' + '&nbsp;' + '</span>';
				sHavingMissingLetter = true;
			}
		}

		if (!sHavingMissingLetter) {
			outputQuestionWord = outputQuestionWord + questionWord.charAt(i);
		}
	}

	$('#word').html(outputQuestionWord);

	// Load image
	$("#setImg").attr("src", mediaPath + "png/" + file_image[currentSet]);

	var timeoutID;
	var timeoutID2;

	if (currentSet == 0) {
		for (i = 0; i <= tileAndPopupLocations.length; i++) {
			timeoutID2 = window.setTimeout('tileRotation(' + i + ')', (400 * i));
		}
	}

	timeoutID = window.setTimeout(keyboadDraggable, 100);
}

function tileRotation(i) {
	if (i == 0) {
		$('#tileArea').addClass('moveForward');
	} else if (i == tileAndPopupLocations.length) {
		$('#tileArea').removeClass('moveForward');
		$('#clickGuard').css('display', 'none');
	}
	if (i < tileAndPopupLocations.length) {
		$('#tileArea').append('<div id="tile' + i + '" class="roundCornersTile"></div>');
		$('#tile' + i).css("left", initialLeft);
		$('#tile' + i).css("top", initialTop);
		$('#tile' + i).animate({
			left: tileAndPopupLocations[i][0],
			top: tileAndPopupLocations[i][1],
			opacity: 0.2,
			borderSpacing: 45
		}, {
			step: function (now, fx) {
				$(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
				$(this).css('-moz-transform', 'rotate(' + now + 'deg)');
				$(this).css('transform', 'rotate(' + now + 'deg)');
				$(this).css('-ms-transform', 'rotate(' + now + 'deg)');
				$(this).css('-o-transform', 'rotate(' + now + 'deg)');
				
			},
			duration: 400
		}, 'linear');
		$('#tile' + i).animate({
			left: tileAndPopupLocations[i][0],
			top: tileAndPopupLocations[i][1],
			opacity: 0.8,
			borderSpacing: -30
		}, {
			step: function (now, fx) {
				$(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
				$(this).css('-moz-transform', 'rotate(' + now + 'deg)');
				$(this).css('-ms-transform', 'rotate(' + now + 'deg)');
				$(this).css('-o-transform', 'rotate(' + now + 'deg)');
				$(this).css('transform', 'rotate(' + now + 'deg)');
				
				$(this).addClass('boxBG'); //
			},
			duration: 200
		}, 'linear');
		$('#tile' + i).animate({
			left: tileAndPopupLocations[i][0],
			top: tileAndPopupLocations[i][1],
			opacity: 1.0,
			borderSpacing: 0
		}, {
			step: function (now, fx) {
				$(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
				$(this).css('-moz-transform', 'rotate(' + now + 'deg)');
				$(this).css('-ms-transform', 'rotate(' + now + 'deg)');
				$(this).css('-o-transform', 'rotate(' + now + 'deg)');
				$(this).css('transform', 'rotate(' + now + 'deg)');
			},
			duration: 300
		}, 'linear');
	}
}

var dragging = false;

function draggingFunction() {
	dragging = true;
}

function draggingStopFunction() {
	dragging = false;
}

var letterIncorrectArray = [];

function dropFunction(event, ui) {
	dragging = false;
	var dragBtnLetter = ui.draggable.text().toLowerCase();
	var dragBtnComponent = ui.draggable;
	var dropBtnIndex = extractLastNumber($(this).attr("id"));
	var dropBtnLetterAns = questionWordArray[currentSet].charAt(missingLetterIdsArray[dropBtnIndex]).toString();
	var dropBtnLetter = questionWordArray[currentSet].charAt(missingLetterIdsArray[dropBtnIndex]).toLowerCase();
	var correctLetterDropped = false;

	if (dropBtnLetter == dragBtnLetter) {
		correctLetterDropped = true;
		missingLetterIdsTrialsArray[dropBtnIndex] = 3;

		var nCountTrials = 0;
		for (i = 0; i < missingLetterIdsTrialsArray.length; i++) {
			if (missingLetterIdsTrialsArray[i] == 3) {
				nCountTrials++;
			}
		}
		if (nCountTrials == missingLetterIdsTrialsArray.length) {
			answerItemStatusArray[currentSet] = 3;
			showFeedback("correct", $($(xml).find("feedback_l1")[currentSet]).text());
		}
	} else {
		if (isNaN(missingLetterIdsTrialsArray[dropBtnIndex])) {
			missingLetterIdsTrialsArray[dropBtnIndex] = 1
		} else {
			missingLetterIdsTrialsArray[dropBtnIndex] = missingLetterIdsTrialsArray[dropBtnIndex] + 1;
		}

		var nCountTrials = 0;
		var nCountSecondIncorrectTrials = 0;
		for (i = 0; i < missingLetterIdsTrialsArray.length; i++) {
			if (missingLetterIdsTrialsArray[i] == 3) {
				nCountTrials++;
			}
			if (missingLetterIdsTrialsArray[i] == 2) {
				nCountSecondIncorrectTrials++;
			}
		}
		if ((nCountTrials == (missingLetterIdsTrialsArray.length - 1)) && (nCountSecondIncorrectTrials > 0)) {
			correctLetterDropped = true;
			showFeedback("incorrect", $($(xml).find("feedback_l1")[currentSet]).text());
			answerItemStatusArray[currentSet] = 3;
		}
		if (missingLetterIdsTrialsArray[dropBtnIndex] == 1) {
			showFeedback("incorrect", $($(xml).find("hint_l1")[currentSet]).text());
		} else if (missingLetterIdsTrialsArray[dropBtnIndex] == 2) {
			missingLetterIdsTrialsArray[dropBtnIndex] = 3;
			correctLetterDropped = true;
		}
	}
	if (correctLetterDropped) {
		$(this).droppable("disable");
		$(this).html(dropBtnLetterAns);
		$(this).removeClass("hideText ui-droppable-disabled ui-state-disabled").addClass("unhideText");
	}
}

function keyboadDraggable() {
	//Refresh drag and drop components
	$(".dropTarget").droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction
	});
	$('.letter').draggable({
		revert: true,
		stack: "div",
		distance: 40,
		drag: draggingFunction,
		stop: draggingStopFunction
	});
}

function showFeedback(value, text) {
	$('#feedback').css('z-index', (parseInt($('#tileArea2').css('z-index')) + 100));
	
	// Enable the clickguard
	$('#clickGuard').css('display', 'block');
	$('#clickGuard').css('z-index', $('#feedback').css('z-index') - 2);

	// Clear the dialog box
	$("#feedbackHeader").removeClass('feedbackHeaderColorIncorrect feedbackHeaderColorCorrect');
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");

	switch (value) {
	case "incorrect":
		$("#feedbackHeader").addClass('feedbackHeaderColorIncorrect');  //
		$("#feedbackHeader").html("Incorrect");
		$("#feedbackText").html(text);
		
		// Load incorrect arrow image
		$("#feedbackArrowImg").attr("src", "../common/img/feedback_incorrect_arrow.png");
		$("#feedbackArrow").show();
		
		// For homework
		answerResultsArray[currentSet] = value;
		break;
	case "correct":
		$("#feedbackHeader").addClass('feedbackHeaderColorCorrect');  //
		$("#feedbackHeader").html("Correct");
		$("#feedbackText").html(text);
		
		// Load correct arrow image
		$("#feedbackArrowImg").attr("src", "../common/img/feedback_correct_arrow.png");
		$("#feedbackArrow").show();
		
		// For homework
		answerResultsArray[currentSet] = value;
		break;
	case "set_completed":
		$("#feedbackHeader").html("Set Completed");
		break;
	case "activity_completed":
		$("#feedbackHeader").html("Activity Completed");
		break;
	}
	$('#feedback').show();
	$('#feedbackHeader').show();
	$('#feedbackText').show();
	$('#feedbackBtn').show();
}

function closeFeedback() {
	$('#feedback').show();
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	$('#feedbackArrow').hide();
	$('#feedback').css('z-index', 1);	

	if (answerItemStatusArray[currentSet] > 1) {
		$('#clickGuard').css('display', 'none');
		$('#clickGuard').css('z-index', '5');
		$('.playBtn').css('z-index', '6');
	} else {
		$('#clickGuard').css('z-index', '5');
		$('#clickGuard').css('display', 'none');
		$('.playBtn').css('z-index', '6');
	}
	if (completedFeedbackShown) {
		$('#clickGuard').css('display', 'block');
	}

	checkCompleted();
}

var completedFeedbackShown = false;
var finalScore = 0;

function checkCompleted() {
	var tileImageId = currentSet;
	var totalCheckedNumber = 0;
	var totalCorrectNumber = 0;

	for (var i = 0; i < answerItemStatusArray.length; i++) {
		if (answerItemStatusArray[i] == 3) {
			totalCheckedNumber++;
		}
		if (answerItemStatusArray[i] == 3) {
			totalCorrectNumber++;
		}
	}
	if (!completedFeedbackShown) {
		if (answerItemStatusArray[currentSet] >= 2 && currentSet < numItemsPerSet) {
			$('#tileArea2').append(
				'<div id="tileImageDiv' + currentSet + '" class="roundCornersTileImage"><image id ="' +
				'tileImage' + currentSet +
				'" src="' +
				mediaPath + 'png/' + file_image[currentSet] + '" class="roundCornersTileImage"></div>');	
			$('#tileImageDiv' + currentSet).css("left", 200);
			$('#tileImageDiv' + currentSet).css("top", 160);
			$('#tileImageDiv' + currentSet).css("width", 120);
			$('#tileImageDiv' + currentSet).css("height", 120);
			$('#tileImageDiv' + currentSet).css("z-index", (parseInt($('#tileArea2').css('z-index')) + 120 + parseInt(currentSet)));
			
			$('#tileImageDiv' + currentSet).animate({
				left: tileAndPopupLocations[currentSet][0],
				top: tileAndPopupLocations[currentSet][1],
				marginTop: 0
			});

			$('#tileImage' + currentSet).animate({
				width: 100,
				height: 100
			}, function () {
				$('#tileImageDiv' + tileImageId).css("width", 100);
				$('#tileImageDiv' + tileImageId).css("height", 100);
				$(this).mouseover(function () {
					popUpPanel(extractLastNumber($(this).attr("id")))
				});
				$(this).mouseout(function () {
					if (!isTouchSupported){
						$('#popUpPanel').hide();
					}
				});
				
				loadNextSet();
			});
		}
	}
	
	// For homework
	if (homeworkStatus) {
		checkAnswers();
	}
}

function popUpPanel(id) {
	if (isTouchSupported){
		$('#popUpPanel').css("left", tileAndPopupLocations[id][2] + 10);
		$('#popUpPanel').css("top", tileAndPopupLocations[id][3] + 8 + 18);
	}
	else {
		$('#popUpPanel').css("left", tileAndPopupLocations[id][2] + 10);
		$('#popUpPanel').css("top", tileAndPopupLocations[id][3] + 8);
	}
	
	$('#popUpPanelImageId').attr("src", mediaPath + 'png/' + file_image[id]);
	$('#popUpPanelText').html(questionWordArray[id]);
	$('#popUpPanel').show();
	
	currentTile = id;
	
	$('#popUpPanel').mouseover(function () {
		if (!isTouchSupported) {
			$('#popUpPanel').show();
		}
		else{
			$('#closeBtn').show();
		}
	});
	$('#popUpPanel').mouseout(function () {
		$('#closeBtn').hide();
		$('#popUpPanel').hide();
	});
	
	$('#closeBtn').css("left", tileAndPopupLocations[id][2] + 10 + 158);
	if (isTouchSupported){
		$('#closeBtn').css("top", tileAndPopupLocations[id][3] + 10+ 16);
	}
	else {
		$('#closeBtn').css("top", tileAndPopupLocations[id][3] + 10);
	}
	$('#closeBtn').css("z-index", $('#popUpPanel').css('z-index') + 2);
	if (isTouchSupported) {
		$('#closeBtn').click(function () {
			$('#closeBtn').hide();
			$('#popUpPanel').hide();
		});
		$('#closeBtn').show();
	}
}

function loadNextSet() {
	if (currentSet + 1 == numSets) {
		completedFeedbackShown = true;
		
		if (homeworkStatus) {
			answerAttemptsArray[currentSet]--;
		};
		
		if (parent.activityCompleted) {
			parent.activityCompleted(1, 0);
		} else {
			showFeedback("activity_completed");
		}
		
	} else {
		loadSet(currentSet + 1);
	}
}

function playAudio() {
	audio_play_file(removeFileExt(file_audio[currentSet]), mediaPath);
}

function playAudioInPopUpPanel() {
	audio_play_file(removeFileExt(file_audio[currentTile]), mediaPath);
}

// For homework
function checkAnswers(){
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";
	var answerItemTextArray = [];
	var correctAnswerTextArray = [];

	answerAttemptsArray[currentSet]++;
	
	questionID = currentSet;
	answer = answerResultsArray[currentSet];
	
	var sAnswers = "";
	for (i = 0; i < missingLetterIdsArray.length; i++) {
		sAnswers = sAnswers + (missingLetterIdsArray[i] + ": " + questionWordArray[currentSet].charAt(missingLetterIdsArray[i]).toString() + ", ");
	}
	
	context += $($(xml).find("lang_tl")[currentSet]).text() + " -- ";
	context += sAnswers;
	
	answerAttempts = answerAttemptsArray[currentSet].toString();
	
	// To see attempts - temp
	$("#feedbackText").html("Homework//answerAttemptsArray: " + "<br>"+ answerAttemptsArray.toString());
	
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	$('#feedbackText').show();
}
