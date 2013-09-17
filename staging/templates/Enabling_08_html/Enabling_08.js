$(document).ready(function() {
	audioInit();
	testVideoSupport();
	
	hideClickGuard();
	hideStageClickGuard();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();
	
	if(document.getElementById('audioPlayer').play == undefined){
		alert("This activity must be run in a browser that support HTML 5. " +
				"HTML 5 support was not detected.");
	}
	
	forceVidType = "html";
	
	//tod - add 2 tries per letter


	//Default values (for testing)
	mediaPath = "sampleData/";
	cssFilename = "styles/Enabling_08.css";
	xmlFilename = mediaPath + "Enabling_08_sampleData.xml";
	jsonFilename = mediaPath + "Enabling_08_sampleData.js";
	
	loadActivity(parseXml);
	
	g_dontStart = true;
	
	/*if(params["debug"] != null){
		showAnswers = true;
	}*/
}); 

var jContent;


function startButtonDown(){
	$("#startButton").removeClass("startButton");
	$(".dropTarget").css("opacity", "1");
	$("#letter_container").removeClass("invisible");
	
	playAudio();
}

function parseXml(t_xml){
	xml = t_xml;
	
	//Zero out values
	$(xml).find("session").attr("currentExchangeIndex", "0");
	$(xml).find("session").attr("numberOfExchangesSolved", "0");
	$(xml).find("item").attr("timesIncorrect", "0");
	jContent = $($(xml).find("content")[0]);
	jContent.attr("numberOfConversationsSolved", "0");
	jContent.attr("currentConversationIndex", "0");
	
	//Load randomized array
	for(i=0 ; i< $(xml).find("session").length ; i++){
		randomizedBtnArray[i] = [];
		
		for(j=0; j < $($(xml).find("session")[i]).find("item").length; j++){
			
			//generate an array
			var tempArr = $($($(xml).find("session")[i]).find("item")[j])
				.find("lang_tl_a_characters").text().split("||");
			
			for(var k = 0; k < tempArr.length; k++){
				tempArr[k] = k;
			}	
			
			randomizedBtnArray[i][j] = shuffleArray(tempArr);
		}
		
	}
	
	//We need to find a way to test if the browser supports
	//the 'ended' event. It appears that you actually have to load
	//an audio file and play it, then test the 
	//document.getElementById('audioPlayer').ended value to be true.
	//This is just for testing.
	//document.getElementById('audioPlayer').addEventListener('ended', exchangeAudioEnded);
	//audio_play_file("1", mediaPath );
	
	loadConversation(0);
}


var exchangeSolvedToggle = false;
var conversationSolvedToggle = false;
var activityCompletionShown = false;

var jSession;
var jItem;

var randomizedBtnArray = [];

var dragging = false;
function draggingFunction(){
	dragging = true;
}

function draggingStopFunction(){
	dragging = false;
}

var letterIncorrectArray = [];

function dropFunction(event, ui ){	
	dragging = false;
	
	var dragBtnLetter = ui.draggable.text().toLowerCase();
	
	var dragBtnComponent = ui.draggable;
	
	var dropBtnIndex = extractLastNumber($(this).attr("id"));
	
	var dropBtnLetter = $(jItem.find("lang_tl_a_word_text")).text().
										split("||")[dropBtnIndex].toLowerCase();
	
	var correctLetterDropped = false;
	
	if(dropBtnLetter == dragBtnLetter){
		//correct letter landed
		correctLetterDropped = true;
	}else{
		//check the number or times
		letterIncorrectArray[dropBtnIndex] = letterIncorrectArray[dropBtnIndex] + 1;
		
		if(letterIncorrectArray[dropBtnIndex] == 2){
			//find the first letter index that matches
			var tally =  0;
			$(".letter").each(function(){
				if($(this).text() == dropBtnLetter && !$(this).hasClass('invisible')){
					dragBtnComponent = this;
					return false;
				}
			});
			
			correctLetterDropped = true;
		}
	}
	
	if(correctLetterDropped){
		$(dragBtnComponent).draggable({ revert: false });
		$(dragBtnComponent).addClass("invisible");
		
		$(this).droppable( "disable" );
		$(this).removeClass("dropLetterNotPlaced");
		
		//Check if we should capitalize the letter
		if(dropBtnIndex == 0 && ($("#phraseStart").text().length == 0 ||
			$("#phraseStart").text().match(/[.?!]\s*$/g) != undefined)){
			$(this).text(dropBtnLetter.toUpperCase());
		}else{
			$(this).text(dropBtnLetter);
		}
		
		if($(".dropLetterNotPlaced").length == 0){
			exchangeSolved(); 
			showFeedback("correct", $(jItem.find("feedback1")).text());
		}		
	}
}	


