function Activity()
{
	this.UnitID = null;			// reference to parent Unit
	this.LessonID = null;			// reference to parent Lesson
	this.xmlPath = "";
	this.Title = "";
	this.ActivityFile = "";
	this.ActivityNum = -1;
	this.MenuItemID = "";
	this.Progress = new Progress();
	this.UnitObj = null;
	this.startTime = -1;
	this.activityHeight = "730";

	this.GetActivityFile = function()
	{
		var activityRoot = this.ActivityFile.split('.')[0];
		var activityFile = framework.configInfo.templates + activityRoot + "_html/" +  this.ActivityFile;
		// /lessons/japanese/xml/ja_001/
		var lessonPadded = pad(this.LessonID, 3);
		var xmlPath 	 = framework.configInfo.xmlPath + "/{0}_{1}/".format(framework.configInfo.targetLangSm, lessonPadded);
		var mediaPath 	 = framework.configInfo.mediaPath + "/{0}_{1}/".format(framework.configInfo.targetLangSm, lessonPadded);
		var parameters = "?student={0}&language={1}&lesson={2}&activity={3}&activityType={4}&xmlPath={5}&mediaPath={6}".format(framework.student.Email, framework.configInfo.targetLangSm, this.LessonID, this.ActivityNum, this.UnitObj.LessonType, xmlPath, mediaPath);

		return activityFile + parameters;
	}


	this.GetProgressStr = function()
	{
		var ProgressStr = framework.progress.getProgressString(this.UnitID, this.LessonID, this.ActivityNum)
		return ProgressStr;
	}

	this.GetProgress = function()
	{
		var Progress = framework.progress.getProgress(this.UnitID, this.LessonID, this.ActivityNum)
		return Progress;
	}

	this.setProgress = function(progress)
	{
		if (progress == 2 && this.Progress == 1) return; // activity was already completed, we don't revert 

		var duration = 0;
		if (progress == 1)
		{
			// calculate seconds to complete 
			if (this.startTime > 0)
			{
				var d=new Date();
				var currentTime = d.getTime();
				duration = currentTime - this.startTime;
				duration = Math.round(duration / 1000);
			}
		}

		this.Progress = progress;
		framework.progress.SetProgress(progress, this.UnitID, this.LessonID, this.ActivityNum, false, duration);
		framework.ui.menu.UpdateActivityButton(progress, this.ActivityNum);
	}
}