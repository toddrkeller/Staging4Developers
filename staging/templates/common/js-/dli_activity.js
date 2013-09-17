var mediaPath; 
var cssFilename;
var xmlFilename;
var jsonFilename;
var keyboardFilename = "";
var activityDataLoadCallback;
var xml;
var currentSet = 0;
var setXml;
var numSets;

var keyboardHtml;
var params;

function loadActivity(t_activityLoadCallback){
	//Load default css file
	loadjscssfile("../common/css/activityDefault.css", "css");
	
	//Grab params
	params = getParams(window.location.href);
	
	//Load mediaPath
	if(params["mediaPath"] != null){
		mediaPath = params["mediaPath"];
	}
	
	//Load css
	if(params["cssFilename"] != null){
		cssFilename = params["cssFilename"];
	}
	loadjscssfile(cssFilename, "css");
	
	//Xml filename params
	if(params["xmlFilename"] != null){
		xmlFilename = params["xmlFilename"];
	}
	
	//Json filename params
	if(params["jsonFilename"] != null){
		jsonFilename = params["jsonFilename"];		
	}
	
	//Json filename params
	if(params["keyboardFilename"] != null){
		keyboardFilename = params["keyboardFilename"];		
	}
	
	loadActivityData(null, null, t_activityLoadCallback);
}

function loadActivityData(t_xmlFilename, t_jsonFilename, t_activityDataLoadCallback){
	//Note- using this logic you can call the function with null values for the filenames
	// and it will take the values currently in the xmlFilename and jsonFilename instead.
	if(t_xmlFilename != null){
		xmlFilename = t_xmlFilename;
	}
	
	if(t_jsonFilename != null){
		jsonFilename = t_jsonFilename;
	}
	
	if(t_activityDataLoadCallback != null){
		activityDataLoadCallback = t_activityDataLoadCallback;
	}
	
	if(xmlFilename == null){
		if(jsonFilename == null){
			alert("Error- Neither xml nor json data source given.");
		}else{
			//Load Json if only Json given
			loadjscssfile(jsonFilename, 'js',jsonLoaded);
		}
	}else{
		//Load xml
		$.ajax({
		    type: "GET",
		    url: xmlFilename,
		    dataType: "xml",
		    success: handleXml,
		    error: ajaxErrorFunc
		});
	}
}




function handleXml(t_xml)
{
	xml = t_xml;
	
	if(keyboardFilename.length > 0){
		loadjscssfile(keyboardFilename, 'js',jsonKeyboardLoaded);
	}
	
	if(activityDataLoadCallback){
		activityDataLoadCallback(t_xml);
	}
}

function jsonKeyboardLoaded(){
	var X2JSinst = new X2JS();
	
	//jsonKeyboard should be defined in the json file we just loaded
	keyboardXml = X2JSinst.json2xml(jsonKeyboard);
	loadKeyboard();
}

var keyboardXml;
function loadKeyboard(){
	$("#keyboardContainer").html(new XMLSerializer().serializeToString(keyboardXml));

	//Clean up the commas from the conversion
	var children = $("#keyboard").clone().children();
	var node = $("#keyboard").clone().children().remove().end().text("");
	node.append(children);
	$("#keyboard").replaceWith(node);
}

function ajaxErrorFunc(jqXHR, textStatus, errorThrown){
	if(jsonFilename != null && jsonFilename.length > 0){
		loadjscssfile(jsonFilename, 'js',jsonLoaded);
	}else{
		alert("Error- Can't load activity xml and alternative json not listed.");
	}
}


function jsonLoaded(){
	var X2JSinst = new X2JS();
	
	//jsonData should be defined in the json file we just loaded
	var xmlFromJson = X2JSinst.json2xml(jsonData);
	
	handleXml(xmlFromJson);	
}


var debugPanelShown = false;

function loadDebugPanel(){
	if($("#debugPanelToggle").length == 0){
		$("body").append("<div id='debugPanelToggle'>Toggle Debug</div>");
		
		$('#debugPanelToggle').click(function(){
			if(debugPanelShown){
				debugPanelShown = false;
				$('#debugPanel').hide();
			}else{
				debugPanelShown = true;
				$('#debugPanel').show();
			}
		});
	
	}
		
	if($("#debugPanel").length == 0){
			$("#debugPanel").html();

		$("body").append("<div id='debugPanel'>" + 
							"<p>" + navigator.platform + 
							"</p><p>" + navigator.userAgent + 
							"</p><p>" + BrowserDetect.browser + ' ' + 
							BrowserDetect.version + ' on ' + 
							BrowserDetect.OS + "</p>" + 
						"</div>");
		$('#debugPanel').hide();
	}
}

var setBtnLock = false;

function nextClick(){
	if(setBtnLock)
		return;
		
	if(currentSet == numSets - 1){
		
	}else{	
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(setBtnLock)
		return;
	
	if(currentSet == 0){
		
	}else{
		loadSet(currentSet - 1);
	}
}

function updateSetText(){
	document.getElementById('setText').innerHTML = (currentSet + 1) + "/" + numSets;
}

function updateNavButtons(){
	updateSetText();
	
	if(currentSet == 0){
		document.getElementById("prevBtnClickGuard").style.display = "block";
	}else{
		document.getElementById("prevBtnClickGuard").style.display = "none";
	}
	
	if(currentSet == numSets - 1){
		document.getElementById("nextBtnClickGuard").style.display = "block";
	}else{
		document.getElementById("nextBtnClickGuard").style.display = "none";
	}
}

function logStudentAnswer(questionID, answer, context) 
{
	var student = getURL_Parameter('student');
	var language = getURL_Parameter('language');
	var lessonID = getURL_Parameter('lesson');
	var activityID = getURL_Parameter('activity');
	var activityType = getURL_Parameter('activityType');

	if (language == 'undefined' || lessonID == 'undefined' || activityID == 'undefined' || activityType == 'undefined' ) return;

	var template = '[';
	template += '{';
	template += '"language": "{0}",';
	template += '"studentID": "{1}",';
	template += '"lessonID": "{2}",';
	template += '"activityID": "{3}",';
	template += '"questionID": "{4}",';
	template += '"Answer": "{5}",';
	template += '"questionContext": "{6}",';
	template += '"ActivityType": "{7}"';
	template += '}]';	
	
	var answerString = template.format(language, student, lessonID, activityID, questionID, answer, context, activityType);
	parent.framework.logStudentAnswer(answerString);
}

function logStudentAnswerAttempts(questionID, attemptCount)
{
	var template = '[';
	template += '{';
	template += '"language": "{0}",';
	template += '"studentID": "{1}",';
	template += '"lessonID": "{2}",';
	template += '"activityID": "{3}",';
	template += '"questionID": "{4}",';
	template += '"Attempts": "{5}",';
	template += '"activityType": "{6}",';
	template += '}]';

	var student = getURL_Parameter('student');
	var language = getURL_Parameter('language');
	var lessonID = getURL_Parameter('lesson');
	var activityID = getURL_Parameter('activity');
	var activityType = getURL_Parameter('activityType');

	var answerString = template.format(language, student, lessonID, activityID, questionID, attemptCount, activityType);
	parent.framework.logStudentAnswerAttempts(answerString);	
}