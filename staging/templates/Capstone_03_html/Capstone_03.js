$(document).ready(function() {
	audioInit();
	
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedback').hide();

	$('#submitBtn').text("In Process");
	
	// To see the status of answering questions whether they are checked or not.
	$('#submitBtnDiv').hide();

	// Default values (for testing)
	//mediaPath = "sampleData/";
	cssFilename = "styles/Capstone_03_default.css";
	
	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		
		// For performance - homework
		xmlFilename = mediaPath + "vb_02_01_06_03_noNamespaces_hw.xml";
		jsonFilename = mediaPath + "vb_02_01_06_03_noNamespaces_hw.js";
	}
	else {
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
	
	// For assessment
	//xmlFilename = mediaPath + "ad_01_03_05_08_noNamespaces.xml";
	//jsonFilename = mediaPath + "ad_01_03_05_08_noNamespaces.js";
	
	// For performance
	//xmlFilename = mediaPath + "vb_02_01_06_03_noNamespaces.xml";
	//jsonFilename = mediaPath + "vb_02_01_06_03_noNamespaces.js";

	testVideoSupport();
	
	loadjscssfile("../common/css/dlilearn_activities.css", "css");
	loadActivity(parseXml);
});

var numItems;
var numItemsPerSet = 4;

var answerItemArray = [];
var answerItemCheckedArray = [];

// It would be multidimensional array to save checked choices.
var answerItemResultArray = [];

// To check answer status 
// 0: no trial, 1: first incorrect answer, 2: second incorrect answer, 3: correct answer
var answerItemStatusArray = [];  

var activityMode;


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
	numItems = $(xml).find("choice").length;
	numSets = Math.ceil(numItems/numItemsPerSet);
	
	// EXAM for assessment and undefined for performance
	activityMode = $(xml).find("content").attr("mode");
	
	// true for homework and undefined for regular
	homeworkStatus = $(xml).find("content").attr("hw");
	
	// Randomize sets
	$(xml).find("item").each(function(){
		randomizeSet(this);		
	});

	// It would be multidimensional array to save checked choices.
	answerItemArray = new Array(numSets);
	for(var i=0; i<numSets; i++){
		answerItemArray[i] = new Array(numItemsPerSet);
	}
	answerItemCheckedArray = new Array(numSets);
	for(var i=0; i<numSets; i++){
		answerItemCheckedArray[i] = new Array(numItemsPerSet);
	}
	answerItemResultArray = new Array(numSets);
	for(var i=0; i<numSets; i++){
		answerItemResultArray[i] = new Array(numItemsPerSet);
	}
	answerItemStatusArray = new Array(numSets);
	for(var i=0; i<numSets; i++){
		answerItemStatusArray[i] = 0;
	}
	
	if (activityMode=="EXAM"){
		$('#submitBtn').text(answerItemCheckedArray.length + " sets left to be answered before submitting.");
		$('#submitBtn').prop('disabled', true);
	}
	
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
	
	//Load checkboxs
	var choices = document.getElementsByName("choice");
	
	//To show the feedback panel in the initial loading
	$('#feedback').show();
	$('#feedbackHeader').hide();
	$('#feedbackText').hide();
	$('#feedbackBtn').hide();
	
	for(var i  = 1; i<5; i++){
		$('#choiceText_' + i).text(
			$($(xml).find("choice")[(currentSet*numItemsPerSet) + i - 1]).text()
		);
		choices[i-1].value = $($(xml).find("choice")[(currentSet*numItemsPerSet) + i - 1]).attr("crrt");
	}
	
	//Load question
	$('#questionText').text(
		(currentSet+1) + ". " + $($(xml).find("question")[currentSet]).text()
	);

	checkboxUnchecked(currentSet);
	
	//Load video
	playVideoHold(1);
	
	if (!(activityMode=="EXAM")){
		if (answerItemStatusArray[value]>1) {
			$('#checkAnswerBtn').prop('disabled', true);
			$('#checkAnswerBtn').text('Answered');
		}
		else {
			$('#checkAnswerBtn').removeProp('disabled');
			$('#checkAnswerBtn').text('Check Answer');
		}
	}
	else {
		$('#checkAnswerBtnDiv').hide();
		$('#submitBtnDiv').show();
	}
}

function checkboxClick(){
	checkboxStatusCheck(currentSet);
}

function clickCheckAnswerButton(){
	checkboxStatusCheckAfterCheckAnswer(currentSet);
}