function showVideoStage(){
	$("#videoStage").css("display","block");
	$("#feedback").css("display","none");
	$("#letter_container").addClass("invisible");
}

function hideVideoStage(){
	$("#videoStage").css("display","none");
	$("#feedback").css("display","block");
}

function showExchangeTally(){
	$("#exchangeTally_container").css("display","block");
}

function hideExchangeTally(){
	$("#exchangeTally_container").css("display","none");
}

function showClickGuard(){
	$("#clickGuard").css("display","block");
}

function hideClickGuard(){
	$("#clickGuard").css("display","none");
}

function showStageClickGuard(){
	$("#stageClickGuard").css("display","block");
}

function hideStageClickGuard(){
	$("#stageClickGuard").css("display","none");
}

function autoPlaceCorrectBubble(){
	var indexNum = jQuery.inArray(0, 
			randomizedBtnArray[jContent.attr("currentConversationIndex")]
					[parseInt(jSession.attr("currentExchangeIndex"))]);
	
	autoPlaceCorrectBubble_ended(); //todo animate this
}

function autoPlaceCorrectBubble_ended(){
	exchangeSolved();
	showFeedback("incorrect", $(jItem.find("feedback1")).text());
}



function exchangeSolved(){
	exchangeSolvedToggle = true;
	
	jSession.attr("numberOfExchangesSolved", 
		parseInt(jSession.attr("numberOfExchangesSolved")) + 1);
}

function checkConversationCompleted(){
}

function loadConversation(value){
	jContent.attr("currentConversationIndex", value);
	jSession = $($(xml).find("session")[value]);
	
	hideStageClickGuard();
	
	
	if(parseInt(jSession.attr("numberOfExchangesSolved")) < 
				jSession.find("item").length){
		loadExchange(0); 
		hideVideoStage();
	}else{
		showVideoStage();
		loadLinksAndArrows();
		activityVideoPlay();	
	}
}

function playAudio(){
	var file_audio = $(jItem.find("lang_tl_a_phrase_audio")).text();
	audio_play_file(removeFileExt(file_audio), mediaPath );
	document.getElementById('audioPlayer').play();
}

function loadExchange(value){
	$("#answerDiv").text("");
	$("#drop_container").css("display", "block");
	$("#playBtnAudio").css("display", "inline-block");
	$("#letter_container").addClass("invisible");
	
	jSession.attr("currentExchangeIndex", value);
	
	jItem = $(jSession.find("item")[value]);
	
	//load image
	$("#stageImg").attr("src", mediaPath + "png/" + $(jItem.find("image")).text());
	
	//load the captions
	$("#caption_2_text").text(
		$(jItem.find("lang_tl_b_phrase_text")).text().replace(/\|\|/g," "));

	//The exchange isn't completed
	hideStageClickGuard();
	
	//Load drops
	$("#startButton").addClass("startButton");
	var wordLetterArray = $(jItem.find("lang_tl_a_word_text")).text().split("||");
	var outputDrops =  "";
	
	for(var i=0; i<wordLetterArray.length; i++){
		//Reset letter incorrect Array
		letterIncorrectArray[i] = 0;
	
		//Construct dropTarget snippet
		outputDrops = outputDrops + '<div id="dropTarget' + i + 
					'" class="dropTarget roundCornersLetter captionText invisible dropLetterNotPlaced">-</div>';
	}

	$("#startButton").html('<div id="answerDiv"></div><div id="drop_container">' 
						+ outputDrops + "</div>");
 

	//Load text before and after drop
	var phraseArray = $(jItem.find("lang_tl_a_phrase_text")).text().split("||");
	var phraseStart = "";
	var wordOrder = parseInt($(jItem.find("lang_tl_a_word_order")).text());
	
	for(i=0 ; i < wordOrder - 1; i++){
		phraseStart = phraseStart + phraseArray[i] + " ";
	}
	$("#phraseStart").text(phraseStart);
	
	var phraseEnd = "";
	for(i=0 ; i < phraseArray.length - wordOrder ; i++){
		phraseEnd = phraseEnd + phraseArray[wordOrder + i] + " ";
	}
	$("#phraseEnd").text(phraseEnd);
			
	//Load drags
	var letterArray = $(jItem.find("lang_tl_a_characters")).text().split("||");
	var outputButtons =  "";
	
	//Need to load them in a random fashion
	for(var i=0; i < randomizedBtnArray[jContent.attr("currentConversationIndex")]
						[jSession.attr("currentExchangeIndex")].length; i++){
							
		var realIndex = randomizedBtnArray[jContent.attr("currentConversationIndex")]
							[jSession.attr("currentExchangeIndex")][i];
							
		outputButtons = outputButtons + '<div id="letter' + i + '" class="letter roundCornersLetter">' + 
						 letterArray[realIndex].toLowerCase() + 
					'</div>';
	}
	
	$("#letter_container").html(outputButtons);
	
	//Refresh drag and drop components
	$( ".dropTarget").droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction}); 

	$('.letter').draggable({ revert: true , 
						//stack: "div",
						distance: 20,
						drag: draggingFunction,
						stop: draggingStopFunction});
	
	//load drag bubbles if present
	if(parseInt(jSession.attr("numberOfExchangesSolved")) > 
						jSession.attr("currentExchangeIndex")){
		//The exchange has been completed
		showStageClickGuard();
		
		var answerDivText = $(jItem.find("lang_tl_a_word_text")).text().replace(/[|][|]/g, "");

		if($("#phraseStart").text().length == 0 ||
			$("#phraseStart").text().match(/[.?!]\s*$/g) != undefined){
			
			var firstLetter = answerDivText.substring(0,1).toUpperCase();
			var theRest = answerDivText.substring(1);
			answerDivText = firstLetter + theRest;
		}
		
		$("#answerDiv").text(answerDivText);
		$("#drop_container").css("display", "none");
		$("#playBtnAudio").css("display", "none");
	}
	
	loadLinksAndArrows();	
}

