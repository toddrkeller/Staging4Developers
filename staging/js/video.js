
var flashSupported = false;
var videoTagSupported = false;

function testVideoSupport(){
	flashSupported = checkFlashSupported();
	videoTagSupported = testVideoTagSupport();
}

var forceVidType = "";

function loadVideo(path, videoName, videoContainerName, videoTagId, plyBtn){
	var vidContainer = "videoContainer";
	var vidTagId = "videoTag";
	var playBtn = plyBtn ? true : false;
	if(videoContainerName != undefined){
		vidContainer = videoContainerName
		};
	if(videoTagId != undefined) {
                vidTagId = videoTagId
                };
        //alert( videoTagId )
	if(forceVidType.length > 0){
		//Video override present
		switch(forceVidType){
			case "flash":
				if(!flashSupported){
					alert("Flash video not supported");	
					break;
				}else{
					loadFlashVideo(vidContainer, path, videoName);
				}
				
				break;
			case "ogv":
				loadHTMLVideo(vidContainer, path, videoName, vidTagId, playBtn, ["ogv"]);
				
				if(!document.getElementById(vidTagId).play){
					alert(".ogv video not supported");	
				}else{
                                	document.getElementById(vidTagId).play();
				}

				break;
			case 'm4v':
				loadHTMLVideo(vidContainer, path, videoName, vidTagId, playBtn, ["m4v"]);
				
				if(!document.getElementById(vidTagId).play){
					alert(".m4v video not supported");	
				}else{
					document.getElementById(vidTagId).play();
				}

				break;
			case "ogg":				
				loadHTMLVideo(vidContainer, path, videoName, vidTagId, playBtn, ["ogg"]);
				
				if(!document.getElementById(vidTagId).play){
					alert(".ogg video not supported");	
				}else{

					document.getElementById(vidTagId).play();
				}

				break;
			case 'mp4':
				//alert('mp4')
				loadHTMLVideo(vidContainer, path, videoName, vidTagId, playBtn, ["mp4"]);

				if(!document.getElementById(vidTagId).play){
					alert(".mp4 video not supported");
				}else{

					document.getElementById(vidTagId).play();
				}

				break;
			default:
				alert("Video formate " + forceVidType + " not known");	
				
				break;
		}
	}else if(BrowserDetect.OS == "Android" && flashSupported){
		//Override for Android
		loadFlashVideo(vidContainer, path, videoName);
	}else if(videoTagSupported){
		//HTML Video
		loadHTMLVideo(vidContainer, path, videoName, vidTagId, playBtn, ["ogg", "mp4","ogv","m4v"]);
		if(!playBtn)
                  document.getElementById(vidTagId).play();
	}else if(flashSupported){
		//Flash Video
		loadFlashVideo(vidContainer, path, videoName);
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
						} 
					};

function loadHTMLVideo(containerTagId, mediaPath, videoName, vidTagId, playBtn, formatsArr){
	var videoTag = 	'<video id="' + vidTagId + '"  controls autoplay> ';
	for(var i=0; i< formatsArr.length; i++){
		videoTag = videoTag + '<source src="' + mediaPath + videoName + '.' + videoFormats[formatsArr[i]].ext + '" type="' + videoFormats[formatsArr[i]].type + '"> ';
	}

	videoTag = videoTag + '</video>';
	if (playBtn){
            var vidTagNo = vidTagId.substr(vidTagId.length-1);

            videoTag += '<div id="playBtnVid' + vidTagNo + '">' +
                        '<img  class="playBtn" src="/templates/common/Library/images/playBtn_s1.png" border="0">' +
                        '</div>' 
									  
              }

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
			'<source src="/templates/common/ogg/test.ogg" type="video/ogg"> ' + 
			'<source src="/templates/common/mp4/test.mp4" type="video/mp4"></video>';
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