$(document).ready(function() {
	testVideoSupport();
	
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = mediaPath + "levantine_VideoCaption_noNamespaces.xml";
		jsonFilename = mediaPath + "levantine_VideoCaption_noNamespaces.js";
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

	/*$("#main").mousemove(function(e){
		if($("#langSelect").hasClass("hidden")){
			if(e.pageX > 500 && e.pageY < 100 && !langSelectActive){
				$("#langSelectToggle_container").removeClass("hidden");	
			}else{
				$("#langSelectToggle_container").addClass("hidden");	
			}
		}

		//for testing
      	//$('#title').html(e.pageX +', '+ e.pageY);
   	});*/
	cssFilename = "styles/VideoCaption.css";
	$( "#selectable" ).selectable();

	loadActivity(parseXml);
}); 

var video;

function mouseMove(){
	if($("#langSelect").hasClass("hidden")){
		$("#langSelectToggle_container").addClass("visible");
		$("#langSelectToggle_container").removeClass("invisible");	
	}
}

function mouseOut(){
	if(!langSelectActive){
		$("#langSelectToggle_container").addClass("invisible");	
		$("#langSelectToggle_container").removeClass("visible");
	}
}

function parseXml(t_xml){
	var videoFile = $(xml).find("video_file").text();
	videoFile =	loadVideoNoPlayYet(mediaPath , videoFile);
	
	video = document.getElementById("videoTag");
	
	
	video.addEventListener('timeupdate',timeupdateEvent,false);
	video.addEventListener('ended',videoEnded,false);
	
	$(video).attr("controls", "true");
	
	$("#title").html($(xml).find("title").text());
	
	$("#tlLang").text($(xml).find("content").attr("target_language"));
}

var currentActiveSegment = 1;

function timeupdateEvent(){
	$('#title').html(video.currentTime);
	
	currentActiveSegment = 0;

	$(xml).find("segment time_pointer").each(function(){
	    var timePointer = parseFloat($(this).text());
	    
	    if(video.currentTime < timePointer){    
	        return false;
	    }else{
	        currentActiveSegment++;
	    }
	});

	$("#caption").html($($(xml).find("segment " + currentLangTagName)[currentActiveSegment - 1]).text());
}

function videoEnded(){
	//alert("ended");
}

var langSelectActive = false;
var currentLangTagName = "en_script";

function langSelectTogglePressed(){
	//$("#langSelectToggle_container").addClass("hidden");	
	$("#langSelect_guard").removeClass("hidden");	
	$("#langSelect").removeClass("hidden");	
	langSelectActive = true;
}

function langPress(value){
	$("#langSelectToggle_container").addClass("invisible");
	$("#langSelectToggle_container").removeClass("visible");		
	switch(value){
		case 'none':
			$("#caption_container").addClass("hidden");
			break;
		case 'en':
			currentLangTagName = "en_script";
			$("#caption_container").removeClass("hidden");	
			$("#caption").html($($(xml).find("segment " + currentLangTagName)[currentActiveSegment - 1]).text());
			break;
		case 'tl':
			currentLangTagName = "tl_script";
			$("#caption_container").removeClass("hidden");	
			$("#caption").html($($(xml).find("segment " + currentLangTagName)[currentActiveSegment - 1]).text());
			break;
	}
	
	$("#langSelect_guard").addClass("hidden");
	$("#langSelect").addClass("hidden");
	
	langSelectActive = false;
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