function exchangeAudioPlay(){
	var file_audio = $(jItem.find("lang_tl_a_phrase_audio")).text();
	audio_play_file(removeFileExt(file_audio), mediaPath );
	
	//add event listener for audio finished
	document.getElementById('audioPlayer').addEventListener('ended', exchangeAudioEnded);
	document.getElementById('audioPlayer').play();
}

function exchangeAudioEnded(){
	var file_audio = $(jItem.find("lang_tl_b_phrase_audio")).text();
	audio_play_file(removeFileExt(file_audio), mediaPath );

	//add event listener for audio finished
	document.getElementById('audioPlayer').addEventListener('ended', exchangeAudioEnded2);
	document.getElementById('audioPlayer').play();
}

function exchangeAudioEnded2(){

	if(conversationSolvedToggle){
		//We're at the last exchange so play movie
		jSession.attr("completed","true");
		
		showVideoStage();
		hideStageClickGuard();	
		activityVideoPlay();	
	}
	
	loadLinksAndArrows();
}

function showConversationArrow(){
	$("#conversationArrow").removeClass("hidden");
}

function showExchangeArrow(){
	$("#exchangeArrow").removeClass("hidden");
}

function hideConversationArrow(){
	$("#conversationArrow").addClass("hidden");
}

function hideExchangeArrow(){
	$("#exchangeArrow").addClass("hidden");
}


function conversationArrowPressed(){
	jContent.attr("currentConversationIndex",
		parseInt(jContent.attr("currentConversationIndex")) + 1);
	
	loadConversation(jContent.attr("currentConversationIndex"));
}

function exchangeArrowPressed(){
	jSession.attr("currentExchangeIndex", 
		parseInt(jSession.attr("currentExchangeIndex")) + 1);
		
	loadExchange(jSession.attr("currentExchangeIndex"));
}

function activityVideoPlay(){
	//add event listener for video finished
	showClickGuard();
	
	var file_video = $(jSession.find("video")).text();
	loadVideoNoPlayYet(mediaPath, removeFileExt(file_video), "Enabling_08");
	
	document.getElementById('videoTag').addEventListener('ended', activityVideoCompleted);
	document.getElementById('videoTag').play();
}

function activityVideoCompleted(){
	hideClickGuard();

	if(conversationSolvedToggle){
		conversationSolvedToggle = false;
		
		if(parseInt(jContent.attr("numberOfConversationsSolved")) ==
					$(xml).find("session").length && !activityCompletionShown){		
				completed();
				loadLinksAndArrows();
		}else{
			loadLinksAndArrows();	
		}	
	}
}



