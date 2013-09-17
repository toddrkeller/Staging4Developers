$(document).ready(function() {
	audioInit();
	
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	$('#feedback').hide();

	$('#submitBtn').text("In Process");
	
	// To see the status of answering questions whether they are checked or not.
	$('#submitBtnDiv').hide();
	
	// Default values (for testing)
	//mediaPath = "sampleData/";
	cssFilename = "styles/Capstone_02_default.css";
	
	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		
		// For assessment - homework
		//xmlFilename = mediaPath + "ad_01_06_11_08_noNamespaces_hw.xml";
		//jsonFilename = mediaPath + "ad_01_06_11_08_noNamespaces_hw.js";
		
		// For performance - homework
		xmlFilename = xmlPath + "vb_02_01_06_02_noNamespaces_hw.xml";
		//jsonFilename = xmlPath + "vb_02_01_06_02_noNamespaces_hw.js";
		
		
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
	}
	
	// For assessment
	//xmlFilename = mediaPath + "ad_01_06_11_08_noNamespaces.xml";
	//jsonFilename = mediaPath + "ad_01_06_11_08_noNamespaces.js";
	
	// For performance
	//xmlFilename = mediaPath + "vb_02_01_06_02_noNamespaces.xml";
	//jsonFilename = mediaPath + "vb_02_01_06_02_noNamespaces.js";
	
	testVideoSupport();
	
	loadActivity(parseXml);
});

var numItems;
var numItemsPerSet = 2;

var answerItemArray = [];
var answerItemCheckedArray = [];
var answerItemResultArray = [];
var activityMode;

var choiceRadioButtonImageCheckedArray = [];
var correctAnswerArray = [];

// For homework
var homeworkStatus;
var answerAttemptsArray = [];

// For homework
String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

function parseXml(t_xml){
	xml = t_xml;

	// EXAM for assessment and undefined for performance
	activityMode = $(xml).find("content").attr("mode");
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	if (!(activityMode=="EXAM")){
		numItems = $(xml).find("question").length;
		numSets = Math.ceil(numItems/1);
	}
	else{
		numItems = $(xml).find("choice").length;
		numSets = Math.ceil(numItems/numItemsPerSet);
	}

	answerItemArray = new Array(numSets);
	answerItemCheckedArray = new Array(numSets);
	answerItemResultArray = new Array(numSets);
	
	choiceRadioButtonImageCheckedArray.length = numItemsPerSet;
	correctAnswerArray = new Array(numItemsPerSet);

	// For homework
	answerAttemptsArray.length = numSets;
	for (var i=0; i<answerAttemptsArray.length; i++){
		answerAttemptsArray[i] = 0;
	}
	
	loadSet(0);
	
	// To integrate into the framework
	$('#prev').click(function () {
		prevClick();
	});
	$('#next').click(function () {
		nextClick();
	});
}

function randomizeSet(xml){
	$(xml).find("choice").shuffle();
}

