function showReview()
{
	$("#footer").hide();
	$("#tableRows").html("");
	for (var i = 0; i < activityItems.length; i++)
	{
		var rowsOut = getRow(activityItems[i]);
		$("#tableRows").append(rowsOut);

	}
	//setFeedBackStatus("goToQuestions");
}

function getRow(activityItem)
{
		var destination_audio = getPlayButton(activityItem.destination_audio, activityItem.index);
		var time_audio = getPlayButton(activityItem.time_audio, activityItem.index);

		var rowsOut = "<div class='tableRow' id='row{0}'>".format(activityItem.index);
		rowsOut += "<div class='rowItem innerRowItem'>{0}</div>".format(activityItem.filler_airline);
		rowsOut += "<div class='rowItem innerRowItem'>{0}</div>".format(activityItem.filler_flight);
		rowsOut += "<div class='rowItem innerRowItem' style='font-size:18px'>{0} {1}</div>".format(activityItem.destination_tl, destination_audio);
		rowsOut += "<div class='rowItem innerRowItem' style='font-size:18px'>{0} {1}</div>".format(activityItem.time_tl, time_audio);
		rowsOut += "<div class='rowItem innerRowItem'>{0}</div>".format(activityItem.filler_gate);
		rowsOut += "<div style='clear: all'></div>";
		rowsOut += "</div>";

		return rowsOut;
}

function updateSetNavText()
{
	if (currentSet == 0)
	{
		$("#setDiv").hide();
	}
	else
	{
		$("#navDiv").show();
		$("#setDiv").show();
		$("#setText").html("{0}/{1}".format(currentQuestionIndex, questionSets.length))
	}
}

function showQuestion(index)
{
	currentQuestionIndex = index;
	$("input:radio").attr("checked", false);
	$(".answer").css("text-decoration", "");
	$(".answer").removeClass("selectedItemWrong selectedItemCorrect");
	$("#footer").show();
	$("#tableRows").html("");
	var tempArray = new Array();
	var activityQuestionObj = questionSets[index-1]; 
	tempArray.push(activityQuestionObj.correctActivityObj);
	tempArray.push(activityQuestionObj.distractors[0]);
	tempArray.push(activityQuestionObj.distractors[1]);
	shuffleArray( tempArray );

	for (var i = 0; i < tempArray.length; i++)
	{
		var isCorrect = questionSets[currentSet-1].correctActivityObj.index == tempArray[i].index;
		var rowsOut = getRow(tempArray[i]);
		$("#tableRows").append(rowsOut);
		$("#ans{0}".format(i)).html("<input type='radio' id='rdo{0}'></input>{1}".format(i + 1, tempArray[i].time_en));
		$("#ans{0}".format(i)).attr("answerIndex", tempArray[i].index);
		if (questionSets[currentSet-1].getSelected() == tempArray[i].index)
		{
			if (isCorrect)
			{
				$("#row{0} div".format(tempArray[i].index)).addClass("selectedRowItem");
				$("#rdo{0}".format(i + 1)).attr("checked", true);
			}
			var classStyle = isCorrect ? "selectedItemCorrect" : "selectedItemWrong";
			$("#ans{0}".format(i)).addClass(classStyle);
		}
	}

	$("#footerRight #question").html(activityQuestionObj.correctActivityObj.question);
	//setFeedBackStatus("review");
//	$("#feedBackStatus").bind('click', function() {
//		loadSet(0);
//	});
}

function highlightAnswer(answerNumber)
{
	if (questionSets[currentSet-1].frozen) return; 

	// for mouseover, show underline on and off
	$(".answer").css("text-decoration", "");
	$("#ans{0}".format(answerNumber)).css("text-decoration", "underline");
}

function showMarkedAnswer(selectedObj, isCorrect)
{
	// remove any other selections
	$(".answer").css("text-decoration", "");
	$(".answer").removeClass("selectedItemWrong selectedItemCorrect");

	// show selected items
	if (isCorrect)
	{
		var answerIndex = $(selectedObj).attr("answerIndex");
		$(selectedObj).addClass("selectedItemCorrect");
		//$("#row{0}".format(answerIndex)).addClass("selectedItemCorrect");
		$("#row{0} div".format(answerIndex)).addClass("selectedRowItem");

	}
	else
		$(selectedObj).addClass("selectedItemWrong");

}

function setTitles(tableTitle_en, tableTitle_tl)
{
	// set titles
	$("#titles #title_en").html(tableTitle_en);
	$("#titles #title_tl").html(tableTitle_tl);
}

function getPlayButton(audioFile, itemID)
{
	var buttonOut = "<div style='float:left' id=playBtn{0}> ".format(itemID);
	 buttonOut += "<a href=\"javascript:;\""; 
	 buttonOut += "	onmouseout=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s1.png',1)\" ";
	 buttonOut += "	onmousedown=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s3.png',1); audio_play('{0}');\" ".format(mediaPath + "mp3/" + audioFile);
	 buttonOut += "	onmouseup=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s2.png',1)\" ";
	 buttonOut += "	onmouseover=\"MM_swapImage('playBtn_s1','','../common/Library/images/playBtn_s2.png',1)\"> ";
	 buttonOut += "	<img class=\"playBtn\" src=\"../common/Library/images/playBtn_s1.png\" border=\"0\"></a> ";
	 buttonOut += "</div>";
	 return buttonOut;
}

function setFeedBackStatus(key)
{
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
		case "hint":
			$("#feedbackHeader").html("Hint");
			$("#feedbackText").html(text);
			break;
		case "activity_completed":
			$("#feedbackText").html(text);
			$("#feedbackHeader").html("Activity Completed");
			break;

	}
	
	$('#feedbackBox').show();
}

function closeFeedback(){
	$('#feedbackBox').hide();
	// checkActivityCompleted();	
}
