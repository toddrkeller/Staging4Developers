var setXml;

$(document).ready(function() {
	audioInit();
	
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$('#feedback').show();
	$("#feedbackBtn").hide();

	btnCG_orig = $("#buttonGuard").css("z-index");
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";
		cssFilename = "styles/enabling_02_dlilearn.css";
		xmlFilename = "sampleData/example2.xml";
		jsonFilename = "sampleData/example2.js";
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

	cssFilename = "styles/enabling_02_dlilearn.css";
	loadActivity(parseXml);
});

function dropFunction(event, ui ) {
	var dropTargetNumLookingFor = ui.draggable.data( 'dropTargetNum' );
	var dropTargetNumGot = $(this).data( 'dropTargetNum' );
	
	var correctText = $('#dropTarget_' + $(setXml).attr("dropEnabledNumber")).data( 'correctText' );
	var incorrectText = $('#dropTarget_' + $(setXml).attr("dropEnabledNumber")).data( 'incorrectText' );
	
	var itemsCompletedCount;
	if($(setXml).attr("itemsCompletedCount")){
		itemsCompletedCount = $(setXml).attr("itemsCompletedCount");				
	}else{
		itemsCompletedCount = 0;
	}
	
	var DropIncorrectCount;
	if($(setXml).attr("DropIncorrectCount")){
		DropIncorrectCount = $(setXml).attr("DropIncorrectCount");				
	}else{
		DropIncorrectCount = 0;
	}
	
	if(dropTargetNumGot == dropTargetNumLookingFor
		 && $(setXml).attr("dropEnabledNumber") == dropTargetNumGot){
		//correct
		$(setXml).attr("state", nextState($(setXml).attr("state")));
		
		itemsCompletedCount++;
		
		DropIncorrectCount = 0;
		
		$('#dropTargetText_' + dropTargetNumGot).empty();
		
		ui.draggable.addClass( 'correct' );
		ui.draggable.draggable( 'disable' );
		$(this).droppable( 'disable' );
		ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
		ui.draggable.draggable( 'option', 'revert', false ); 
		
		$('#clickGuard').css('display', 'block');
		
		showFeedback("correct", correctText);
	}else{
		//incorrect
		if(DropIncorrectCount > 0){
			//autoplace item
			showFeedback("incorrect", correctText);
						
			itemsCompletedCount++;
			
			DropIncorrectCount = 0;
			$(setXml).attr("state", nextState($(setXml).attr("state")));
			reloadSet = true;
		}else{
			showFeedback("incorrect", incorrectText);
			DropIncorrectCount++;
		}
	}
		
	//Enable audio for set  
	if(itemsCompletedCount == 3){
		enableAllAudioBtns();
	}else{
		enableSingleAudioBtn(Number(itemsCompletedCount) + 1);
	}
	
	//write back vars to xml
	$(setXml).attr("itemsCompletedCount", itemsCompletedCount);
	$(setXml).attr("DropIncorrectCount", DropIncorrectCount);
}

function checkActivityCompleted(){
	if(completedFeedbackShown){
		return;
	}
	
	var activityCompleted = true;
	$(xml).find("set").each(function(){	
		if($(this).attr("state") != "completed"){
			activityCompleted = false;
		}
	});
	
	if(activityCompleted){
		completedFeedbackShown = true;
		
		//Check to see if we're in a container (such as Gateway)
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
		}else{
			showFeedback("completed");	
		}
		
	}
}

function parseXml(t_xml)
{
	xml = t_xml;
	
	//Randomize sets
	$(xml).find("set").each(function(){
		randomizeSet(this);		
	});

	$('#dragBubble_1').draggable({ revert: true });
	$('#dragBubble_2').draggable({ revert: true });
	$('#dragBubble_3').draggable({ revert: true });
	$('#dragBubble_4').draggable({ revert: true });
	$('#dragBubble_5').draggable({ revert: true });
	$('#dragBubble_6').draggable({ revert: true });

	
	$( "#dropTarget_1" ).droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction}); 
	
	$( "#dropTarget_2" ).droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction}); 
	
	$( "#dropTarget_3" ).droppable({
		hoverClass: "dropTargetHover",
		drop: dropFunction}); 
	
	$('#playBtn1').css('z-index', '11');

	loadSet(currentSet);
}




function clearAllBubbleText(){
 for(var i = 1; i < 7; i++){
 	$("#dragBubbleText_" + i).html("");
 }	
}

function clearAllImages(){
  for(var i = 1; i < 4; i++){
	$("#img_" + i).attr("src", "");
  }	
}

function randomizeSet(xml){
	$(xml).find("item").shuffle()
}

var mediaPath = "../common/"

