var currentSet = 0;
var currentQuestionIndex = 0;
var currentAudio = "";
var itemTotal = 0;
var itemXML;
var textDirection = "LeftToRight";
var activityItems = new Array();
var questionSets = new Array();

$(document).ready(function() {	
	$('#feedbackBox').hide();

	if ( getPassedParameters() == false)
	{
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		xmlFilename = xmlPath + "enabling57_sample.xml";
		jsonFilename = xmlPath + "enabling57_sample.js";
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

	cssFilename = "styles/Enabling_57.css";
	keyboardFilename = "../common/keyboards/test_keyboard.js";
	audioInit();
	loadActivity(parseXml);  // loads any url parameter values then calls parseXml

}); 

String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

//parse xml
function parseXml(t_xml){
	xml = t_xml;
	numSets = 5;
	initializeSets($(xml).find("set").length, function() {
		loadSet(0);
	});
}

function initializeSets(setCount, callback)
{
	tableTitle_en = $(xml).find("title").find("english").text();
	tableTitle_tl = $(xml).find("title").find("trans").text();

	setTitles(tableTitle_en, tableTitle_tl);

	for (var i = 0; i < setCount; i++)
	{
		var thisSet = $(xml).find("set")[i];
		var activityItem = new ActivityItem(thisSet, i);
		activityItems.push(activityItem);
	}

	shuffleArray( activityItems );
	buildQuestionSets();

	if (typeof callback == "function") callback();
}

function buildQuestionSets()
{
	// array is already shuffled so pick four items off the top
	for (var i = 0; i < 4; i++)
	{
		var questionSet = new QuestionSet(activityItems[i]);
		questionSets.push(questionSet);
	}

	for (var i = 0; i < questionSets.length; i++)
	{
		questionSets[i].addDistractors(activityItems); 
	}
}

function loadSet(setIndex)
{
	closeFeedback();
	currentSet = setIndex;  // required
	if (setIndex == 0)
	{
		showReview();
		$("#gotoQuestions").html("Go To Questions");
		$("#gotoQuestions").on('click', function() {
			loadSet(currentQuestionIndex == 0 ? 1 : currentQuestionIndex);
		});
	}
	else
	{
		showQuestion(setIndex);
		$("#gotoQuestions").html("Review");
		$("#gotoQuestions").bind('click', function() {
			loadSet(0);
		});
	}


	updateSetNavText();
	// updateNavButtons();
	//setScenarioTitles(activitySets[setIndex]);
	//showScenarioTable(activitySets[setIndex]);
}

function makeSelection(selectedObj)
{
	$("input:radio").attr("checked", false);
	if (questionSets[currentSet-1].frozen) return; 

	questionSets[currentSet-1].hitCount++;
	var selectedAnswer = $(selectedObj).attr("answerIndex");
	var correctAnswer = questionSets[currentSet-1].correctActivityObj.index;
	$(selectedObj).find("input:radio").attr("checked", true);

	// flag the question item as selected
	questionSets[currentSet-1].setSelected(selectedAnswer);
	showMarkedAnswer(selectedObj, selectedAnswer == correctAnswer);
	
	var context = questionSets[currentSet-1].correctActivityObj.question;
	var answerText = $(selectedObj).text();
	logStudentAnswer(currentSet, answerText, context);
	logStudentAnswerAttempts(currentSet, questionSets[currentSet-1].hitCount);


	if (selectedAnswer == correctAnswer)
	{
		// answered correct
		if (checkActivityComplete())
		{
			showFeedback("activity_completed", questionSets[currentSet-1].correctActivityObj.feedback);
			parent.framework.ActivityComplete();
		}
		else
		{
			showFeedback("correct", questionSets[currentSet-1].correctActivityObj.feedback);
		}
	}
	else if (questionSets[currentSet-1].hitCount > 1)
	{
		// answered incorrect, but they've tried too many times
		questionSets[currentSet-1].setSelected(correctAnswer);
		var correctObj = $(".answer[answerIndex='{0}']".format(correctAnswer));
		showMarkedAnswer(correctObj, true);

		if (checkActivityComplete())
		{
			parent.framework.ActivityComplete();
			showFeedback("activity_completed", questionSets[currentSet-1].correctActivityObj.feedback);
		}
		else
			showFeedback("incorrect", questionSets[currentSet-1].correctActivityObj.feedback);
	
		return;
	}
	else if (questionSets[currentSet-1].hitCount == 1)
	{
		// show hint
		showFeedback("incorrect", questionSets[currentSet-1].correctActivityObj.hint);
	}


}

function prevSet(targetSet)
{
	var targetSet = currentSet-1;

	if (targetSet == 0) return;

	if (targetSet == 1)
	{
		// disable prev button
		//$("#prevLabel").on("click", function(event) {});
		$("#prevLabel").addClass("disabled");
	}
	else
	{
		//$("#prevLabel").on("click", function(event) {prevSet()});
		$("#prevLabel").removeClass("disabled");
	}

	$("#nextLabel").removeClass("disabled");
	loadSet(targetSet);
}

function nextSet(targetSet)
{
	var targetSet = currentSet+1;
	if (targetSet > questionSets.length) return;

	if (targetSet == questionSets.length)
	{
		// disable prev button
		//$("#nextLabel").on("click", function(event) {});
		$("#nextLabel").addClass("disabled");
	}
	else
	{
		//$("#nextLabel").on("click", function(event) {nextSet()});
		$("#nextLabel").removeClass("disabled");
	}

	$("#prevLabel").removeClass("disabled");
	loadSet(targetSet);
}

function checkActivityComplete()
{
	var completeCount = 0;
	for (var i = 0; i < questionSets.length; i++)
		if (questionSets[i].frozen) completeCount++;

	return completeCount >= questionSets.length;
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