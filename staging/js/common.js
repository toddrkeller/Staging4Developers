// -------------------------------------------------------------------------------
//	File: 		common.js
//	Purpose: 	Add commonly used functions to this file.  Project specific
//				functions and classes should be in their own js file.
// -------------------------------------------------------------------------------
String.prototype.L_Trim = new Function("return this.replace(/^\\s+/,'')")
String.prototype.R_Trim = new Function("return this.replace(/\\s+$/,'')")
String.prototype.Trim = new Function("return this.L_Trim().R_Trim()")

String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}

$(function() {
    $( "#selectable" ).selectable();
  });

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

function pad(number, length)
{
	var str = '' + number;
	while (str.length < length)
	{
   		str = '0' + str;
	}
	return str;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --------------------------------------------------------------
// randomNumbers:  
// 		Takes one numeric parameter.  The parameter
// 		specified how many digits the returned random number should 
// 		be.
// --------------------------------------------------------------
function randomNumbers()
{
	this.inhat  = function(n){return(this.ff[n])}
	this.remove = function(n){if(this.ff[n]){this.ff[n]=false;this.count--}}
	this.fill = function (n)
	{
		this.ff = []
		for (var i=0; i < n; i++)
		this.ff[i] = true
		this.count = n
    }

	this.get = function()
	{
		var n, k, r
		r = this.count
		if (r > 0)
		{
			n = Math.ceil(Math.random()*r)
			r = k = 0
			do
			if (this.ff[r++])
				k++
			while (k < n)
				this.ff[r-1] = false
			this.count--
		}
		return r-1
	}
	if (arguments.length > 0)
		this.fill( arguments[0] )
}// randomNumbers

// --------------------------------------------------------------
// setSimpleCookie:  Set a cookie and an expiration
//
//			cookieName: 	Unique name of the cookie.  It will be associated
//							with the domain name.
//			cookieValue: 	Value of the cookie
//			hours:		  	Hours until the browser deletes the cookie
// --------------------------------------------------------------
function setSimpleCookie(cookieName, cookieValue, hours)
{
	if (typeof hours == 'undefined')
		hours = 24 * 180;
		
	var expires = new Date((new Date()).getTime() + hours*3600000);
	document.cookie = cookieName + '=' + cookieValue + '; path=/; expires=' + expires.toGMTString();
}

// --------------------------------------------------------------
// getSimpleCookie:  Get cookie value
//
//			check_name: 	Cookie name to get it's value
// --------------------------------------------------------------
function getSimpleCookie( check_name ) 
{
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f

	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );

		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return false;
	}
}

function siteMessage(message, title, width, height, simple)
{
    var titleSpan = simple ? "simplePopup" : "siteMessage";
    
    if (typeof title == 'string')
    {
        $("#ui-dialog-title-" + titleSpan).html(title);
    }

    if (typeof width != 'undefined' && typeof height != 'undefined')
    {
        $("#siteMessage").dialog("option", "width", width);
        $("#siteMessage").dialog("option", "height", height);
    }

    if (simple)
    {
        $("#simplePopup").html(message);
        $("#simplePopup").dialog("open");
    }
    else
    {
        $("#siteMessage").html(message);
        $("#siteMessage").dialog("open");
    }
}

function confirmDialog(message, title, callback)
{
    framework.ui.confirmFunction = callback;

    $("#confirmationDialog").html(message);
    $("#confirmationDialog").dialog('option', 'title', title);

    $("#confirmationDialog").dialog("open");
}

function setDivHTML(divID, htmlString)
{
	var id = "#{0}".format(divID);
	$(id).html(htmlString);
}

function loadDivHTML(targetDiv, sourceDiv, fileName, callback)
{
	if (fileName.indexOf("/") >= 0)
	{
		// 
		var FileToLoad = "{0} {1}".format(fileName, sourceDiv);
	}
	else
	{
		var FileToLoad = "content/{0} {1}".format(fileName, sourceDiv);
	}

    $(targetDiv).load(FileToLoad, function(data) {
		if (typeof callback == 'function') callback();
	});
}

function getLessonNumber(lessonIndex)
{
	// get the unitNumber and the LessonNumber.
	// Calculations are based on 10 lessons per unit
	var lessonArray = new Array(2);
    var lessonID = parseInt(lessonIndex);
    var unit = Math.ceil(lessonID / 10);
    var lesson = lessonID - ((unit - 1) * 10);
    lessonArray[0] = unit;
    lessonArray[1] = lesson;
    return lessonArray;
}

function getUnitModLesson(lessonIndex)
{
    var lessonArray = new Array(3);
    var lessonID = parseInt(lessonIndex);
    var unit = Math.ceil(lessonID / 50);
    var mod = lessonID - ((unit - 1) * 50);
    var mod = Math.ceil(mod / 10);
    var lesson = lessonID % 10;
    lesson = lesson == 0 ? 10 : lesson;
    lessonArray[0] = unit;
    lessonArray[1] = mod;
    lessonArray[2] = lesson;
    return lessonArray;
}

// --------------------------------------------------------------
// parseXml: IE has some problems with JQuery and XML.  This corrects the problem.
//
//		Call this function immediately after getting the XML back
// 		from the JQuery ajax call.
// --------------------------------------------------------------
function parseXml(xml)
{	
	if (jQuery.browser.msie)
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
		xmlDoc.loadXML(xml);
		xml = xmlDoc;
	}
	
	return xml;
}

(function($) {
$.fn.serializeFormJSON = function() {

   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
})(jQuery);

function nName(nodeString, nameSpace)
{
	if (typeof nameSpace == "undefined")
	{
		return nodeString;
	}
	else
	{
		return ($.browser.msie || $.browser.mozilla) ? nameSpace + "\\:" + nodeString : nodeString;
	}
}


function logMessage(message)
{
	message = message.replace(/'/g, "&quote;");
	var userID = framework.configInfo.developerEmail;
	framework.dataObj.LogMessage(userID, message);
}

function debug()
{
	return;

	// db size start 20MB
	if (isDebugTimerRunning)
	{
		//clearInterval(debugTimer);
		isDebugTimerRunning = false;
	}
	else
	{
		isDebugTimerRunning = true;
		//debugTimer=setInterval(function(){logStudentAnswer()},10);
		debugTimer=setTimeout(function(){logStudentAnswerTest()}, 10);
	}
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function david()
{
	return framework.configInfo.developerMode == 'yes';
}

function ed()
{
	return false;
}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			   string: navigator.userAgent,
			   subString: "Android",
			   identity: "Android"
	    },
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();