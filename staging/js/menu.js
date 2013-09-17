function Menu()
{
	this.StatusColor = new Array();
	this.StatusColor[0] = ""; // noAttempt
	this.StatusColor[1] = "btn-success", // success 
	this.StatusColor[2] = "btn-info",  // inProgress 
	this.StatusColor[3] = "btn-danger";   // failed
	this.StatusColor[4] = "btn-warning"; // Active 

	this.constructor = function()
	{
		this.ActiveUnit = -1;
		this.ActiveLesson = -1;
		this.ActiveActivity = -1;
	}

	this.ShowMenu = function(View)
	{
		var MenuOut = "";
		// loop through the Unit object and display course menu
		var ClassLessonItems = "";
		var HomeworkLessonItems = "";
		var DropDownUnitItems = "";
		var LessonItems = "";
		for (var i = framework.Units.length-1;  i >= 0 ; i--)
		{
			var UnitObj = framework.Units[i];
			UnitObj.MenuItemID = "lessonMenuItem_{0}".format(i+1);

			if (UnitObj.Lessons.length > 0)
			{
				var Lessons = UnitObj.GetLessonListItems(View);
				LessonItems = "<ul class=\"dropdown_chooseunit\">{0}</ul>".format(Lessons);
				$("#dropdown_unit_{0}".format(i+1)).html(LessonItems);
				$("#unit_button_{0}".format(i+1)).attr("data-dropdown","#dropdown_unit_{0}".format(i+1))
			}
	    	DropDownUnitItems += '<div id="dropdown_unit_{0}" class="dropdown-menu anchor-right">{1}</div>'.format(i+1, LessonItems);
			MenuOut += '<li><a href="#" data-dropdown="#dropdown_unit_{0}">Unit {1}</a></li>'.format(i+1, i+1);
		}

		this.showActivityNav( 1, View ); 
		this.UpdateMenuProgress();
	    //$( "#MainMenu" ).menu();
	}

	this.updateBreadCrumbs = function(showActivityCrumb)
	{
		var view = framework.ui.ViewMode == 'cl' ? 'CLASSROOM' : 'HOMEWORK'; 
		$("#breadcrumb_classroom").html(view);
		$("#breadcrumb_lesson").html("Lesson {0}".format(framework.activeLesson));
		$("#breadcrumb_activity").html("Activity {0}".format(framework.activeActivity));
		if (showActivityCrumb)
		{
			$("#breadcrumb_activity").show();	
		} 
	}

	this.showActivityNav = function(lessonID, View)
	{
		framework.activeLesson = lessonID;
		$("#activityIFrame").attr("src", "/content/activity_blank.html");
		this.updateBreadCrumbs();
		var activityButtons = framework.currentUnit.GetActivityListItems(lessonID, View);
		$("#activity_buttons").html('<button class="btn" title="Activity Index">Lesson {0} Activities</button>'.format(lessonID));
		$("#activity_buttons").append(activityButtons);
		$("#culture-grammar-buttons").show();
	}

	this.UpdateMenuItem = function(MenuObj, index, labelStr)
	{
		return; // disabled
			var Progress = MenuObj.GetProgress();
			var ProgressColor = "black"; // not started
			// set the percentage value / color
			if (Progress == 0)
					ProgressColor = "black";
			else if (Progress == 100)
					ProgressColor = "green";
			else // started
					ProgressColor = "blue";

//			$("#" + MenuObj.MenuItemID).html("{0}: {1} ({2}%)".format(labelStr, index + 1, Progress));
			$("#" + MenuObj.MenuItemID).html("{0}: {1}".format(labelStr, index + 1));
			$("#" + MenuObj.MenuItemID).css("color", ProgressColor);
	}

	this.UpdateActivityButton = function(Progress, buttonID)
	{
		return; //disabled
		var progress = framework.ui.menu.StatusColor[Progress];
		$("#activity_btn_{0}".format(buttonID)).attr("class", "btn {0}".format(progress));
	}


	this.UpdateMenuProgress = function()
	{
		for (var i = 0;  i < framework.Units.length; i++)
		{
			var UnitObj = framework.Units[0];
			framework.ui.menu.UpdateMenuItem(UnitObj, i, "Unit");

			for (var l = 0; l < UnitObj.Lessons.length; l++)
			{
				var LessonObj = UnitObj.Lessons[l];
				framework.ui.menu.UpdateMenuItem(LessonObj, l, "Lesson");

				for (var a = 0; a < LessonObj.Activities.length; a++)
				{
					var ActivityObj = LessonObj.Activities[a];
					// update activity link color
					var ProgressColor = framework.ui.menu.StatusColor[ ActivityObj.GetProgress() ];
					$("#" + ActivityObj.MenuItemID).css("color", ProgressColor);
				}
		
			}
		}
	}

	this.HideMenu = function()
	{
		alert('not implemented');
	}

	this.HighlightNextMenuItem = function()
	{

	}

	this.SetMenuItemState = function()
	{

	}

}

// public methods