function loadLinksAndArrows(){
	var conversationLinksHtml = "";
	
	if(parseInt(jContent.attr("currentConversationIndex")) < 
			parseInt(jContent.attr("numberOfConversationsSolved")) &&
			$(xml).find("session").length != 
			parseInt(jContent.attr("numberOfConversationsSolved"))){
		showConversationArrow();
	}else{
		hideConversationArrow();
	}
	
	if(parseInt(jSession.attr("currentExchangeIndex")) < 
			parseInt(jSession.attr("numberOfExchangesSolved")) &&
			jSession.find("item").length != 
			parseInt(jSession.attr("numberOfExchangesSolved"))){
		showExchangeArrow();
	}else{
		hideExchangeArrow();
	}
	
	
	
	for(var i=0; i < $(xml).find("session").length; i++){
		if(i == parseInt(jContent.attr("currentConversationIndex"))){
			conversationLinksHtml = conversationLinksHtml + 
				constructUnselectableLinkHighlighted(i);
		}else if(i <= parseInt(jContent.attr("numberOfConversationsSolved"))){
			//load selectable text
			conversationLinksHtml = conversationLinksHtml + 
				constructSelectableLink(i, "conversation");
		}else{
			//load unselectable text
			conversationLinksHtml = conversationLinksHtml + 
				constructUnselectableLink(i);
		}
		
		//Don't add a "|" to the end if the last element 
		if(i != $(xml).find("session").length - 1){
			conversationLinksHtml = conversationLinksHtml + 
							"<span class='linkSpan'>|</span>"
			
		}
	}
	
	$("#conversationLinks").html(conversationLinksHtml);
	
	
	var exchangeLinksHtml = "";
	
	if(parseInt(jContent.attr("currentConversationIndex")) == 
			parseInt(jContent.attr("numberOfConversationsSolved"))&&
			$(xml).find("session").length != 
			parseInt(jContent.attr("numberOfConversationsSolved"))){
		
		showExchangeTally();
		
		for(var i=0; i < jSession.find("item").length; i++){
			if(i == jSession.attr("currentExchangeIndex")){
				exchangeLinksHtml = exchangeLinksHtml + 
					constructUnselectableLinkHighlighted(i);
			}else if(i <= jSession.attr("numberOfExchangesSolved") ){
				//load selectable text
				exchangeLinksHtml = exchangeLinksHtml + 
					constructSelectableLink(i, "exchange");
			}else{
				//load unselectable text
				exchangeLinksHtml = exchangeLinksHtml + 
					constructUnselectableLink(i);
			}
			
			//Don't add a "|" to the end if the last element 
			if(i != jSession.find("item").length - 1){
				exchangeLinksHtml = exchangeLinksHtml + 
								"<span class='linkSpan'>|</span>"
				
			}
			
		}
	}else{
		hideExchangeTally();
	}
	
	$("#exchangeLinks").html(exchangeLinksHtml);
}

function constructUnselectableLink(value){
	return "<div class='linkClass'>" + (value + 1) + "</div>"; 	
}

function constructUnselectableLinkHighlighted(value){
	return "<div class='linkClassHighlighted'>" + (value + 1) +"</div>"; 	
}

function constructSelectableLink(value, type){
	return "<div class='roundCorners linkClass'>" +  
				'<a href="javascript:;" ' + 
					" onMouseOut='linkOut(" + value + ", \"" + type + "\")' " + 
					" onMouseOver='linkOver(" + value + ", \"" + type + "\")' " +
					" onMouseDown='linkClicked(" + value + ", \"" + type + "\")' " +
					' onMouseUp="" > ' +
					(value + 1) +
				'</a>' +
			"</div>"; 
}

function linkOver(value, type){
	$(this).addClass("linkOver");
}

function linkOut(value, type){
	$(this).removeClass("linkOver");
}

function linkClicked(value, type){
	switch(type){
		case "exchange":
			loadExchange(value);
			break;
		case "conversation":
			loadConversation(value);
			break;
	}
}

function checkCompleted(){
}

function completed(){
	if(parent.activityCompleted){
		parent.activityCompleted(1,0);
	}else{
		activityCompletionShown = true;
		showClickGuard();
		showFeedback("activity_completed");
	}
}

function showFeedback(value, text){
	showClickGuard();
	
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_incorrect.png">');
			$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html(
					'<img src="../common/img/feedback_correct.png">');
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
			$("#feedbackBtn").css("height", "55px");
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


function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#clickGuard").css("display","none");
	$("#feedbackButtonImgContainer").html("");

	hideClickGuard();

	if(exchangeSolvedToggle){
		exchangeSolvedToggle = false;
		
		showStageClickGuard();
		
		if(parseInt(jSession.attr("numberOfExchangesSolved")) == 
				jSession.find("item").length){ 
			//todo clean this up		
					
			//The last exchange was solved so play video and 
			//  incriment the conversations solved count
			conversationSolvedToggle = true;
			
			jContent.attr("numberOfConversationsSolved", 
				parseInt(jContent.attr("numberOfConversationsSolved")) + 1);
		}
		
		exchangeAudioPlay();
	}
}
