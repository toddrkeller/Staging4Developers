
var flashSupported = false;
var videoTagSupported = false;

function testVideoSupport(){
	flashSupported = checkFlashSupported();
	videoTagSupported = testVideoTagSupport();
}

var forceVidType = "";

// Load video but not play yet
function loadVideoNoPlayYet(path, videoName, activityName){
	 loadVideo(path, videoName, activityName, false);
}

function loadVideo(path, videoName, activityName, play, gloss){
	if(play == undefined){
		play = true;
	}
	
	var flashVideoPath = path;
	if(activityName != undefined){
		flashVideoPath = "../" + activityName + "_html/" + path;
	}
	
	if(forceVidType.length > 0){
		//Video override present
		switch(forceVidType){
			case "flash":
				if(!flashSupported){
					alert("Flash video not supported");	
					break;
				}else{			
					loadFlashVideo("videoContainer", flashVideoPath, videoName);
				}
				
				break;
			case "ogv":
				loadHTMLVideo("videoContainer", path, videoName, ["ogv"]);
				if(play){
					if(!document.getElementById("videoTag").play){
						alert(".ogv video not supported");	
					}else{
						document.getElementById("videoTag").play();
					}
				}else{
					if(!document.getElementById("videoTag").load){
						alert(".ogv video not supported");	
					}else{
						document.getElementById("videoTag").load();
					}
				}

				break;
			case 'm4v':
				loadHTMLVideo("videoContainer", path, videoName, ["m4v"]);
				
				if(play){
					if(!document.getElementById("videoTag").play){
						alert(".m4v video not supported");	
					}else{
						document.getElementById("videoTag").play();
					}
				}else{
					if(!document.getElementById("videoTag").load){
						alert(".m4v video not supported");	
					}else{
						document.getElementById("videoTag").load();
					}
				}

				break;
			case "ogg":
				loadHTMLVideo("videoContainer", path, videoName, ["ogg"]);
				
				if(play){
					if(!document.getElementById("videoTag").play){
						alert(".ogg video not supported");	
					}else{
						document.getElementById("videoTag").play();
					}
				}else{
					if(!document.getElementById("videoTag").load){
						alert(".ogg video not supported");	
					}else{
						document.getElementById("videoTag").load();
					}
				}

				break;
			case 'mp4':
				loadHTMLVideo("videoContainer", path, videoName, ["mp4"]);
				
				if(play){
					if(!document.getElementById("videoTag").play){
						alert(".mp4 video not supported");	
					}else{
						document.getElementById("videoTag").play();
					}
				}else{
					if(!document.getElementById("videoTag").load){
						alert(".mp4 video not supported");	
					}else{
						document.getElementById("videoTag").load();
					}
				}

				break;
			case 'webm':
				loadHTMLVideo("videoContainer", path, videoName, ["webm"]);

				if(play){
					if(!document.getElementById("videoTag").play){
						alert(".webm video not supported");
					}else{
						//document.getElementById("videoTag").play();
						document.getElementById("videoTag").play();
					}
				}else{
					if(!document.getElementById("videoTag").load){
						alert(".webm video not supported");
					}else{
						//document.getElementById("videoTag").play();
						document.getElementById("videoTag").load();
					}
				}

				break;
			case 'html':
				loadHTMLVideo("videoContainer", path, videoName, ["ogg", "mp4","ogv","m4v","webm"]);

				if(play){
					if(!document.getElementById("videoTag").play){
						alert("HTML video not supported");
					}else{
                                                alert('html player')
						//document.getElementById("videoTag").play();
						document.getElementById("videoTag").play();
					}
				}else{
					if(!document.getElementById("videoTag").load){
						alert("HTML video not supported");
					}else{
						//document.getElementById("videoTag").play();
						document.getElementById("videoTag").load();
					}
				}
				break;
			default:
				alert("Video formate " + forceVidType + " not known");	

				break;
		}
	}else if(BrowserDetect.OS == "Android" && flashSupported){
		//Override for Android
		loadFlashVideo("videoContainer", flashVideoPath, videoName);
	}else if(videoTagSupported){
          ////alert('videoTagSupported_a')
		//HTML Video 
		loadHTMLVideo("videoContainer", path, videoName, ["ogg", "mp4","ogv","m4v","webm"], gloss);
		if(play){
			if(!document.getElementById("videoTag").play){
				alert("No HTML video type supported");
			}else{
				document.getElementById("videoTag").play();
			}
		}else{if(!document.getElementById("videoTag").load){
				alert("No HTML video type supported");
			}else{
                          ////alert('videoTagSupported_b')
				document.getElementById("videoTag").load();
			}
		}
	}else if(flashSupported){
		//Flash Video
		loadFlashVideo("videoContainer", flashVideoPath, videoName);
	}
}

function clearVideo(containerTagId){
	$("#" + containerTagId).html("");
}

var videoFormats = {
						ogv:{
							ext:"ogv",
							type:"video/ogg"
						},
						mpg:{
							ext:"mpg",
							type:"video/mpg"
						},
						m4v:{
							ext:"m4v",
							type:"video/mp4"
						},
						ogg:{
							ext:"ogg",
							type:"video/ogg"
						},
						mp4:{
							ext:"mp4",
							type:"video/mp4"
						},
						webm:{
							ext:"webm",
							type:"video/webm"
						}  
					};

function loadHTMLVideo(containerTagId, mediaPath, videoName, formatsArr, gloss){
        if(gloss == true)
        	var videoTag = 	'<video id="videoTag" controls="controls" width="280" height="212"> ';
        else
	  var videoTag = 	'<video id="videoTag"> ';

	for(var i=0; i< formatsArr.length; i++){
		videoTag = videoTag + '<source src="' + mediaPath + videoFormats[formatsArr[i]].ext + '/' + 
							videoName + '.' + videoFormats[formatsArr[i]].ext + '" type="' + videoFormats[formatsArr[i]].type + 
							'"> ';
	}
	
	videoTag = videoTag + '</video>';
            //// alert(videoTag)
	$("#" + containerTagId).html(videoTag);
}


function loadFlashVideo(containerTagId, mediaPath, videoName){
	var flashEmbed = '<embed align="middle" wmode="transparent" src="../common/VideoCaption.swf" ' + 
			'flashvars="videoSource=' + videoName + '.flv&amp;' + 
			'mediaFilePath=' + mediaPath + '&amp;fileExt=flv&amp;minimal=true" ' +
			'id="VideoCaption" quality="high" bgcolor="#869ca7" name="VideoCaption" ' +
			'allowscriptaccess="sameDomain" pluginspage="http://www.adobe.com/go/getflashplayer" ' + 
			'type="application/x-shockwave-flash"> ';
	
	$("#" + containerTagId).html(flashEmbed);
	
}

function testVideoTagSupport(){
	var videoTag = 	'<video id="videoContainerTest" > ' + 
			'<source src="../common/ogg/test.ogg" type="video/ogg"> ' + 
			'<source src="../common/mp4/test.mp4" type="video/mp4"></video>';
	$("body").append(videoTag);
			
	if(document.getElementById("videoContainerTest") && 
			document.getElementById("videoContainerTest").play){
		$('#videoContainerTest').remove();
		return true;
	}
	
	$('#videoContainerTest').remove();
	return false;
}

function checkFlashSupported(){
	var requiredMajorVersion = 10;
	var requiredMinorVersion = 0;
	var requiredRevision = 0;

	// Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
	var hasProductInstall = DetectFlashVer(6, 0, 65);

	// Version check based upon the values defined in globals
	var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

	if (hasProductInstall && hasRequestedVersion) {
	    return true;
	}
	
	return false;
}