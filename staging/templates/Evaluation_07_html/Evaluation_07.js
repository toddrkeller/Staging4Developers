$(document).ready(function() {
	$('#id_feedback').hide();
	//Default values (for testing)

	// Values from URL parameters or default values for testing
	var statusParameters = getPassedParameters();
	if (!statusParameters) {
		mediaPath 	= "sampleData/";
		xmlPath 	= "sampleData/";
		
		// For performance - homework
		////xmlFilename = xmlPath + "vb_02_01_06_01_noNamespaces_hw.xml";
	        xmlFilename = xmlPath + "Evaluation_07_noNamespaces.xml";
		//jsonFilename = xmlPath + "vb_02_01_06_01_noNamespaces_hw.js";
	        jsonFilename = xmlPath + "Evaluation_07_noNamespaces.js";
	}
	else {
		// For performance - homework
		var xmlPath2 = xmlPath.split("/");
		var activityID = getURL_Parameter('activity');
	
		if (activityID.length < 2 ) {
			activityID =+ "0" + activityID;
		}
		
		xmlFilename  = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  "." +xmlPath2[xmlPath2.length-3].toString();
		jsonFilename = xmlPath + xmlPath2[xmlPath2.length-2].toString() + "_" + activityID +  ".js" ;
		
		$('.activity_hd').html('');
		$('.activity_description').html('');
	}


	////mediaPath = "sampleData/";
	////audioPath = "sampleData/mp3/"
	////imagePath = "sampleData/png/"
	cssFilename = "styles/Evaluation_07_default.css";
	////xmlFilename = mediaPath + "Evaluation_07_noNamespaces.xml";
	////jsonFilename = mediaPath + "Evaluation_07_noNamespaces.js";

	testVideoSupport();
	loadActivity(parseXml);
	audioInit();
});


var numSets;
var answer_image;
var dist_image;
var aud;
var audios=[];
var crrtAnswers=[];
var studentAnswers=[];
var css_borders=[];
var imgFades=[];
var set_images=[];

// For homework
var homeworkStatus;
String.prototype.format = function () {
    var s = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    return s;
}
//
function parseXml(t_xml){
  	homeworkStatus = $(xml).find("content").attr("hw");
	numSets = $(xml).find("set").length;
	set_images= new Array(numSets);

	for(var i=0; i< numSets; i++){
                set_images[i]= new Array(4);
                aud = $(xml).find("set").eq(i).find("tl_main_audio").attr("name");
                audios.push(aud);

         	answer_image = $(xml).find("set").eq(i).find("answer_image").attr("name");
         	crrtAnswers.push(answer_image);

                imgFades.push(0);
         	studentAnswers.push(0);
         	css_borders.push('null');
                set_images[i][0] = answer_image

                for (j=0; j<3; j++){
                    dist_image = $(xml).find("set").eq(i).find("distractor").eq(j).attr("name");
                    set_images[i][j+1]= dist_image;
                }
            shuffleArray(set_images[i]);
            }
	loadSet(0);
	// To integrate into the framework
	$('#prev').click(function () {
			prevClick();
		});
	$('#next').click(function () {
			nextClick();
		});
        }


function loadSet(value){
  	currentSet = value;
  	////updateNavButtons()
        updateSetText();
	$("#clickGuard").css("display", "none");

        var get_images = set_images[currentSet];
        $(".image").fadeTo(0, 0.4);
        if(imgFades[currentSet] == 1){
             $(".image").stop().fadeTo(0, 1);
          }

        $(".image").addClass('white');

        $(".image").each(function(index){
          ////$(this).attr('src', imagePath + get_images[index]);
          $(this).attr('src', mediaPath + "png/" + get_images[index]);
          $(this).css('width', '320');
          $(this).css('height', '240');
          if(index ==  css_borders[currentSet]) {
              $(this).removeClass('white');
              $(this).addClass('darkYellow');
              }

          $(this).click(function(){
            if(imgFades[currentSet] == 1){
               $(".image").addClass('white');
               $(this).removeClass('white');
               $(this).addClass('darkYellow');

               var thisImage = $(this).attr('src')
               var answerImage = thisImage.split("/")[2]
               studentAnswers.splice(currentSet, 1, answerImage);
               css_borders.splice(currentSet, 1, index);
               ////alert(checkAllAnswered())
                if (checkAllAnswered())
                     $("#submit").show();
               }
            })
        })

        $("#playBtn").click(function() {
            if(imgFades[currentSet] == 0) {
              $(".image").stop().fadeTo(0, 1);
              imgFades.splice(currentSet, 1, 1);
            }
            playAudio(currentSet);
        })

   }




