function Module()
{
	this.UnitID = null;			// reference to parent Unit
	this.ModuleID = null;
	this.Lessons = new Array(); // will hold array of Lesson objects
	this.ActiveLesson = -1; 	// index of active lesson
	this.Progress = new Progress();
	this.MenuItemID = "";

	this.GetActivity = function(lessonID, ActivityNumber)
	{
		return this.Lessons[lessonID-1].GetActivity(ActivityNumber);
	}

	this.GetLessons = function()
	{
		// load Lessons array
	}

	this.GetActiveLesson = function()
	{
		// return active Lesson
	}

	this.GetProgress = function()
	{
		// return Module progress
		var PossibleLessonPersentages = this.Lessons.length * 100;
		var LessonPercentsComplete = 0;
		for (var i = 0; i < this.Lessons.length; i++)
		{
			var LessonObj = this.Lessons[i];
			var LessonPercent = LessonObj.GetProgress();
			LessonPercentsComplete += LessonPercent;
		}

		if (LessonPercentsComplete == 0) return 0;
		if (LessonPercentsComplete == PossibleLessonPersentages) return 100;

		return Math.round( (LessonPercentsComplete/PossibleLessonPersentages) * 100, 1  );
	}

	this.GetLessonListItems = function()
	{
		var LessonListItems = "";
		var ActivityListItems = "";
		for (var i = 0; i < this.Lessons.length; i++)
		{
			var LessonObj = this.Lessons[i];
			LessonObj.MenuItemID = "lessonMenuItem_{0}_{1}".format(this.ModuleID, i+1);

			var Progress = LessonObj.GetProgress();
			ActivityListItems = LessonObj.GetActivityListItems(); 
			LessonListItems += "<li><a id='{0}' href='#'>Lesson: {1} ({2}%)</a><ul>{3}</ul></li>".format(LessonObj.MenuItemID, i + 1, Progress, ActivityListItems);
		}
		return LessonListItems;	
	}
}