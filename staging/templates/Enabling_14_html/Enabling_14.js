var currentPhoneNumber;
var currentCallAudio;
//var g_FlashInstalled = false;

$(document).ready(function () {
	audioInit();
	
	if ( getPassedParameters() == false){	
	//Default values (for testing)
	mediaPath = "sampleData/";	
	xmlFilename = mediaPath + "MobilePhone.xml";
	jsonFilename = mediaPath + "MobilePhone.js";
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

	
	cssFilename = "styles/enabling_14_dlilearn.css";
	loadActivity(parseXml);
});

var xml;
function parseXml(t_xml)
{
	xml = t_xml;
	
	numSets = $(xml).find("item").length;
	
	//Load digits
	var tally = 0;
	$(xml).find("digit").each(function(){
		$("#num_" + tally + " div").text($(this).attr("english"));
		tally++;
	});
	
	
	//Load phoneNumbers
	$(xml).find("item").each(function(index, v){
		//Load the answer
		$(this).append($("<phonenumber id='answer' value='" + 
							$(this).attr("english")+ "'/>"));
						
		//Find at most 9 distractors for the current xml
		var itemsXml = $(xml).find("item");
		
		for(var i=0; i<itemsXml.length; i++){
			if(i == index)
				continue;
			
			if(i > 9) //A max of nine distractors allowed
				break;
			
			$(this).append($("<phonenumber value='" + 
						$(itemsXml[i]).attr("english")+ "'/>"));
		}
		
		$(this).find("phonenumber").shuffle();
	});
	
	
	
	$( "#selectable" ).selectable({
			selecting: function(event, ui){
			    if( $(".ui-selected, .ui-selecting").length > 1){
			    	$(ui.selecting).removeClass("ui-selecting");
			    }
		    },
			selected: function (event, ui) {
		  		//Find index
		  		
			}
		}
	);
	
    loadSet(currentSet);
}

function digitPressed(value){
	var str = document.getElementById('displayText').innerHTML;
	
	loadAudioTagPlayer();
	
	if(str.length < 9){
		var digitXml = $(xml).find("digit").eq(value);
		
		audio_play_file(removeFileExt(digitXml.attr("audio")) ,mediaPath);
			
		document.getElementById('displayText').innerHTML = str + 
												digitXml.attr("english");
	}
}

function delClicked(){
	var str = document.getElementById('displayText').innerHTML;
	
	if(str.length > 0){
		document.getElementById('displayText').innerHTML = str.substr(0, str.length - 1);
	}
}

function playCall(){
	audio_play_file(removeFileExt(currentCallAudio) ,mediaPath);
}

var timeoutID;
var copyOfText;
var btnLock;

function callPressed(){
	var str = document.getElementById('displayText').innerHTML;
	btnLock = true;
	
	if(str == currentPhoneNumber && 
		$("#answer").hasClass("ui-selected")){
		copyOfText = str;
		
		document.getElementById('displayText').innerHTML = "Correct!";
		
		timeoutID = window.setTimeout(correctTimerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
		
		
		$(itemXml).attr('completed', "true");
		$("#" + currentSet).addClass("itemCompleted");
		
		
		//check for all completed
		var completed = true;
		$(xml).find("item").each(function(){
			if($(this).attr("completed") != "true"){
				completed = false;
			}
		});
		
		if(completed){			
			//Check to see if we're in Gateway
			if(parent.activityCompleted){
				parent.activityCompleted(1,0);
			}else{
				alert("Activity Completed");
			}
		}else{
			//alert("incomplete");
		}
	}else{
		copyOfText = str;
		
		document.getElementById('displayText').innerHTML = "Incorrect";
		
		timeoutID = window.setTimeout(timerEnd, 2000);
		document.getElementById('clickGuard').style.display = "block";
	}
}


function correctTimerEnd(){
	document.getElementById('displayText').innerHTML = copyOfText;
	
	$(itemXml).attr('audio');
	
	document.getElementById('clickGuard').style.display = "block";
	btnLock = false;
}

function timerEnd(){
	document.getElementById('displayText').innerHTML = copyOfText;
	
	document.getElementById('clickGuard').style.display = "none";
	
	btnLock = false;
}

function nextClick(){
	if(btnLock)
		return;
		
	if(currentSet != numSets - 1){
		//Save the scratch text
		itemXml.attr("scratchText", document.getElementById("scratchText").value);
		itemXml.attr("tempDisplayValue", document.getElementById("displayText").innerHTML);
	
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(btnLock)
		return;
	
	if(currentSet != 0){
		//Save the scratch text
		itemXml.attr("scratchText", document.getElementById("scratchText").value);
		itemXml.attr("tempDisplayValue", document.getElementById("displayText").innerHTML);
		
		loadSet(currentSet - 1);
	}
}

var currentSet = 0;
var numSets = 0;
var itemXml;

function loadSet(value){
	currentSet = value;
	
	//setSelected(currentSet);
	
	document.getElementById('setText').innerHTML = (currentSet + 1) + "/" + numSets;
	
	itemXml = $(xml).find("item").eq(currentSet);

	//Load selection
	$("#selectable").empty();
	
	
	//Load selections
	$(itemXml).find("phonenumber").each(function(i, v){
		var id = false;
		
		if($(this).attr("id") == "answer"){
			id = "answer"	
		}else{
			id = "distractor_" + i;
		}
		
		var widthOverride = "";
		if($(xml).find("content").attr("tl_textfield_width") != undefined){
			widthOverride = " style='width:" + 
					$(xml).find("content").attr("tl_textfield_width") +
					"' ";
		}
		
		var transValue = translatePhoneNum($(v).attr("value"));
		
		$("#selectable").append($("<div class='phoneNum noSelect' " + 
										"id='" + id + "' " + 
											widthOverride + ">" + 
										"<div class='phoneNumTxt'>" +
										 transValue + "</div></div>"));
	});
	
	//Load the scratch text
	if(itemXml.attr("scratchText")){
		document.getElementById("scratchText").value = itemXml.attr("scratchText");
	}else{
		document.getElementById("scratchText").value = "Scratch Text Area";
	}
	
	currentPhoneNumber = $(itemXml).attr('english');
	currentCallAudio = $(itemXml).attr('audio');
	
	loadTlPhoneNum();
	
	if($(itemXml).attr('completed') == "true"){
		$("#answer").addClass('ui-selected');
		document.getElementById('clickGuard').style.display = "block";
		document.getElementById('displayText').innerHTML = currentPhoneNumber;
	}else{
		document.getElementById('clickGuard').style.display = "none";
		
		//Load display numbers
		if(itemXml.attr("tempDisplayValue")){
			document.getElementById("displayText").innerHTML  = itemXml.attr("tempDisplayValue");
		}else{
			document.getElementById("displayText").innerHTML  = "";
		}
	}
}


function translatePhoneNum(phoneNum){
    var out = "";

    for(var i=0; i<phoneNum.length; i++){
        var ch = phoneNum.substr(i,1);
        var tl_ch = $(xml).find("digit[english='" + ch  + "']");
        out = out + $(tl_ch).text();
    }

    return out;	
}

function loadTlPhoneNum(){
    $("#tl_phoneNum").text(translatePhoneNum(currentPhoneNumber));
}


function loadAudioTagPlayer(){
	var htmlAudioPlayerDiv = document.getElementById("htmlAudioPlayerDiv");
	htmlAudioPlayerDiv.innerHTML = '<audio id="audioPlayer" width="0" height="0" autoplay></audio>';
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
