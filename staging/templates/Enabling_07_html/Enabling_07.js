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
	
	//Create drop targets	
	$( "#drop").droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction}); 
	
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = mediaPath + "Enabling_07_sample.xml";
		jsonFilename = mediaPath + "Enabling_07_sample.js";
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
	cssFilename = "styles/enabling_07_dlilearn.css";
	loadActivity(parseXml);
	
	/*if(params["debug"] != null){
		showAnswers = true;
	}*/
}); 

var jContent;

function parseXml(t_xml){
	xml = t_xml;
	
	//Zero out values
	$(xml).find("section").attr("currentExchangeIndex", "0");
	$(xml).find("section").attr("numberOfExchangesSolved", "0");
	$(xml).find("item").attr("timesIncorrect", "0");
	jContent = $($(xml).find("content")[0]);
	jContent.attr("numberOfConversationsSolved", "0");
	jContent.attr("currentConversationIndex", "0");
	
	//Load randomized array
	for(i=0 ; i< $(xml).find("section").length ; i++){
		randomizedPlayBtnsArr[i] = [];
		
		for(j=0; j < $($(xml).find("section")[i]).find("item").length; j++){
			randomizedPlayBtnsArr[i][j] = shuffleArray([0,1,2]);
		}
		
	}
	
	loadConversation(0);
}


var exchangeSolvedToggle = false;
var conversationSolvedToggle = false;
var activityCompletionShown = false;

var jSection;
var jItem;

var randomizedPlayBtnsArr = [];

function resetPlayBtns(){
	$("#playBtn0").attr("style", "position: relative;");
    $('#playBtn0').removeClass("dropPlayBtn0");
	$("#playBtn1").attr("style", "position: relative;");
    $('#playBtn1').removeClass("dropPlayBtn1");
	$("#playBtn2").attr("style", "position: relative;");
    $('#playBtn2').removeClass("dropPlayBtn2");
}

function positionPlayBtn(index){
    //$('#playBtn' + index).removeClass("playBtn");
    $('#playBtn' + index).addClass("dropPlayBtn" + index);
}

var dragging = false;
function draggingFunction(){
	dragging = true;
}

function draggingStopFunction(){
	dragging = false;
}

function dropFunction(event, ui ){	
	dragging = false;
	
	showClickGuard();

	var dragBtnIndex = extractLastNumber(ui.draggable.attr("id"));
	
	var indexNum = jQuery.inArray(0, 
			randomizedPlayBtnsArr[jContent.attr("currentConversationIndex")]
					[parseInt(jSection.attr("currentExchangeIndex"))]);
	
	if(dragBtnIndex == indexNum){
		ui.draggable.draggable({ revert: false });
		
		resetPlayBtns();
		positionPlayBtn(dragBtnIndex);
	
		exchangeSolved();
		showFeedback("correct", $(jItem.find("feedback")).text());
	}else{
		if(parseInt($(jItem).attr("timesIncorrect")) == 1){
			//Auto solve exchange
			autoPlaceCorrectBubble();
		}else{
			$(jItem).attr("timesIncorrect", 
				parseInt($(jItem).attr("timesIncorrect")) + 1);
			showFeedback("incorrect", $(jItem.find("hint")).text());
		}	
	}
}	

function showPlayBtns(){
	$("#playBtn_container").css("display","inline-block");
}

function hidePlayBtns(){
	$("#playBtn_container").css("display","none");
}

function showVideoStage(){
	$("#videoStage").css("display","block");
	$("#feedback").css("display","none");
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
	resetPlayBtns();
	var indexNum = jQuery.inArray(0, 
			randomizedPlayBtnsArr[jContent.attr("currentConversationIndex")]
					[parseInt(jSection.attr("currentExchangeIndex"))]);
	
	positionPlayBtn(indexNum);
	autoPlaceCorrectBubble_ended(); //todo animate this
}

function autoPlaceCorrectBubble_ended(){
	exchangeSolved();
	showFeedback("incorrect", $(jItem.find("feedback")).text());
}

function exchangeSolved(){
	exchangeSolvedToggle = true;
	
	jSection.attr("numberOfExchangesSolved", 
		parseInt(jSection.attr("numberOfExchangesSolved")) + 1);
}

function checkConversationCompleted(){
}

function loadConversation(value){
	jContent.attr("currentConversationIndex", value);
	jSection = $($(xml).find("section")[value]);
	
	hideStageClickGuard();
	
	
	if(parseInt(jSection.attr("numberOfExchangesSolved")) < 
				jSection.find("item").length){
		loadExchange(0); 
		hideVideoStage();
	}else{
		hidePlayBtns();
		showVideoStage();
		loadLinksAndArrows();
		activityVideoPlay();	
	}
}

