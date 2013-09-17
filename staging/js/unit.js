function Unit()
{
	this.UnitID = -1;
	this.Title = "--";
	this.Lessons = new Array();

	this.Progress = new Progress();
	this.MenuItemID = "";
	// this.ActiveLesson = -1;

	this.LoadLessons = function(LessonArray)
	{
		for (var i = 0; i < LessonArray.length; i++)
		{
			var UnitLessonNumber = getLessonNumber(LessonArray[i].lessonID);
			var UnitID = UnitLessonNumber[0];
			var LessonID = UnitLessonNumber[1];
			var LessonIndex = LessonArray[i].lessonID;

			var newLesson = new Lesson();
			newLesson.LessonID = LessonID;
			newLesson.LessonIndex = LessonIndex;
			newLesson.UnitID = UnitID;
			newLesson.LessonType = LessonArray[i].lessonType;
			newLesson.Initialize();
			this.Lessons.push(newLesson);
		}
	}

	this.GetLessonObj = function(LessonID, LessonType)
	{
		var count = 0;
		for (var i = 0; i < this.Lessons.length; i++)
		{
			var LessonObj = this.Lessons[i];
			if (LessonObj.LessonType == LessonType && LessonObj.LessonID == LessonID)
			{
				return LessonObj;
			}
		}
	}

	this.GetActivityListItems = function(LessonID, LessonType)
	{
		var LessonObj = this.GetLessonObj(LessonID, LessonType);
		var ActivityLinks = LessonObj.GetActivityListItems();
		return ActivityLinks;
	}

	this.GetActivity = function(lessonID, ActivityNumber)
	{
		var ActivityObj = this.Lessons[lessonID-1].GetActivity(ActivityNumber);
		return ActivityObj;
	}

	// this.GetActiveLesson = function()
	// {
	// 	// return active Lesson
	// }

	this.GetProgress = function()
	{
		// return Lesson progress
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

	this.GetLessonListItems = function(lessonType, clean)
	{
		var LessonListItems = "";
		var ActivityListItems = "";
		for (var i = 0; i < this.Lessons.length; i++)
		{
			var LessonObj = this.Lessons[i];
			if (LessonObj.LessonType == lessonType)
			{
				LessonObj.MenuItemID = "lessonMenuItem_{0}_{1}".format(this.UnitID, i+1);

				var Progress = LessonObj.GetProgress();
//				ActivityListItems = LessonObj.GetActivityListItems(); 

				var LessonID = LessonObj.LessonID;
				var LessonType = LessonObj.LessonType;
				if (clean)
				{
					LessonListItems += '<li style="text-align:left">Lesson {0} ({1}%)</li>'.format(LessonID, Progress);
				}
				else
				{
					//LessonListItems += '<li style="text-align:left"><a id="{0}" href="javascript:framework.ui.menu.showActivityNav({1}, \'{2}\')">Lesson {3} ({4}%)</a></li>'.format(LessonObj.MenuItemID, LessonID, LessonType, LessonID, Progress);
					LessonListItems += '<li style="text-align:left"><a id="{0}" href="javascript:framework.ui.menu.showActivityNav({1}, \'{2}\')">Lesson - {3}</a></li>'.format(LessonObj.MenuItemID, LessonID, LessonType, LessonID);
				}

				if (i == 4 && !clean)
				{
					LessonListItems += '<li class="divider"></li>';
					LessonListItems += '<li><a href="#">Quiz</a></li>';
					LessonListItems += '<li class="divider"></li>';
				}
			}
		}
		if (LessonListItems != "" && !clean)
		{
			LessonListItems += '<li class="divider"></li>';
			LessonListItems += '<li><a href="#">Quiz</a></li>';
		}
		return LessonListItems;	
	}	
}