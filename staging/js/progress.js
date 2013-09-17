function Progress()
{
    this.courseProgressArray = new Array();  

	this.Unit = -1;
	this.Lesson = -1;

	this.SerializedProgress = '';

	var FrameworkObj = null;
	this.constructor = function(obj)
	{
		FrameworkObj = obj;
	}	

	this.SetToNextActivity = function(callback)
	{
		// advances the Unit, Lesson members to the next activty
		if (typeof callback == 'function') callback();
	}

	/*  -----------------------------------------------------------------------
	getProgress(unitID, lessonID, activityID)
	
	Call getProgress to get the specific progress for an activity.  The returned
	value is 0, 1, 2, 3  These progress integers are an enumeration defined
	at the top of this class as:
	 
	progressStatus = { "noAttempt": 0, "success": 1, "inProgress": 2, "failed": 3  
	-----------------------------------------------------------------------
	*/
	this.getProgress = function (unitID, lessonID, activityID)
	{
	    var key = "{0}-{1}".format(unitID, lessonID);
	    if (typeof this.courseProgressArray[key] == 'object')
	    {
	        if (typeof this.courseProgressArray[key][activityID] != 'undefined')
	        {
	            // activity passed in... give key status
	            var progressParts = this.courseProgressArray[key][activityID].split('-');
	            return progressParts[0];
	        }

	        if (typeof this.courseProgressArray[key]['status'] != 'undefined')
	        {
	            // activity not passed in... give key status
	            return this.courseProgressArray[key]['status'];
	        }

	    }

	    return 0;
	}

	this.getProgressString = function (unitID, lessonID, activityID)
	{
	    var progressStatus = this.getProgress(unitID, lessonID, activityID);
	    if (progressStatus == false)
	        return "Not Started"
	    else
	    {
	        if (progressStatus == 0) return "Not Started";
	        if (progressStatus == 1) return "Success";
	        if (progressStatus == 2) return "In Progress";
	        if (progressStatus == 3) return "Failed";
	    }
	}

	this.SetProgress = function(progress, unitID, lessonID, activityID, suppressDatabaseWrite, duration)
	{
		if (framework.student.UserType != 'Student') return;

		if (typeof duration == 'undefined')
		{
			var duration = 0;
		}

	    var key = "{0}-{1}".format(unitID, lessonID);
	    if (typeof this.courseProgressArray[key] == 'undefined')
	    {
	        this.courseProgressArray[key] = new Array();
	    }

	    if (typeof activityID != 'undefined')
	    {
	        this.courseProgressArray[key][activityID.toString()] = "{0}-{1}".format(progress, duration);
	    }
	    else
	    {
	        this.courseProgressArray[key]['status'] = progress;
	    }

	    if (typeof suppressDatabaseWrite == 'undefined' || suppressDatabaseWrite == false)
	    {
	        // write to the database
	        this.WriteProgress();
	    }
	}

	/*  -----------------------------------------------------------------------
	writeProgress()
		
	Serialize the courseProgressArray and all it's contents, then write
	to a cookie identified with the currently logged in user.
	-----------------------------------------------------------------------
	*/
	this.WriteProgress = function (callback)
	{
		if (framework.student.UserType != 'Student') 
		{
			if (typeof callback == 'function') callback();
			return;
		}

	    if (FrameworkObj.PreviewActivityMode == 'Preview')
		{
		    // No writing progress when we're only in preview activity mode
			if (typeof callback == 'function') callback();
			return;
		}

	    if (FrameworkObj.UserID)
	    {
	        var output = '';

	        for (var key in this.courseProgressArray)
	        {
	            for (var activityID in this.courseProgressArray[key])
	            {
	                if (typeof this.courseProgressArray[key][activityID] == "number" || typeof this.courseProgressArray[key][activityID] == "string")
	                {
	                    output += (key + '|' + activityID + '|' + this.courseProgressArray[key][activityID] + '~');
	                }
	            }
	        }

	        if (output != '' )
	        {
				FrameworkObj.dataObj.WriteProgress(output, callback);
	        }
	        else
	        {
                if (typeof callback == 'function') callback();
	        }
	    }
	}

	/*  -----------------------------------------------------------------------
	loadCourseProgress()

	Read the progress from DB and load up the internal progress array.
    progressType can be "progress" or "quiz"

	-----------------------------------------------------------------------
	*/
	this.LoadCourseProgress = function (callBack)
	{

		var LoadProgressComplete = function()
		{
			FrameworkObj.progress.LoadLocalProgress(function() {
				if (typeof callBack == 'function') callBack();
			});
		}

		FrameworkObj.dataObj.GetCourseProgress(LoadProgressComplete);
	}

/*
	loadLocalProgress() 
	
	This method takes the serialized progress string that is stored in the database, and 
	unserializes it. The progress is stored in an array.  Supporting functions are later used
	to retrieve specific progress for units and lessons.

*/
	this.LoadLocalProgress = function (callBack)
	{
        this.courseProgressArray = [];
		var progress = FrameworkObj.progress.SerializedProgress;
		// siteMessage(progress);
	    if (FrameworkObj.progress.SerializedProgress)
	    {
	        var lessons = progress.split("~");
	        var lessonCount = lessons.length;
	        var cnt;

	        for (cnt = 0; cnt < lessonCount; cnt++)
	        {
	            if (lessons[cnt] != '')
	            {
	            	
	                lessonDetails = lessons[cnt].split('|');

	                var activityIndex = lessonDetails[0];
	                var activityParts = getUnitModLesson(activityIndex);
	                var key = activityParts[0] + '-' + activityParts[1] + '-' + activityParts[2] + '-';
	                var activityID = lessonDetails[1];
	                var progress = lessonDetails[2];
	                var keyParts = key.split('-');
	                var unitID = keyParts[0];
	                var lessonID = keyParts[1];

	                FrameworkObj.progress.SetProgress(progress, unitID, lessonID, activityID, true);
	            }
	        }
	    }
		if (typeof callBack == 'function') callBack();
	}	

	this.GetUnitProgress = function(UnitID)
	{

	}

	this.GetLessonProgress = function()
	{
		
	}
}