function loadExchange(value){
	showPlayBtns();
	
	jSection.attr("currentExchangeIndex", value);
	
	resetPlayBtns();
	
	//Recreate the drag elements 
	$('.playBtn').draggable({ revert: true , 
								//stack: "div",
								distance: 20,
								drag: draggingFunction,
								stop: draggingStopFunction});
	
	jItem = $(jSection.find("item")[value]);
	
	//load image
	$("#stageImg").attr("src", mediaPath + "png/" + $(jItem.find("image")).text());
	
	//load the captions
	$("#caption_1_text").text($(jItem.find("tl_prompt_text")).text());
	$("#caption_2_text").text($(jItem.find("tl_response_text")).text());

	//load drag bubbles if present
	if(parseInt(jSection.attr("numberOfExchangesSolved")) > 
						jSection.attr("currentExchangeIndex")){
		//The exchange has been completed
		showStageClickGuard();
		
		//todo- find the index of the right bubble and set the possition
		var indexNum = jQuery.inArray(0, 
			randomizedPlayBtnsArr[jContent.attr("currentConversationIndex")]
					[parseInt(jSection.attr("currentExchangeIndex"))]);
		 
		 $('#playBtn' + indexNum).addClass("dropPlayBtn" + indexNum);	
		 
	}else{
		//The exchange isn't completed
		hideStageClickGuard();
	}
	
	loadLinksAndArrows();	
}



function loadItem(){
}


function playBtnUp(value){
	if(!dragging){
		//alert("hi");
		
		var file_audio;

		var trueIndex = randomizedPlayBtnsArr[jContent.attr("currentConversationIndex")]
											[jSection.attr("currentExchangeIndex")][value];
		
		switch(trueIndex){
			case 0:
				file_audio = $(jItem.find("tl_response_audio")).text();
				break;
			case 1:
				file_audio = $(jItem.find("distractor1_audio")).text();
				break;
			case 2:
				file_audio = $(jItem.find("distractor2_audio")).text();
				break;
		}
		
		audio_play_file(removeFileExt(file_audio), mediaPath);		
	}

}

function exchangeAudioPlay(){
	//add event listener for audio finished
	var file_audio = $(jItem.find("tl_response_audio")).text();
	audio_play_file(removeFileExt(file_audio), mediaPath );
	
	//todo fix this
	document.getElementById('audioPlayer').addEventListener('ended', exchangeAudioEnded);
	document.getElementById('audioPlayer').play();
}

function exchangeAudioEnded(){
	if(conversationSolvedToggle){
		//We're at the last exchange so play movie
		jSection.attr("completed","true");	
		
		showVideoStage();
		
		hidePlayBtns();
		
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
	jSection.attr("currentExchangeIndex", 
		parseInt(jSection.attr("currentExchangeIndex")) + 1);
		
	loadExchange(jSection.attr("currentExchangeIndex"));
}

function activityVideoPlay(){
	//add event listener for video finished
	showClickGuard();
	
	var file_video = $(jSection.find("video")).text();
	loadVideoNoPlayYet(mediaPath, removeFileExt(file_video), "Enabling_07");
	
	document.getElementById('videoTag').addEventListener('ended', activityVideoCompleted);
	document.getElementById('videoTag').play();
}

function activityVideoCompleted(){
	hideClickGuard();

	if(conversationSolvedToggle){
		conversationSolvedToggle = false;
		
		if(parseInt(jContent.attr("numberOfConversationsSolved")) ==
					$(xml).find("section").length && !activityCompletionShown){		
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
			$(xml).find("section").length != 
			parseInt(jContent.attr("numberOfConversationsSolved"))){
		showConversationArrow();
	}else{
		hideConversationArrow();
	}
	
	if(parseInt(jSection.attr("currentExchangeIndex")) < 
			parseInt(jSection.attr("numberOfExchangesSolved")) &&
			jSection.find("item").length != 
			parseInt(jSection.attr("numberOfExchangesSolved"))){
		showExchangeArrow();
	}else{
		hideExchangeArrow();
	}
	
	
	
	for(var i=0; i < $(xml).find("section").length; i++){
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
		if(i != $(xml).find("section").length - 1){
			conversationLinksHtml = conversationLinksHtml + 
							"<span class='linkSpan'> </span>"
			
		}
	}
	
	$("#conversationLinks").html(conversationLinksHtml);
	
	
	var exchangeLinksHtml = "";
	
	if(parseInt(jContent.attr("currentConversationIndex")) == 
			parseInt(jContent.attr("numberOfConversationsSolved"))&&
			$(xml).find("section").length != 
			parseInt(jContent.attr("numberOfConversationsSolved"))){
		
		showExchangeTally();
		
		for(var i=0; i < jSection.find("item").length; i++){
			if(i == jSection.attr("currentExchangeIndex")){
				exchangeLinksHtml = exchangeLinksHtml + 
					constructUnselectableLinkHighlighted(i);
			}else if(i <= jSection.attr("numberOfExchangesSolved") ){
				//load selectable text
				exchangeLinksHtml = exchangeLinksHtml + 
					constructSelectableLink(i, "exchange");
			}else{
				//load unselectable text
				exchangeLinksHtml = exchangeLinksHtml + 
					constructUnselectableLink(i);
			}
			
			//Don't add a "|" to the end if the last element 
			if(i != jSection.find("item").length - 1){
				exchangeLinksHtml = exchangeLinksHtml + 
								"<span class='linkSpan'> </span>"
				
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
		
		if(parseInt(jSection.attr("numberOfExchangesSolved")) == 
				jSection.find("item").length){ 
			//The last exchange was solved so play video and 
			//  incriment the conversations solved count
			conversationSolvedToggle = true;
			
			jContent.attr("numberOfConversationsSolved", 
				parseInt(jContent.attr("numberOfConversationsSolved")) + 1);
			
			exchangeAudioPlay();
		}else{
			exchangeAudioPlay();
		}
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
