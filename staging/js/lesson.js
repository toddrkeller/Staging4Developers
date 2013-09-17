function Lesson()
{
	this.LessonXMLFileName = "";
	this.LessonID = -1;
	this.LessonIndex = -1;
	this.UnitID = null;			// reference to parent Unit
	this.Activities = new Array(); // will hold array of Activity objects
	this.ActiveActivity = -1; 	// index of active Activity
	this.MenuItemID = "";
	this.LessonType = ""; // homework or classroom
	this.CultureFilename_EN = "";	
	this.CultureFilename_TL = "";
	this.GrammarFilename = "";
	this.Objective = "";


	this.Initialize = function()
	{
		// Open lesson xml file and traverse, loading the Activities array
		var dir = "{0}_l{1}".format(framework.configInfo.targetLangSm, pad(this.LessonIndex, 2));
		if (gv_homework == true)
			dir = "{0}_h{1}".format(framework.configInfo.targetLangSm, pad(this.LessonIndex, 2));
        var ajaxURL = "{0}/{1}/{2}.xml".format(framework.configInfo.xmlPath, dir, dir);
		//var ThisRef = "" ;//this;  // needed because we lose 'this' on ajax calls
		var ThisRef = this;  // needed because we lose 'this' on ajax calls

		// read from /config.xml
        $.ajax({
            type: "GET",
            url: ajaxURL,
            //async: false,
            dataType: ($.browser.msie) ? "text" : "xml",
			success: function (data)
            {
                data = parseXml(data);
                // var objective = task_objective
				
                // get lesson details
                ThisRef.Objective 			= $(data).find("lesson_objective").text();
                ThisRef.GrammarFilename 	= $(data).find("grammarFile").text();
                ThisRef.CultureFilename_EN = $(data).find("cultureFile_en").text();
                ThisRef.CultureFilename_TL = $(data).find("cultureFile_tl").text();


            	// traverse all activitiy nodes
	            $(data).find("activity").each(
	            function (index, value)
	            {
	            	// index is the iteration
					
                    var activityTitle = $(value).find("title").text();
                    var activityFile =  $(value).attr('template');
					var xmlFile = $(value).attr('xml'); 
					//alert($(value).attr('template'))
	            	//var newActivity = new Activity();
					var newActivity ={};
	            	newActivity.UnitObj = ThisRef;
					newActivity.UnitID = ThisRef.UnitID;
					newActivity.LessonID = ThisRef.LessonID;
					newActivity.Title = activityTitle;
					newActivity.ActivityNum = ThisRef.Activities.length + 1; 
					newActivity.xmlPath = "{0}/{1}".format(framework.configInfo.xmlPath, dir);
					newActivity.xmlFile = xmlFile;
					newActivity.ActivityFile = activityFile;

					var activityHeight = $(value).attr('activityHeight');
					if (typeof activityHeight != "undefined")
					{
						newActivity.activityHeight = activityHeight;
					}

					ThisRef.Activities.push(newActivity);
	            });
            },
            error: function (XMLHttpRequest, status, error)
            {
				alert( 'cannot find the lesson xml.');
                // logError("Lesson Initialze: " + error);
            }
        });				
		
	}
	
	this.getCultureFilename = function(langType)
	{
		if (langType == 'TL' )
			return this.CultureFilename_EN;
		else
			return this.CultureFilename_TL;
	}

	this.getGrammarFilename = function()
	{
		return this.GrammarFilename;
	}

	this.GetActivity = function(ActivityNumber)
	{
		return this.Activities[ActivityNumber-1];
	}

	this.GetActiveActivity = function()
	{
		// return active Activity
	}

	this.GetProgress = function()
	{
		// return Lesson progress
		var ActivityCount = this.Activities.length;
		if (ActivityCount == 0) return 100;

		var SuccessCount = 0;
		for (var i = 0; i < ActivityCount; i++)
		{
			if (this.Activities[i].GetProgressStr() == "Success") SuccessCount++;
		}

		if (SuccessCount == 0) 
			return 0;
		else
			return Math.round( (SuccessCount/ActivityCount) * 100 );
	}

	this.GetActivityListItems = function()
	{
		var ActivityListItems = '<button id="lesson_btn_{0}" class="btn" title="">Lesson {1} Activities</button>'.format(this.LessonID, this.LessonID);		
		//alert("Please make sure the lesson xml is in the right folder")
		for (var i = 0; i < this.Activities.length; i++)
		{
			//alert('hi activity ' + i)
			var ActivityObj = this.Activities[i];
			ActivityObj.MenuItemID = "activityMenuItem_{0}_{1}".format(this.LessonID, i + 1);
			var Title = ActivityObj.Title;
			
			var Progress = 0 // ActivityObj.GetProgress();
			var ProgressColor = "";
			if (Progress > 0)
			{
				//ProgressColor = " style='color:{0}'".format(framework.ui.menu.StatusColor[Progress]);
				ProgressColor = framework.ui.menu.StatusColor[Progress];
				$("#activity_btn_{0}".format(i+1)).css("background-img", "");
			}
			else 
			{
				$("#activity_btn_{0}".format(i+1)).css("background-img", "url(/bootstrap/img/bg_btn.png)");
			}

			//var activityLink = "framework.LaunchActivity({0}, {1}, 'activityDialog');".format(this.LessonIndex, i+1);
			var activityLink = "findTheActivity({0}, {1}, '{2}', '{3}','{4}');".format(this.LessonID, i+1, this.Activities[i].xmlPath, this.Activities[i].xmlFile, this.Activities[i].ActivityFile );
			
			// ActivityListItems += '<button id="activity_btn_{0}" onclick="{1}" class="btn {2}" title="{3}">{4}</button>'.format(i+1, activityLink, //framework.ui.menu.StatusColor[Progress], Title, i+1);
			ActivityListItems += '<button id="activity_btn_{0}" onclick="{1}" class="btn {2}" title="{3}">{4}</button>'.format(i+1, activityLink, ProgressColor, Title, i+1);
		}
		//alert(ActivityListItems);
		return ActivityListItems;		
	}
}