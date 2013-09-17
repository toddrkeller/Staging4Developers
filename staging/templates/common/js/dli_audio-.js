var g_html5_audio = false;
var g_android = false;
var g_iPod = false;

function audioInit(){
	var ua = navigator.userAgent.toLowerCase()
	if (!g_iPod)
	  g_iPod = ua.indexOf('iphone') >= 0
	if (!g_iPod)
	  g_iPod = ua.indexOf('ipod') >= 0
	if (!g_iPod)
	  g_android = ua.indexOf('android') >= 0
	  
	loadAudioTagPlayer();
	loadFlashPlayer();
	loadEmbedPlayer();

	//Todo - expand this to intelligently include all the various types
	var audioTag = document.getElementById("audioPlayer");
	if(audioTag && audioTag.canPlayType &&
		(audioTag.canPlayType('audio/mpeg') ||
		audioTag.canPlayType('audio/ogg') == "maybe" || 
		audioTag.canPlayType('audio/ogg') == "true") ){
		g_html5_audio = true;
		//document.title = "Audio found."
	}
}

function loadFlashPlayer(){
	if(!document.getElementById("flashAudioPlayer")){
		var flashAudioPlayerDiv = document.getElementById("flashAudioPlayerDiv");
			
		if(navigator.appName.toLowerCase().indexOf("explorer") != -1){
			flashAudioPlayerDiv.innerHTML = '<object data="../common/audioPlayer.swf" type="application/x-shockwave-flash" ' +
		    	'style="width: 0px; height: 0px;" id="flashAudioPlayer">' +
				    '<param value="../common/audioPlayer.swf" name="movie">' +
				    '<param value="transparent" name="wmode">' +
				    '<param name="allowScriptAccess" value="always">' +
				'</object>';
		}else{
			flashAudioPlayerDiv.innerHTML = '<embed align="middle" width="0" height="0" type="application/x-shockwave-flash" ' + 
				'pluginspage="http://www.adobe.com/go/getflashplayer" allowscriptaccess="sameDomain" ' + 
				'name="audioPlayer" bgcolor="#869ca7" quality="high" id="flashAudioPlayer" ' + 
				'src="../common/audioPlayer.swf"></embed>';
		}
	}
}

function loadAudioTagPlayer(force){
	if(!document.getElementById('audioPlayer') || force){
		var htmlAudioPlayerDiv = document.getElementById("htmlAudioPlayerDiv");
		
		htmlAudioPlayerDiv.innerHTML = '<audio id="audioPlayer" width="0" height="0" ></audio>';
	}
}

function loadEmbedPlayer(){
	if(document.getElementById("id_embed_player")){
		var embeddedAudioPlayerDiv = document.getElementById("embeddedAudioPlayerDiv");
		
		embeddedAudioPlayerDiv.innerHTML = '<embed id="id_embed_player" scale="1" target="myself" type="audio/mpeg" enablejavascript="true" ' + 
		    'postdomevents="true" showlogo="true" controller="true" bgcolor="gray" ' +
		    'style="width: 0px; height: 0px;"  autoplay="true"  ></embed> ' ;
	}
}

function playFlashAudio(URL){
	//Android seems to work better with Flash than HTML5
  	//So use it when available.
  	
  	var flashAudioPlayer = document.getElementById("flashAudioPlayer");
  	
  	if(flashAudioPlayer && flashAudioPlayer.setAudioFromJS){
  		flashAudioPlayer.setAudioFromJS(URL);
  		return true;
	}else{
		//something is wrong with the External interface call so fallback by
		//going to the next in the list
		return false;
	}
}

function playHTMLAudio(URL){
	document.getElementById('audioPlayer').src = URL;
	document.getElementById('audioPlayer').play();
	return true; //todo - Right now there is not a way to verify that it will be played		
}

function playHTMLAudioWithSources(filenameMinusExt, mediaDir){
	loadAudioTagPlayer(true);
	
	var htmlAudioPlayer = document.getElementById('audioPlayer');
	
	
	htmlAudioPlayer.innerHTML = ""; 
	
	var sourceList = "";	
	if(htmlAudioPlayer.canPlayType('audio/mpeg') == "true" || 
		htmlAudioPlayer.canPlayType('audio/mpeg') == "maybe" ){
		sourceList = sourceList + '<source src="' + mediaDir + 'mp3/'
					+ filenameMinusExt + '.mp3' + '" type="audio/mpeg">';
	}
	
	if(htmlAudioPlayer.canPlayType('audio/ogg') == "true" || 
		htmlAudioPlayer.canPlayType('audio/ogg') == "maybe" ){
		sourceList = sourceList + '<source src="' + mediaDir + 'ogg/'
					+ filenameMinusExt + '.ogg' + '" type="audio/ogg">';
	}
	
	htmlAudioPlayer.innerHTML = sourceList; 
	htmlAudioPlayer.play();
	
	return true; //todo - Right now I know of no way to verify that it will be played		
}

var g_force_player = false;

function audio_play_file(filenameMinusExt, mediaDir){
	if(g_force_player){
		switch(g_force_player){
			case "flash":
				playFlashAudio(mediaDir + "mp3/" + filenameMinusExt + ".mp3");
				return;
			case "html":
				playHTMLAudioWithSources(filenameMinusExt, mediaDir);
				return;
		}
	}
	
	if(g_android){
		if(playFlashAudio(mediaDir + "mp3/" + filenameMinusExt + ".mp3")){
			return;
		}
	} 

	if (g_html5_audio){
		if(playHTMLAudioWithSources(filenameMinusExt, mediaDir)){
			return;
		}
	} 

	//Attempt to play using Flash
	if(playFlashAudio(mediaDir + "mp3/" + filenameMinusExt + ".mp3")){
		return;
	}

	if (g_android){
		//just try mp3 and call it a day (at this point)
	    window.document.location.href = mediaDir + "mp3/" + filenameMinusExt + ".mp3";
	    return;
	} 
	
	//Next attempt to use the embedded player
	var embedPlayer = document.getElementById("id_embed_player");
	
	if (embedPlayer && embedPlayer.Play){
	    embedPlayer.SetURL(URL)
	    embedPlayer.Play()
	}else{
	    if (window.ActiveXObject){
	      window.document.location.href = URL
	      return;
	    }else{
	      window.open( URL, '_blank' )
	      return;
	    }
	}
}

function audio_play( URL )
{
	if(g_force_player){
		switch(g_force_player){
			case "flash":
				playFlashAudio(URL);
				return;
			case "html":
				playHTMLAudio(URL);
				return;
		}
	}
	
	if(g_android){
		if(playFlashAudio(URL)){
			return;
		}
	} 

	if (g_html5_audio){
		if(playHTMLAudio(URL)){
			return;
		}
	} 

	//Attempt to play using Flash
	if(playFlashAudio(URL)){
		return;
	}

	if (g_android){
	    window.document.location.href = URL
	    return;
	} 
	
	//Next attempt to use the embedded player
	var embedPlayer = document.getElementById("id_embed_player");
	
	if (embedPlayer && embedPlayer.Play){
	    embedPlayer.SetURL(URL)
	    embedPlayer.Play()
	}else{
	    if (window.ActiveXObject){
	      window.document.location.href = URL
	      return;
	    }else{
	      window.open( URL, '_blank' )
	      return;
	    }
	}
}