function checkboxStatusCheck(setNumber) {
	var choiceCheckboxs = document.getElementsByName ("choice");
	var selected = false;
	var numberOfCorrectAnswers = 0;
	
	for (var i = 0; i < choiceCheckboxs.length; i++) {
		if (choiceCheckboxs[i].checked) {
			selected = true;
		}
		else{
			selected = false;
		}
			
		answerItemArray[setNumber][i] = selected;
		
		if (!choiceCheckboxs[i].value) {
			answerItemResultArray[setNumber][i] = false;
		}
		else{
			answerItemResultArray[setNumber][i] = choiceCheckboxs[i].value;
		}
	}
	
	for (var i = 0; i < numItemsPerSet; i++) {
		if ((answerItemArray[setNumber][i]&&answerItemResultArray[setNumber][i]) || (!answerItemArray[setNumber][i]&&!answerItemResultArray[setNumber][i]) ){
			numberOfCorrectAnswers++;
		}
	}
	
	var checkedNumber = 0;
	var missingSets ="";
		
	for (var i = 0; i < answerItemArray.length; i++) {
		var checkedNumberInSet = 0;
		for (var j = 0; j < answerItemArray[i].length; j++) {
			if (answerItemArray[i][j]){
				checkedNumberInSet++;
			}			
		}
		
		if (checkedNumberInSet>0) {
			checkedNumber++;
		}
		else{
			missingSets = missingSets + (i+1) + ", ";
		}
	}

	$('#submitBtn').text("In Process: " + missingSets);
	
	if (activityMode=="EXAM"){
		if (checkedNumber == answerItemCheckedArray.length){
			$('#submitBtn').text("Submit");
			$('#submitBtn').removeProp('disabled');
			$('#submitBtn').attr('onclick', '{clickSubmitButton();}');
		}
		else{
			var textTemp = "";
			textTemp += (answerItemCheckedArray.length - checkedNumber);
			if (checkedNumber == (answerItemCheckedArray.length - 1)) {
				textTemp += " set ";
			}
			else {
				textTemp += " sets ";
			}
			textTemp += "left to be answered before submitting.";
			$('#submitBtn').text(textTemp);
			$('#submitBtn').prop('disabled', true);
			$('#submitBtn').removeAttr('onclick');
		}
	}
}

function checkboxStatusCheckAfterCheckAnswer(setNumber) {
	var choiceCheckboxs = document.getElementsByName ("choice");
	var selected = false;
	var numberOfCorrectAnswers = 0;
	
	for (var i = 0; i < choiceCheckboxs.length; i++) {
		if (choiceCheckboxs[i].checked) {
			selected = true;
		}
		else{
			selected = false;
		}
			
		answerItemArray[setNumber][i] = selected;
		answerItemCheckedArray[setNumber][i] = selected;
		
		if (!choiceCheckboxs[i].value) {
			answerItemResultArray[setNumber][i] = false;
		}
		else{
			answerItemResultArray[setNumber][i] = choiceCheckboxs[i].value;
		}
	}

	for (var i = 0; i < numItemsPerSet; i++) {
		if ((answerItemCheckedArray[setNumber][i]&&answerItemResultArray[setNumber][i]) || (!answerItemCheckedArray[setNumber][i]&&!answerItemResultArray[setNumber][i]) ){
			numberOfCorrectAnswers++;
		}
	}
	
	if (numberOfCorrectAnswers==numItemsPerSet){
		answerItemStatusArray[setNumber]=3;
	}
	else{
		answerItemStatusArray[setNumber]++;
	}
	
	var feedbackForFirstIncorrectAnswer;
	
	if (numberOfCorrectAnswers<2){
		feedbackForFirstIncorrectAnswer = numberOfCorrectAnswers + " out of " + numItemsPerSet  
					+ " answer is correct. Please, try again.";
	}
	else{
		feedbackForFirstIncorrectAnswer = numberOfCorrectAnswers + " out of " + numItemsPerSet  
					+ " answers are correct. Please, try again.";		
	}
	
	if (!(activityMode=="EXAM")){
		if (answerItemStatusArray[setNumber]==3){
			showFeedback("correct",$($(xml).find("feedback")[currentSet]).text());
			$('#checkAnswerBtn').prop('disabled', true);
			$('#checkAnswerBtn').text('Answered');
		}
		else if (answerItemStatusArray[setNumber]==2){
			for (var i = 0; i < choiceCheckboxs.length; i++) {
				choiceCheckboxs[i].checked = answerItemArray[setNumber][i] = answerItemResultArray[setNumber][i];
			}
			
			answerItemStatusArray[setNumber]++;
		
			showFeedback("incorrect",("Incorrect."));
			$('#checkAnswerBtn').prop('disabled', true);
			$('#checkAnswerBtn').text('Answered');
		}
		else if (answerItemStatusArray[setNumber]==1){
			showFeedback("incorrect",feedbackForFirstIncorrectAnswer);
		}
	}
}

