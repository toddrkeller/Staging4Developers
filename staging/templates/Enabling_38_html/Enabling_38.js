$(document).ready(function() {
	$('#feedback_en38').hide();
	loadjscssfile("../common/css/activityDefault.css", "css");
	if ( getPassedParameters() == false){
		//Default values (for testing)
		mediaPath = "sampleData/";		
		xmlFilename = mediaPath + "Enabling_38_noNamespaces.xml";
		jsonFilename = mediaPath + "Enabling_38_noNamespaces.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();

		$('.activity_hd').html('');
		$(".activity_description").html('');
	}
	
	cssFilename = "styles/enabling_38_dlilearn.css";
	testVideoSupport();
	loadActivity(parseXml);
	audioInit();
});


var numSets;
var note;
var aud;
var img;
var numPhrase;

var answer_image;
var dist_image;
var aud;

var psgArr=[];
var audArr=[];
var txtArr=[];
var txtArrFixed=[];
var crrtArr=[];
var wrgArr=[];

var selAnswered = [];
var txtAnswered = [];
var checkAnswered = [];

var actGuard=[];
var txtGuard=[];
var setCompleted =[];
var mainAudCompleted=[];

function parseXml(t_xml){
	numSets = $(xml).find("set").length;
	numPhrase = $(xml).find("set").find("phrase").length/numSets;

	psgArr= new Array(numSets);
        audArr= new Array(numSets);
        txtArr= new Array(numSets);
        txtArrFixed= new Array(numSets);
        crrtArr= new Array(numSets);
        wrgArr= new Array(numSets);

        selAnswered= new Array(numSets);
        txtAnswered= new Array(numSets);
        checkAnswered= new Array(numSets);

	for(var i=0; i< numSets; i++){
                psgArr[i] = new Array(3);

                audArr[i] = new Array(numPhrase);
                txtArr[i] = new Array(numPhrase);
                txtArrFixed[i] = new Array(numPhrase);
                crrtArr[i] = new Array(numPhrase);
                wrgArr[i] = new Array(numPhrase);
                
                selAnswered[i] = new Array(numPhrase);
                txtAnswered[i] = new Array(numPhrase);
                checkAnswered[i] = new Array(numPhrase);


                note = $(xml).find("set").eq(i).find("psg").find("note").text();
                aud = $(xml).find("set").eq(i).find("psg").find("audio").text();
                img = $(xml).find("set").eq(i).find("psg").find("image").text();

                psgArr[i][0] = note;
                psgArr[i][1] = aud;
                psgArr[i][2] = img;  
                actGuard.push(0);
                txtGuard.push(0);
                setCompleted.push(0);
                mainAudCompleted.push(0);

	        for (var j=0; j< numPhrase; j++)
	          {
                  audio = $(xml).find("set").eq(i).find("phrase").eq(j).find("audio").text();
                  txt =  $(xml).find("set").eq(i).find("phrase").eq(j).find("txt").text();
                  cfb =  $(xml).find("set").eq(i).find("phrase").eq(j).find("crrt_fdbk").text();
                  wfb =  $(xml).find("set").eq(i).find("phrase").eq(j).find("wrng_fdbk").text();

                  audArr[i][j] =  audio;
                  txtArr[i][j] =  txt;
                  txtArrFixed[i][j] =  txt;
                  crrtArr[i][j] = cfb;
                  wrgArr[i][j] =  wfb;
                  
                  selAnswered[i][j] = null;
                  txtAnswered[i][j] = null;
                  checkAnswered[i][j] = 0;
               }
               shuffleArray(txtArr[i]);
           }
	loadSet(0);
        }