function placeBtn(dragBubbleNum, targetNum){
	var topVal;
	var modVal;
	if(dragBubbleNum < 4){
		//row 1
		topVal = -71;
		modVal = dragBubbleNum;
	}else{
		//row 2
		topVal = -120;
		modVal = dragBubbleNum -3;
	}
	
	var leftVal = 0;
	
	
	if( modVal != targetNum){ //If 0 they're currently lined up then the left val is zero
		if(modVal == 1 && targetNum == 2){
			leftVal = 187;	
		}
		
		if(modVal == 1 && targetNum == 3){
			leftVal = 377;
		}
		
		if(modVal == 2 && targetNum == 1){
			leftVal = -187;
		}
		
		if(modVal == 2 && targetNum == 3){
			leftVal = 187;
		}
		
		if(modVal == 3 && targetNum == 1){
			leftVal = -377;
		}
		
		if(modVal == 3 && targetNum == 2){
			leftVal = -192;
		}
	}
	
	$('#dragBubble_' + dragBubbleNum).addClass('ui-state-disabled');
	$('#dragBubble_' + dragBubbleNum).addClass('ui-draggable-disabled'); 
	$('#dragBubble_' + dragBubbleNum).css({'left':leftVal,'top':topVal});
	
	$('#dropTarget_' + targetNum).droppable( 'disable' );
	$('#dropTarget_' + targetNum).addClass('ui-droppable-disabled');
	$('#dropTarget_' + targetNum).addClass('ui-state-disabled');
	$('#dropTargetText_' + targetNum).empty();	
}

function resetAllDragBtns(){
	for(var i=1; i<7; i++){
		$('#dragBubble_' + i).removeClass('ui-state-disabled');
		$('#dragBubble_' + i).removeClass('ui-draggable-disabled'); 
		$('#dragBubble_' + i).removeClass( 'correct' );
		$('#dragBubble_' + i).css({'left':'','top':''});
		$('#dragBubble_' + i).draggable("enable");
		$('#dragBubble_' + i).draggable({ revert: true });
		$('#dragBubble_' + i).data({dropTargetNum: ""});
			
	}
	
	for(var i=1; i<4; i++){
		$('#dropTarget_' + i).removeClass('ui-droppable-disabled');
		$('#dropTarget_' + i).removeClass('ui-state-disabled');
		$('#dropTargetText_' + i).text("?");
		$('#dropTarget_' + i).droppable( 'enable' );
		$('#dropTarget_' + i).data({correctText: "", dropTargetNum: "",
										incorrectText: ""});
	}
}

function enableAllAudioBtns(){
	$('#playBtn1').css('z-index', '11');
	$('#playBtn1').removeClass('ui-state-disabled');
	$("#playBtn1").css("opacity", 1);
	
	$('#playBtn2').css('z-index', '11');
	$('#playBtn2').removeClass('ui-state-disabled');
	$("#playBtn2").css("opacity", 1);
	
	$('#playBtn3').css('z-index', '11');
	$('#playBtn3').removeClass('ui-state-disabled');
	$("#playBtn3").css("opacity", 1);
}

function enableSingleAudioBtn(value){
	enableAllAudioBtns();
	
	if(value == 1){
		$('#playBtn2').css('z-index', '7');
		$('#playBtn2').addClass('ui-state-disabled');
		$("#playBtn2").css("opacity", .5);

		$('#playBtn3').css('z-index', '7');
		$('#playBtn3').addClass('ui-state-disabled');
		$("#playBtn3").css("opacity", .5);
	}
	
	if(value == 2){
		$('#playBtn1').css('z-index', '7');
		$('#playBtn1').addClass('ui-state-disabled');
		$("#playBtn1").css("opacity", .5);

		$('#playBtn3').css('z-index', '7');
		$('#playBtn3').addClass('ui-state-disabled');
		$("#playBtn3").css("opacity", .5);
	}
	
	if(value == 3){
		$('#playBtn1').css('z-index', '7');
		$('#playBtn1').addClass('ui-state-disabled');
		$("#playBtn1").css("opacity", .5);

		$('#playBtn2').css('z-index', '7');
		$('#playBtn2').addClass('ui-state-disabled');
		$("#playBtn2").css("opacity", .5);
	}


}