function checkboxUnchecked(setNumber) {
	var choiceCheckboxs = document.getElementsByName ("choice");
	var checkButtonStatus=0;
	
	for (var i = 0; i < numItemsPerSet; i++) {
		if ((answerItemArray[setNumber][i]!=undefined) && ((answerItemArray[setNumber][i]&&answerItemResultArray[setNumber][i]) || (!answerItemCheckedArray[setNumber][i]&&!answerItemResultArray[setNumber][i])) ){
			checkButtonStatus++;
			
		}
	}

	if (!(activityMode=="EXAM")){
		if (answerItemStatusArray[setNumber]<2){
			$('#clickGuard').css('display', 'none');
		}
		else{
			$('#clickGuard').css('display', 'block');
		}
	}

	for (var i = 0; i < choiceCheckboxs.length; i++) {
		if (!answerItemArray[setNumber][i]){
			choiceCheckboxs[i].checked = false;
		}
		else{
			choiceCheckboxs[i].checked = true;
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
	$('#clickGuard').css('height', '500');
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
		if (answerItemStatusArray[currentSet]>1){
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
	
	$('#clickGuard').css('height', '400');
	checkCompleted();
}

var completedFeedbackShown = false;
var finalScore=0;

function checkCompleted(){
	if (!(activityMode=="EXAM")){
	    // For performance
		var totalCheckedNumber = 0;
		var totalCorrectNumber = 0;
			
		for (var i = 0; i < answerItemCheckedArray.length; i++) {
			if (answerItemStatusArray[i]==3) {			 
				totalCheckedNumber++;
			}

			if (answerItemStatusArray[i]==3) {
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
		
		$('#submitBtn').prop('disabled', true);
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
	var correctAnswers = 0;
	
	for (var i = 0; i < answerItemArray.length; i++) {
		var numberOfCorrectAnswersInSet = 0;
		
		for (var j = 0; j < answerItemArray[i].length; j++) {
			if ((answerItemArray[i][j]&&answerItemResultArray[i][j]) || (!answerItemArray[i][j]&&!answerItemResultArray[i][j]) ){
				numberOfCorrectAnswersInSet++;
			}
		}
		
		if (numberOfCorrectAnswersInSet == answerItemArray[i].length) {
			correctAnswers++;
		}
	}

	finalScore =  Math.ceil((correctAnswers/answerItemCheckedArray.length)*100);		

	checkCompleted();
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
	
	if (!(activityMode=="EXAM")) {
		questionID = currentSet;
		
		for(var i=0; i<numItemsPerSet; i++){
			if (answerItemCheckedArray[currentSet][i]){
				answer += $($(xml).find("choice")[(currentSet*numItemsPerSet) + i]).text() + "||";
			}
		}
		
		context += $($(xml).find("question")[currentSet]).text() + " -- ";
		for(var i=0; i<numItemsPerSet; i++){
			if (answerItemResultArray[currentSet][i]){
				context += $('#choiceText_' + (i+1)).text() + "||";
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
			var annswerItemCheckedTemp = "";
			
			correctAnswerTextTemp += $($(xml).find("question")[i]).text() + " -- ";
			
			for (var j=0; j<numItemsPerSet; j++) {
				if (answerItemArray[i][j]) {
					annswerItemCheckedTemp += $($(xml).find("choice")[(i*numItemsPerSet) + j]).text() + "||";
				}
				if ($($(xml).find("choice")[(i*numItemsPerSet) + j]).attr("crrt")) {
					correctAnswerTextTemp += $($(xml).find("choice")[(i*numItemsPerSet) + j]).text() + "||";
				}
			}
			
			answerItemTextArray[i] = annswerItemCheckedTemp;
			correctAnswerTextArray[i] = correctAnswerTextTemp;
		}
		
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