function nextClick(){
	if(setBtnLock)
		return;

	if(currentSet != numSets - 1){
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(setBtnLock)
		return;
	
	if(currentSet != 0){
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;

function loadSet(value){
	currentSet = value;
	setCompletedShown = false;
	updateSetText();
	
	//To show the feedback panel in the initial loading
	$('#feedback').show();
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	
	if (!(activityMode=="EXAM")){
		for(var i  = 1; i<3; i++){
			if (i==1){
				$('#choiceText_' + i).text("True");
			}
			else{
				$('#choiceText_' + i).text("False");
			}
		}
		if ($($(xml).find("question")[currentSet]).attr("answer")=="true"){
			correctAnswerArray[0] = true;
			correctAnswerArray[1] = false;
		}
		else {
			correctAnswerArray[0] = false;
			correctAnswerArray[1] = true;
		}
	}
	else{
		for(var i  = 1; i<3; i++){
			$('#choiceText_' + i).text(
				$($(xml).find("choice")[(currentSet*numItemsPerSet) + i - 1]).text()
			);
			if ($($(xml).find("choice")[(currentSet*numItemsPerSet) + i - 1]).attr("crrt")){
				correctAnswerArray[i-1] = $($(xml).find("choice")[(currentSet*numItemsPerSet) + i - 1]).attr("crrt");
			}
			else{
				correctAnswerArray[i-1] = false;
			}
		}
	}
	
	//Load question
	$('#questionText').text(
		(currentSet+1) + ". " + $($(xml).find("question")[currentSet]).text()
	);
	
	//Load video
	playVideoHold(1);
	
	//Load radio buttons
	radioButtonImageUnchecked(currentSet);
	
	$('.choice').click(function () {
		var clickedChoice = extractLastNumber($(this).attr("id"));
		for (var i=0; i<4; i++){
			if (i == (clickedChoice-1)){
				$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_on.png');
				choiceRadioButtonImageCheckedArray[i] = true;
			}
			else {
				$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_off.png');
				choiceRadioButtonImageCheckedArray[i] = false;
			}
		}
		radioButtonImageClick();
	});
}

function radioButtonImageClick(){
	radioButtonImageStatusCheck(currentSet);
}

function radioButtonImageStatusCheck(setNumber) {
	var selected = false;
	
	for (var i = 0; i < choiceRadioButtonImageCheckedArray.length; i++) {
		if (choiceRadioButtonImageCheckedArray[i]) {
			selected = true;

			// Inital, undefined
			answerItemArray[setNumber] = i;
			answerItemCheckedArray[setNumber] = selected;
			answerItemResultArray[setNumber] = correctAnswerArray[i];
			
			if (!(activityMode=="EXAM")){
				if (answerItemResultArray[setNumber]){
					// After answering correctly in each set
					// Enable the clickguard
					$('#clickGuard').css('height', '380');
					$('#clickGuard').css('display', 'block');
					$('#clickGuard').css('z-index', '5');
					$('.playBtn').css('z-index', '6');
					
					showFeedback("correct",$($(xml).find("feedback")[currentSet]).text());
				}
				else{
					showFeedback("incorrect",$($(xml).find("hint")[currentSet]).text());
				}
			}
			break;
		}
	}
	
	var checkedNumber = 0;
	var missingSets ="";
	for (var i = 0; i < answerItemCheckedArray.length; i++) {			
		if (answerItemCheckedArray[i]) {
			checkedNumber++;
		}
		else{
			missingSets= missingSets + (i+1) + ", ";
		}
	}

	$('#submitBtn').text("In Process: " + missingSets);
	
	if (checkedNumber == answerItemCheckedArray.length){
		if (activityMode=="EXAM"){
			$('#submitBtn').text("SUBMIT");
			$('#submitBtnDiv').show();
		}
	}
}

function radioButtonImageUnchecked(setNumber) {
	if (!(activityMode=="EXAM")){
		if (!answerItemResultArray[setNumber]){
			$('#clickGuard').css('display', 'none');
		}
		else{
			$('#clickGuard').css('display', 'block');
			$('#feedbackHeader').hide();
			$('#feedbackText').hide();
			$('#feedbackBtn').hide();
			$('#clickGuard').css('height', '380');
		}
	}
	
	for (var i = 0; i < choiceRadioButtonImageCheckedArray.length; i++) {
		if (answerItemCheckedArray[setNumber]==undefined || i!=answerItemArray[setNumber]){
			$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_off.png');
		}
		else{
			$('#choice_img_'+ (i+1)).attr('src', '../common/img/btn_radio_lrg_on.png');
		}
	}
}

function playVideoHold(index){
	var file_video = $($(xml).find("file_video")[currentSet]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideoNoPlayYet(mediaPath, file_video);
}

function playVideo(index){
	var file_video = $($(xml).find("file_video")[currentSet]).text();
	file_video = file_video.substring(0, file_video.lastIndexOf("."));
	loadVideo(mediaPath, file_video);
}

function showFeedback(value, text){
	//Enable the clickguard
	$('#clickGuard').css('height', '480');
	$('#clickGuard').css('display', 'block');
	$('#clickGuard').css('z-index', $('#feedback').css('z-index')-2);
	
	//Clear the dialog box
	$("#feedbackHeader").removeClass('feedbackHeaderColor');
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").addClass('feedbackHeaderColor');
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
			if (activityMode=="EXAM"){
				$("#feedbackText").html("Score: " + text + "%");
			}
			break;
	}
	
	$('#feedbackHeader').show();
	$('#feedbackText').show();
	$('#feedbackBtn').show();
	$('#feedback').show();
}

function closeFeedback(){
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	
	if (activityMode=="EXAM"){
		$('#clickGuard').css('z-index', '6');
		$('#clickGuard').css('display', 'block');
	}
	else{
		if (answerItemResultArray[currentSet]){
			$('#clickGuard').css('display', 'block');
			$('#clickGuard').css('z-index', '5');
			$('.playBtn').css('z-index', '6');
		}
		else{
			$('#clickGuard').css('z-index', '5');
			$('#clickGuard').css('display', 'none');
			$('.playBtn').css('z-index', '6');
		}
	}
	
	$('#clickGuard').css('height', '380');
	checkCompleted();
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

var completedFeedbackShown = false;
var finalScore=0;

function checkCompleted(){
	if (!(activityMode=="EXAM")){
	    // For performance
		var totalCheckedNumber = 0;
		var totalCorrectNumber = 0;
		
		for (var i = 0; i < answerItemCheckedArray.length; i++) {
			if (answerItemCheckedArray[i]) {
				totalCheckedNumber++;
			}
			if (answerItemResultArray[i]) {
				totalCorrectNumber++;
			}
		}
		
		if(totalCorrectNumber==answerItemCheckedArray.length){
			if(completedFeedbackShown){
				return;
			}
			
			completedFeedbackShown = true;
		
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}else{
				clickSubmitButton();
				showFeedback("activity_completed", finalScore);
			}
		}
	}
	else{
    	// For assessment
		if(completedFeedbackShown){
			return;
		}
		
		completedFeedbackShown = true;
		
		//Check to see if we're in a container (such as Gateway)
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("activity_completed", finalScore);
			
			//Enable the clickguard
			$('#clickGuard').css('display', 'block');
		}
	}
	
	// For homework
	if (homeworkStatus) {
		checkAnswers();
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

function clickSubmitButton(){
	var checkedNumber2 = 0;
	var missingSets = "";
	var correctAnswers = 0;
	
	for (var i = 0; i < answerItemCheckedArray.length; i++) {
		if (answerItemCheckedArray[i]) {
			checkedNumber2++;
		}
		else{
			missingSets= missingSets + i + ", ";
		}
		
		if (answerItemResultArray[i]) {
			correctAnswers++;
		}
	}
	
	finalScore =  Math.ceil((correctAnswers/answerItemCheckedArray.length)*100);

	checkCompleted();
}

// For homework
function checkAnswers(){
	answerAttemptsArray[currentSet]++;
	
	var questionID = "";
	var answer = "";
	var context = "";
	var answerAttempts = "";
	
	var answerItemTextArray = [];
	var correctAnswerTextArray = [];
	
	if (!(activityMode=="EXAM")) {
		questionID = currentSet;
		answer = $('#choiceText_' + (answerItemArray[currentSet]+1)).text();
		context += $($(xml).find("question")[currentSet]).text() + " -- ";
		for (var i=0; i<correctAnswerArray.length; i++) {
			if (correctAnswerArray[i]) {
				context += $('#choiceText_' + (i+1)).text();
			}
		}
		answerAttempts = answerAttemptsArray[currentSet].toString();
		
		// To see attempts - temp
		$("#feedbackText").html("Homework//answerAttemptsArray: " + "<br>"+ answerAttemptsArray.toString());
	}
	else {
		answerItemTextArray.length = numSets;
		correctAnswerTextArray.length = numSets;
		
		for (var i=0; i<correctAnswerTextArray.length; i++) {
			var correctAnswerTextTemp = "";
			
			correctAnswerTextTemp += $($(xml).find("question")[i]).text() + " -- ";
		
			for (var j=0; j<numItemsPerSet; j++) {
				if (j == answerItemArray[i]) {
					answerItemTextArray[i] = $($(xml).find("choice")[(i*numItemsPerSet) + j]).text();
				}
				if ($($(xml).find("choice")[(i*numItemsPerSet) + j]).attr("crrt")) {
					correctAnswerTextTemp += $($(xml).find("choice")[(i*numItemsPerSet) + j]).text();
				}
			}
			
			correctAnswerTextArray[i] = correctAnswerTextTemp;
		}
		
		
		//answer = answerItemCheckedArray;
		//context = answerItemResultArray;
		
		//answer = answerItemTextArray.length;
		//context = correctAnswerTextArray.length;
		
		answer = answerItemTextArray;
		context = correctAnswerTextArray;
		
		
		
		answerAttempts = "Score: " + finalScore + "%";
		
		// To see a score for assessment - temp
		$("#feedbackText").html("Assessment HW// " + answerAttempts);
	}
	
	// To pass logs
	logStudentAnswer(questionID, answer, context);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
	$('#feedbackText').show();
}