function loadSet(value){
  	currentSet = value;
//  	updateNavButtons()
        updateSetText();
		show_set_completed = false;
	$("#clickGuard").css("display", "none");
        $("#txtGuard").show();
	if(txtGuard[currentSet] == 1)
   	     $("#txtGuard").show();
	$("#activityGuard").show();
	if(actGuard[currentSet] == 1)
             $("#activityGuard").hide();
        $("#main_text").html( psgArr[currentSet][0] );
        $("#main_image").attr('src', mediaPath + "png/" + psgArr[currentSet][2]);
        if (mainAudCompleted[currentSet] == 1) {
                  $('#playBtnContainer_dummy').show();
                  $('#playBtnContainer').hide();
           }
           
        else{
            $('#playBtnContainer').show();
            $('#playBtnContainer_dummy').hide();
           }

        $("#playBtn").click(function() {
          if(mainAudCompleted[currentSet]==0)
             audio_play_file(removeFileExt(psgArr[currentSet][1]),mediaPath);
            $("#activityGuard").hide();
            actGuard.splice(currentSet, 1, 1);
           })

        $(".textBox38").each(function(index){
          $(this).html(txtArr[currentSet][index])
          })

        playAudioPhrase();

        var textNum = null;
        var txtIdNum = null;
        var selIdNum = null;

        $(".selectBox").addClass('white');
        $(".selectBox").css('color', '#666666');
        $(".selectBox").addClass('pointer');
        $(".selectBox").each(function(index){
          $(this).click(function(){
             $(".selectBox").removeClass('blue');
             $(".selectBox").addClass('white');
             $(this).removeClass('white');
             $(this).addClass('blue');
             $("#txtGuard").hide();

             var selId = $(this).attr('id')
             selIdNum = parseInt(selId.substr(4))
               })

             if(index ==  selAnswered[currentSet][index])  {
                $(this).off('click');
                $(this).css('color', '#cccccc');
                $(this).removeClass('pointer');
                }
           })

        $(".textBox38").css('color', '#666666');
        $(".textBox38").addClass('pointer');
		$(".textBox38").addClass('white');
        $(".textBox38").each(function(index){
            $(this).hover(function(){
			  $(this).removeClass('white');	
              $(this).addClass('blue');
              },function(){
              $(this).removeClass("blue");  
			  $(this).addClass('white');		
              });
            $(this).click(function(){
               ////event.preventDefault();
			    $(this).removeClass('blue');	
				$(this).addClass('white');
               txtGuard.splice(currentSet, 1, 0);
               var stuClicked= $(this).html()
               var findArr=  txtArrFixed[currentSet]
                  for (var i=0; i<numPhrase; i++)  {
                    if(stuClicked == findArr[i])
                       textNum = i
                  }

               var txtId = $(this).attr('id')
               txtIdNum = parseInt(txtId.substr(4))
               checkMatch(currentSet, selIdNum, textNum, txtIdNum)
               })

            if(index ==  txtAnswered[currentSet][index])  {
                $(this).off('click')
                $(this).unbind('hover');
                $(this).removeClass('blue');
				$(this).addClass('white');
                $(this).removeClass('pointer');
				$(this).css('color', '#cccccc');
                }
          })	
	setTimeout( enableMcScrollbar, 100);
   }

function enableMcScrollbar(){
	$("#main_text").mCustomScrollbar({
		scrollButtons:{
			enable:true
		}
	});
}

function playAudioPhrase(){
        $("#playBtn_s0").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][0]),mediaPath);
        })

        $("#playBtn_s1").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][1]),mediaPath);
        })
        $("#playBtn_s2").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][2]),mediaPath);
        })
        $("#playBtn_s3").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][3]),mediaPath);
        })
  }

function playAudioPhrase2(){
        $("#playBtn_0").addClass('pointer');
        $("#playBtn_0").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][0]),mediaPath);
        })
        $("#playBtn_1").addClass('pointer');
        $("#playBtn_1").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][1]),mediaPath);
        })
        $("#playBtn_2").addClass('pointer');
        $("#playBtn_2").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][2]),mediaPath);
        })
        $("#playBtn_3").addClass('pointer');
        $("#playBtn_3").click(function() {
            audio_play_file(removeFileExt(audArr[currentSet][3]),mediaPath);
        })
   }

