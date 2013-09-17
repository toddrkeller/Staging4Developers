// ActivityItem holds the content for an item (row)
function ActivityItem(itemObj, index)
{
	this.index 				= index;
	this.audio 				= $(itemObj).attr("audio");;
	this.destination_en 	= $(itemObj).find("english").text();
	this.destination_tl 	= $(itemObj).find("translation").text();
	this.destination_audio 	= $(itemObj).find("translation").attr("audio");
	this.time_en 			= $(itemObj).find("time_english").text();
	this.time_tl 			= $(itemObj).find("time_tl").text();
	this.time_audio 		= $(itemObj).find("time_tl").attr("audio");
	this.question 			= $(itemObj).find("q").text();
	this.filler_airline 	= $(itemObj).find("filler").attr("airline");
	this.filler_flight 		= $(itemObj).find("filler").attr("flight"); $("filler_flight").addClass (".flight");
	this.filler_gate 		= $(itemObj).find("filler").attr("gate");
	this.hint 				= $(itemObj).find("hint").text();
	this.hint_dir 			= $(itemObj).find("hint").attr("dir");
	this.feedback 			= $(itemObj).find("feedback").text();
	this.feedback_dir 		= $(itemObj).find("feedback").attr("dir");
	this.isCorrectAnswer	= false;
}

// QuestionSet holds the information for a question set
function QuestionSet(activityObj)
{
	this.hitCount = 0;
	this.frozen = false;
	this.correctActivityObj = activityObj;
	this.distractors = new Array();
	this.selectedAnswer = -1;

	this.addDistractors = function(possibleItems)
	{
		shuffleArray( activityItems );
		for (var i = 0; i < possibleItems.length; i++)
		{
			if (this.correctActivityObj.index != possibleItems[i].index)
			{
				this.distractors.push(possibleItems[i]);
				if (this.distractors.length == 2) return;
			}
		}
	}

	this.getSelected = function()
	{
		return this.selectedAnswer;
	}

	this.setSelected = function(selectedAnswer)
	{
		this.frozen = this.correctActivityObj.index == selectedAnswer;
		this.selectedAnswer = selectedAnswer;
	}
}