function nextClick(){
	if(setBtnLock)
		return;

	if(currentSet != numSets - 1){
		loadSet(currentSet + 1);
	}
}

function prevClick(){
	if(setBtnLock)
		return;
	
	if(currentSet != 0){
		loadSet(currentSet - 1);
	}
}


function playAudio(num){
            ////audio_play(audioPath + audios[num]);
            audio_play_file(removeFileExt(audios[num]),mediaPath);
   }
   
function checkAllAnswered() {
                 for (var i=0; i<numSets; i++){
                   if(studentAnswers[i] == 0){
                      return false;
                      }
                  }
                  return true;
  }

////var activityCompletedShown = false;
function getStudentInput(){
   var correctItems =0;
   var questionID = 0;
   var answerAttempts;
   var showCorrAns=[];
   var showStudAns=[];
   for (var i=0; i<numSets; i++){
     ////alert(studentAnswers[i])
       if( crrtAnswers[i] != 0 &&  studentAnswers[i] != 0 ) {
         showCorrAns.push(crrtAnswers[i].replace(/\.[^/.]+$/, "")) ;
         showStudAns.push(studentAnswers[i].replace(/\.[^/.]+$/, ""));
         }
       else{
          showCorrAns.push(crrtAnswers[i]) ;
          showStudAns.push(studentAnswers[i]);
       }
       
        if(crrtAnswers[i]==studentAnswers[i])
            correctItems++
    }

    answerAttempts = (correctItems/numSets)*100;

    ////$("#feedbackText2").html("Assessment HW// " + answerAttempts);
    	logStudentAnswer(questionID, showStudAns, showCorrAns);
	logStudentAnswerAttempts(questionID, answerAttempts);
	
		////$('#feedbackText2').show();
  }



function checkAnswers(){

  
   var correctItems =0;
   for (var i=0; i<numSets; i++){
        if(crrtAnswers[i]==studentAnswers[i])
            correctItems++
      }
   var stScore = correctItems/numSets;

   
	var passingScore = $(xml).find("content").attr("passing_score");
	if(passingScore == undefined || passingScore == NaN)
			passingScore = .8;
		else
			passingScore = passingScore;
//	alert(stScore)
	if ( stScore >= passingScore){ 
		if(parent.activityCompleted){
			parent.activityCompleted(1,0);
			}
		else
			showFeedback("activity_completed", "Passed!")
	}
	else
		showFeedback("activity_completed", "Failed!")
	////activityCompletedShown = true;

   $(".image").unbind("click");
   ////$("#playBtn").hide();
   $('#submit').hide();
   $('#container_setDiv').hide();






	// For homework
  if (homeworkStatus) {
      getStudentInput();
      }
   }

function showFeedback(value, text){
	//Clear the dialog box
	$("#feedbackHeader").html("");
	$("#feedbackText").html("");
	
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
			break;
		case "activity_completed":
			$("#feedbackHeader").html("Activity Completed");
			$("#feedbackText").html(text);
			break;
	}
	
	$('#id_feedback').show();
}


function closeFeedback(){
       	$('#id_feedback').hide();
        $("#activities").fadeTo(0, 0.4);

	////if(activityCompletedShown)
		$("#clickGuard").css("display", "inline");
	////else
		/////$("#clickGuard").css("display", "none");

   }

////var activityCompletedShown = false;