function checkMatch(currentSet,selIdNum, textNum, txtIdNum ) {
  $(".selectBox").removeClass('blue');
  $(".selectBox").addClass('white');

	if(selIdNum ==  textNum) {
		showFeedback("correct", "correct", currentSet, selIdNum);
		checkAnswered[currentSet].splice(selIdNum, 1, 1);
	
	   $(".selectBox").each(function(index){
		  if (index == selIdNum){
			  $(this).off('click')
			  $(this).css('color', '#cccccc')
			  $(this).removeClass('pointer');          

			  selAnswered[currentSet].splice(index, 1, index);
			  }
		  })

	   $(".textBox38").each(function(index){
			if (index == txtIdNum){
				$(this).off('click');
				$(this).css('color', '#cccccc');
				$(this).unbind('hover');
				$(this).removeClass('blue');
				$(this).addClass('white');
				$(this).removeClass('pointer');
				txtAnswered[currentSet].splice(index, 1, index);
			}
		})
	}
	else {
		showFeedback("incorrect", "incorrect", currentSet, selIdNum)
	}
//
}


function setsCompleted() {
     for (var i=0; i<numSets; i++){
            if(currentSet==i) {
            for (var j=0; j<numPhrase; j++) {
                     if(checkAnswered[currentSet][j] == 0){
                        return false;
                        }
                      }
                      setCompleted.splice(currentSet, 1, 1);
            }
         }
     }

function activityCompleted() {
     for (var i=0; i<numSets; i++){
            for (var j=0; j<numPhrase; j++) {
                     if(checkAnswered[i][j] == 0){
                        return false;
                        }
                    }
         }
         return true;
      }


function addAudio(selIdNum){
    var addAud = '<div><img  id="playBtn_' + selIdNum + '"  alt="play button" src="../common/Library/images/playBtn_s1.png" style="width:30px;height:30px;" border="0"></div>'
    return addAud
    }



function showFeedback(value, text, currentSet, selIdNum){
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	$("#clickGuard").css("display", "block");
	switch(value){
		case "incorrect":
			$("#feedbackHeader").html('<img  id="incorrect_img"  alt="incorrect" src="../common/img/feedback_incorrect.png" style="width:201px;height:36px;" border="0">');
			$("#feedbackText").html(wrgArr[currentSet][selIdNum]);
			////$("#feedbackText").html(text);
			break;
		case "correct":
			$("#feedbackHeader").html('<img id="correct_img"  alt="correct" src="../common/img/feedback_correct.png" style="width:181px;height:36px;" border="0">');
			$("#feedbackText").html(crrtArr[currentSet][selIdNum] + '<br \><br \>' + addAudio(selIdNum));
			playAudioPhrase2();
			////$("#feedbackText").html(text);
			break;
		case "set_completed":
			$("#feedbackHeader").html("Set Completed");
			$("#feedbackText").html("<br /><br />Go to the Next Set.");
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackText").html("<br /><br />Go to the Next Activity.");
			break;
	}

	$('#feedback_en38').show();
	$('#feedbackText').mCustomScrollbar({
		scrollButtons:{
			enable:true
		}
	});
}

var show_set_completed = false;
var activityAllCompleted = true;
function closeFeedback(){
	$('#feedback_en38').hide();
	$('#txtGuard').show();
	$("#clickGuard").css("display", "none");	
	txtGuard.splice(currentSet, 1, 1);
   setsCompleted();
   if( setCompleted [currentSet] == 1 && !show_set_completed){
		if(!activityCompleted()) {
			showFeedback('set_completed')
			mainAudCompleted.splice(currentSet, 1, 1);
			$('#playBtnContainer_dummy').html('<img  id="dummyPlayBtn" class="playBtn" alt="play button" src="../common/img/btn_play_sm_off.png"  border="0">')
			$('#playBtnContainer_dummy').show();
			$('#playBtnContainer').hide();
			show_set_completed = true;
		}   
		else{
			if(activityAllCompleted){
			 ////alert('activity completed');
				showFeedback('activity_completed');
				activityAllCompleted = false;
				$("#clickGuard").css("display", "inline");
			}
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