function loadSet(value){
	currentSet = value;
	numSets = $(xml).find("set").length;;
	
	
	//Disable the clickguard
	$('#clickGuard').css('display', 'none');
	
	resetAllDragBtns();
	
	updateNavButtons();
	
	setXml = $(xml).find("set").eq(currentSet);
	
	var shuffledDropTargetsArr;
	if($(setXml).attr("shuffledDropTargetsArr")){
		shuffledDropTargetsArr = $(setXml).attr("shuffledDropTargetsArr").split(",");
	}else{
		shuffledDropTargetsArr = shuffleArray([0,1,2]);
		$(setXml).attr("shuffledDropTargetsArr",shuffledDropTargetsArr.toString());
	}
	
	
	//Load media
	clearAllBubbleText();
	clearAllImages();
	var tally = 1;	
	var imgTally = 1;
	
	var dropTargetArr = [];
	
	$(setXml).find("item").each(function(){
		$(this).find("lang_tl").each( function(){
			$("#dragBubbleText_" + tally).html($(this).text());
			
			//Handle for text that takes up 2 lines
			if($(this).text().length > 20){
				$("#dragBubbleText_" + tally).css("top","-3px");	
			}else{
				$("#dragBubbleText_" + tally).css("top","6px");
			}
		})
		
		var itemXml = this;
		
		$(this).find("file_img_video").each(function(){
			$("#img_" + imgTally).attr("src", mediaPath + "png/"+ $(this).text());
			$('#dragBubble_' + tally).data({ dropTargetNum: imgTally});
			$('#dropTarget_' + imgTally).data({ dropTargetNum: imgTally,
										correctText: $(itemXml).find("feedback").text(),
										incorrectText: $(itemXml).find("hint").text() });
			
			dropTargetArr[imgTally - 1] = tally;
			imgTally++;
		});
		
		tally++;
	});
	
	
	switch($(setXml).attr("state")){
		default:
		case "play1":
			enableSingleAudioBtn(1);
			
			//Enable the clickguard
			$('#clickGuard').css('display', 'block');
			break;
		case "itemPlace1":
			enableSingleAudioBtn(1);
			break;
		case "play2":
			enableSingleAudioBtn(2);
			
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[0]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[0]], dropTargetNum);
			
			//Enable the clickguard
			$('#clickGuard').css('display', 'block');
			break;
		case "itemPlace2":
			enableSingleAudioBtn(2);
			
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[0]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[0]], dropTargetNum);
			
			break;
		case "play3":
			enableSingleAudioBtn(3);
			
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[0]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[0]], dropTargetNum);
			
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[1]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[1]], dropTargetNum);
			
			//Enable the clickguard
			$('#clickGuard').css('display', 'block');
			break;
		case "itemPlace3":
			enableSingleAudioBtn(3);
			
			
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[0]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[0]], dropTargetNum);
			
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[1]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[1]], dropTargetNum);
			
			break;
		case "completed":
  			setCompleted = true;
			//Load all of the drop targets
			var dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[0]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[0]], dropTargetNum);
	
			dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[1]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[1]], dropTargetNum);
			
			dropTargetNum = $('#dragBubble_' + dropTargetArr[shuffledDropTargetsArr[2]]).data( 'dropTargetNum' );
			placeBtn(dropTargetArr[shuffledDropTargetsArr[2]], dropTargetNum);
			
			
			//Enable all of the audio buttons
			enableAllAudioBtns();
			
			//Enable the clickguard
			$('#clickGuard').css('display', 'block');
	
			break;
	}
}

function nextClicked(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#buttonGuard").css("z-index", btnCG_orig);
	
	nextClick();
}

function prevClicked(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#buttonGuard").css("z-index", btnCG_orig);
	
	prevClick();
}

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").text("OK");
	$("#feedbackBtn").show();
	$("#clickGuard").css("display","block");
	$("#buttonGuard").css("z-index", "100");
	
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
		case "completed":
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

var completedFeedbackShown = false;
var reloadSet = false;
var btnCG_orig;


function closeFeedback(){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#feedbackBtn").hide();
	$("#correctAnswer").text("");
	$("#clickGuard").css("display","none");
	$("#buttonGuard").css("z-index", btnCG_orig);
	
	checkActivityCompleted();
	
	//Reload the set if requested
	if(reloadSet){
		reloadSet = false;
		loadSet(currentSet);
	}
	
	
	/*$('#feedback').css( {
	left: '580px',
	top: '250px',
	width: 0,
	height: 0
	} );*/
}

function nextState(value){
	switch(value){
		default:
		case "play1":
			return "itemPlace1";
		case "itemPlace1":
			return "play2";
		case "play2":
			return "itemPlace2";
		case "itemPlace2":
			return "play3";
		case "play3":
			return "itemPlace3";
		case "itemPlace3":
			return "completed";
		case "completed":
			return undefined;
	}
}

function playAudio(value){	
	var fileName;
	var shuffledDropTargetsArr = $(setXml).attr("shuffledDropTargetsArr").split(",");
	
	fileName = $(setXml).find("file_audio").eq(shuffledDropTargetsArr[value - 1]).text();
		
	audio_play_file(removeFileExt(fileName),mediaPath);
	
	if($(setXml).attr("state") != "completed"){
		$('#clickGuard').css('display', 'none');
		
		//set to the next state
		switch(value){
			case 1:
				$(setXml).attr("state", "itemPlace1");
				break;
			case 2:
				$(setXml).attr("state", "itemPlace2");
				break;
			case 3:
				$(setXml).attr("state", "itemPlace3");
				break;	
		}
		
		$(setXml).attr("dropEnabledNumber", Number(shuffledDropTargetsArr[value - 1]) + 1);
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


function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}