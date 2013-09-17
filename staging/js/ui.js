function UI()
{
	var MainWindowID = "MainBody";
	this.CurrentView = "";
	this.menu = new Menu();
    this.ViewMode = 'home';

	var FrameworkObj = null;
	this.constructor = function(obj)
	{
		FrameworkObj = obj;
	}	

	this.ShowMainWindow = function(View)
	{
		if (typeof View == 'undefined')
		{
			View = 'home';
			this.ViewMode = 'home';
		}
		this.ViewMode = View;

		var pg = getURL_Parameter( "pg" );
		if (pg != "undefined" )
		{
			this.ViewMode = pg;
		}

		var viewTitle = View == 'cl' ? 'Classroom' : 'Homework';

		var logoutLink = '<li><a href="javascript:framework.Logout()">Logout</a></li>';
		logoutLink += '<li id="studentActivityLink" style="display:none"><span class="divider">&#160;&#183;&#160;</span><a href="javascript:framework.ui.showAdmin();">Admin</a>&#160;</li>';
//		logoutLink += '<li id="adminLink" style="display:none"><span class="divider">&#160;&#183;&#160;</span><a href="javascript:framework.ui.studentActivity();">Student Activity</a>&#160;</li>';
          
		if (this.ViewMode == "home" || !framework.isLoggedIn())
		{
			loadDivHTML("#MainBody", "#bodyContent", "landing.html", function() {
				if (framework.isLoggedIn())
				{
				    $("#loggedInLabel").html("{0} {1}".format(framework.student.FirstName, framework.student.LastName));

				    $(".login").html(logoutLink);

					if (framework.student.UserType == "Admin" || framework.student.UserType == "Instructor")
					{
						$("#adminLink").show();
						$("#studentActivityLink").show();
					}

					// set the appropriate register link
					if (framework.configInfo.installationType == 'classroom')
					{
						$("#registerLink").attr('onClick', "framework.Register('New Student');return false;");
					}
					else
					{
						$("#registerLink").attr('onClick', "alert('Public Registration Not Enabled');return false;");
					}
				}
				else // not logged in
				{
					if (framework.configInfo.installationType == 'classroom')
					{
						$("#registerLink").hide();
						$("#registerBreakCharacter").hide();
					}
					else
					{
						$("#registerLink").attr('onClick', "alert('Public Registration Not Enabled');return false;");
					}
				}
			});			
		}
		else
		{
			loadDivHTML("#MainBody", "#bodyContent", "activity_template.html", function() {
				if (framework.isLoggedIn())
				{
				    $(".login").html(logoutLink);
				}
				$("#class_title h2").html( toTitleCase( framework.configInfo.targetLanguage + " " + viewTitle) );
			    $("#loggedInLabel").html("{0} {1}".format(framework.student.FirstName, framework.student.LastName));

				framework.ui.menu.ShowMenu(View);
				
				if (window.framework.configInfo.developerMode == "yes")
				{
					$("#debugLink2").css("display", "inline-block");
				}

			});			
		}

		if (!framework.isLoggedIn())
		{
			if ("Classroom~Homework".indexOf(View) >= 0)
			{
				$("#errorDialog").html("You must be logged in to go to the "+ viewTitle +" module.  Login and register links are above.");
				$("#errorDialog").dialog("open");
			}
			loadDivHTML("#loginDialog", "#LoginForm", "login.html",function() 
				{ loadDivHTML("#registerDialog", "#RegisterForm", "login.html");}
				);

        }

	}


	this.showActivity = function(activityObj)
	{
		var ActivityFile = activityObj.GetActivityFile();
		$(".activity_frame_inlay").css("height","{0}px".format(activityObj.activityHeight));
		$(".activity_area").css("height","{0}px".format(activityObj.activityHeight - 50));
		$("#activityIFrame").attr("src", ActivityFile);
		$("#activityIFrame").show();
	}

	this.ShowHeader = function()
	{
		// begin prototype //
		var ThisMenuObj = this.menu;
		loadDivHTML("HeaderBar", "MainBodyHeader", "mainContent.html", function() 
		{
			if (framework.isLoggedIn())
			{
				$(".loggedIn").show();
				$(".loggedOut").hide();
				var userInfo = "Welcome: {0} {1}".format(framework.student.FirstName, framework.student.LastName);
				$("#UserInfo").html(userInfo);
				$("#UserInfo").show();
				ThisMenuObj.ShowMenu(this.ViewMode);
			}
			else
			{
				$(".loggedIn").hide();
				$(".loggedOut").show();
			}
		}); 
		// end prototype //
	}

	this.showStudentProgress = function()
	{
        var accordionContent = "";
		loadDivHTML("#progressDialog", "#ProgressBody", "mainContent.html", function()
		{

			/*
				CLASSROOM PROGRESS
			*/
			for (var UnitIndex = 1; UnitIndex < 6; UnitIndex++)
			{
				var LessonListItems = framework.Units[UnitIndex-1].GetLessonListItems("cl", true); // passing true returns a clean list
				var unitProgress = '<h3>Unit {0}</h3><div><ul id="progressContent_cl{1}">{2}</ul></div>'.format(UnitIndex, UnitIndex, LessonListItems);
				accordionContent += unitProgress;
			}
			//siteMessage(accordionContent);
            $("#progressAccordion_cl").html(accordionContent);
            $("#progressAccordion_cl").accordion({
                heightStyle: "content",
                active: false, 
                collapsible: true
            });

			/*
				HOMEWORK PROGRESS
			*/
            accordionContent = '';
			for (var UnitIndex = 1; UnitIndex < 6; UnitIndex++)
			{
				var LessonListItems = framework.Units[UnitIndex-1].GetLessonListItems("hw", true); // passing true returns a clean list
				var unitProgress = '<h3>Unit {0}</h3><div><ul id="progressContent_hw{1}">{2}</ul></div>'.format(UnitIndex, UnitIndex, LessonListItems);
				accordionContent += unitProgress;
			}
			//siteMessage(accordionContent);
            $("#progressAccordion_hw").html(accordionContent);
            $("#progressAccordion_hw").accordion({
                heightStyle: "content",
                active: false, 
                collapsible: true
            });


			$('#progressDialog').dialog('open');
		} );
	}

	this.showFaq = function()
	{
		loadDivHTML("#faqDialog", "#faqBody", "faq.html", function()
		{
			$('#faqDialog').dialog('open');
		});
	}

	this.showProgress = function(studentID)
	{
        var accordionContent = "";
        var ThisUser = framework.UserID;  // hold on to this user's login
        var ThisUserType = framework.student.UserType;
        framework.UserID = studentID; // impersonate student to get progress
		framework.student.UserType = "Student";

		framework.progress.LoadCourseProgress(function() {
			framework.UserID = ThisUser;
			framework.student.UserType = ThisUserType;
			loadDivHTML("#progressDialog", "#ProgressBody", "mainContent.html", function()
			{

				for (var UnitIndex = 1; UnitIndex < 6; UnitIndex++)
				{
					var LessonListItems = framework.Units[UnitIndex-1].GetLessonListItems("cl", true); // passing true returns a clean list
					var unitProgress = '<h3>Unit {0}</h3><div><ul id="progressContent_cl{1}">{2}</ul></div>'.format(UnitIndex, UnitIndex, LessonListItems);
					accordionContent += unitProgress;
				}
				//siteMessage(accordionContent);
	            $("#progressAccordion_cl").html(accordionContent);
	            $("#progressAccordion_cl").accordion({
	                heightStyle: "content",
	                active: false, 
	                collapsible: true
	            });

	            accordionContent = '';
				for (var UnitIndex = 1; UnitIndex < 6; UnitIndex++)
				{
					var LessonListItems = framework.Units[UnitIndex-1].GetLessonListItems("hw", true); // passing true returns a clean list
					var unitProgress = '<h3>Unit {0}</h3><div><ul id="progressContent_hw{1}">{2}</ul></div>'.format(UnitIndex, UnitIndex, LessonListItems);
					accordionContent += unitProgress;
				}
				//siteMessage(accordionContent);
	            $("#progressAccordion_hw").html(accordionContent);
	            $("#progressAccordion_hw").accordion({
	                heightStyle: "content",
	                active: false, 
	                collapsible: true
	            });


				$('#progressDialog').dialog('open');
			} );

			framework.progress.LoadCourseProgress(function() {
				framework.progress.LoadLocalProgress();
			}); // set progress back for instructor

		});
	}

	this.ShowAbout = function()
	{
		
	}

	this.ShowFooter = function()
	{
		loadDivHTML("#Footer", "#MainBodyFooter", "mainContent.html", function() {
			if (window.framework.configInfo.developerMode == "yes")
			{
				$("#debugDiv").show();
			}
		});
	}

	this.GoToNextActivity = function()
	{
		FrameworkObj.progress.SetToNextActivity( function() {
			FrameworkObj.menu.ShowMenu(this.ViewMode);
		});
    }

    this.ShowLogin = function ()
    {
        $("#loginEmail").val(framework.configInfo.developerEmail);
        $("#loginPassword").val(framework.configInfo.developerPW);

        $('#loginDialog').dialog('open');
    }

	this.ShowRegister = function(Title, classID)
	{
	    framework.registrationType = "Student";
	    if (framework.configInfo.installationType == "classroom")
	    {
		    if (typeof Title == "string")
		    {

		        if (Title.toLowerCase().indexOf("edit:") == 0)
		        {
		            var email = Title.split(':')[1];
		            Title = Title.split(':')[0];
		        }
		        else if (Title.toLowerCase().indexOf("student") >= 0)
		        {
		            $("#registerButton").text("register student");
		        }
		        else if (Title.toLowerCase().indexOf("instructor") >= 0)
		        {
		            framework.registrationType = "Instructor";
		            $("#registerButton").text("register instructor");
		        }
		        $("#registerDialog").dialog('option', 'title', Title);
		    }
		    else
		    {
		        $("#registerDialog").dialog('option', 'title', Title);
		    }
		}

	    $("#registerDialog").dialog('option', 'registrationType', framework.registrationType);
	    $("#registerDialog").load("content/login.html #RegisterForm", function ()
	    {
			/*
				This dialog is for when admin's register instructors, or instructors register students.
				Passwords are automatically generated so we hide those elements and set the height
				of the dialog accordingly
			*/
		    if (framework.configInfo.installationType == "classroom")
		    {
		    	$("#registrationType").val(framework.registrationType);
		    	$("#registrationClassID").val(classID);
				$("#registrationPasswords").hide();
			}

	        $("#registerClassID").html(typeof classID == 'undefined' ? '' : classID);
	        clearMessage("registerMessage");
	        $("#registerDialog").dialog("open");
	    });
	}

	this.ShowContact = function ()
	{
	    loadDivHTML("#contactDialog", "#ContactUsForm", "login.html");
	    $('#contactDialog').dialog('open');
	}

	this.showEditClass = function(classID)
	{
	    $("#addClassDialog").load("content/admin_main.html #addClass", function ()
	    {
	        $("#addClassButton").text("update class");
	        $("#classID").html(classID);

	        $("#ui-id-6").html("Edit Class");  // update title
	        var className = $("#classTableClassNameCell_" + classID).html();
	        className = className.replace('[', '');
	        className = className.replace(']', '');
	        var title = $("#classTableTitleCell_" + classID).html();
	        var description = $("#classTableDescriptionCell_" + classID).html();

	        $("#addClass #className").val(className);
	        $("#addClass #ClassTitle").val(title);
	        $("#addClass #ClassDescription").val(description);

	        $("#addClassDialog").dialog("open");
	    });
	}

	this.showAddClass = function()
	{
	    $("#addClassDialog").load("content/admin_main.html #addClass", function ()
	    {
	        clearMessage("addClassMessage");
	        $("#addClassButton").text("add class");
	        $("#classID").html("");

	        $("#addClassDialog").dialog('option', 'title', "Add New Class");
	        $("#addClassDialog").dialog("open");
	    });
	}

	this.showLogMessagesCallback = function(data)
	{

        // build debug dialog table
		var displayRows = "";
		// loop units array and load lessons
        var LogMessageArray = data.d;

        displayRows = '<table class="table table-striped" cellspacing="0" cellpadding="0" border="0" style="width:570px">\n';
        
        for (var i = 0; i < LogMessageArray.length; i++)
        {
			var language = data.d[i].Language;
			var userid = data.d[i].UserID;
			var datetime = data.d[i].DateTime;
			var message = data.d[i].Message;

			displayRows += '  <tr>';
			displayRows += '    <td class="debugMessage">{0}</td><td>&nbsp;</td><td class="debugDateTime">{1}<br />{2}</td>\n'.format(message, userid, datetime);
			displayRows += '  </tr>';
        }

        displayRows += '  </table>';

        $('#debugDialogBody').html(displayRows);

    }

//

	this.clearLogMessageField = function ()
	{
	    $("#debugFilter").val("");
	    framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, "*", framework.ui.showLogMessagesCallback);
	    $("#debugFilter").focus();
	}

	this.clearLogDateRange = function ()
	{
	    $("#debugFrom").val("");
	    $("#debugTo").val("");
	}

	this.showLogMessagesDialog = function()
	{

		framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, "*", this.showLogMessagesCallback);

		$('#debugDialog').dialog('open');
	}

	this.studentActivity = function(classid)
	{
		// studentActivity
	    if (framework.student.UserType == "Instructor")
	    {
	        adminCallback = function ()
	        {
	        	$("#classID").html(classid);
				$(function() {
				    $( "#questions_accordion" ).accordion({
				      collapsible: true
				    });
				  });


	            $("#studentActivityDialog").dialog("open");
	        }
	        loadDivHTML("#studentActivityDialog", "#studentActivity", "admin_main.html", adminCallback);		
	    }				
	}

	this.loadStudentActivity = function(activityType)
	{
		$("#selectedActivityType").html(activityType);
		$("#unitLessonSelection").show();
		if (activityType == 'cl')
		{
			$("#activityNavigationRow").html("Classroom Activity:");
		}
		else
		{
			$("#activityNavigationRow").html("Homework Activity:");
		}

		// update each of the dropdowns
		var unitOptions = '<option selected value="--">Select Unit</option>';
		unitOptions += '<option value="0">Unit 1</option>';
		unitOptions += '<option value="1">Unit 2</option>';
		unitOptions += '<option value="2">Unit 3</option>';
		unitOptions += '<option value="3">Unit 4</option>';
		unitOptions += '<option value="4">Unit 5</option>';

		var emptyOptions = '<option selected value="--">-------</option>';
		$("#unitDropdown").html(unitOptions);
		$("#lessonDropdown").html(emptyOptions);
		$("#activityDropdown").html(emptyOptions);

		// this.menu.ShowActivityNav(activityType);
	}

	this.updateLessonDropdown = function()
	{
		$("#unitDropdown option[value='--']").remove(); // remove the 'select' item
		var selectUnit = $("#unitDropdown").val();

		var lessonType = $("#selectedActivityType").html();
		var UnitObj = framework.Units[selectUnit];
		var Lessons = UnitObj.Lessons;
		var lessonItems = '<option selected value="--">Select Lesson</option>';
		for (var i = 0; i < Lessons.length; i++)
		{
			if (UnitObj.Lessons[i].LessonType == lessonType)
			{
				lessonItems += '<option value="{0}">Lesson {1}</option>'.format(UnitObj.Lessons[i].LessonIndex, UnitObj.Lessons[i].LessonID);
			}
		}
		$("#lessonDropdown").html(lessonItems);
	}

	this.updateActivityDropdown = function()
	{
		$("#lessonDropdown option[value='--']").remove(); // remove the 'select' item
		var selectUnit = $("#unitDropdown").val();
		var selectLesson = $("#lessonDropdown").val();
		var lessonType = $("#selectedActivityType").html();

		var UnitObj = framework.Units[selectUnit];
		var LessonObj = UnitObj.Lessons[selectLesson-1];
		var Activities = LessonObj.Activities;
		var activityItems = '<option selected value="--">Select Activity</option>';
		for (var i = 0; i < Activities.length; i++)
		{
			activityItems += '<option value="{0}">{1}</option>'.format(Activities[i].ActivityNum, Activities[i].Title);
		}
		$("#activityDropdown").html(activityItems);
	}

	this.showQuestionActivityDetails = function()
	{
		$("#activityDropdown option[value='--']").remove(); // remove the 'select' item
		var selectUnit = $("#unitDropdown").val();
		var selectLesson = $("#lessonDropdown").val();
		var selectActivity = $("#activityDropdown").val();
		var lessonType = $("#selectedActivityType").html();
		var classID = $("#classID").html();

		var callback = function(data)
		{
			var accordionContent = "";
			var questionID = -1;
			for (var i = 0; i < data.d.length; i++)
			{
				var context = data.d[i].Context;
				if (questionID != data.d[i].QuestionID)
				{
					if (questionID != -1)
					{
						accordionContent += "</div>";	
						console.log("</div>");
					}
					accordionContent += "<h3>Q{0}: {1}</h3><div>".format(data.d[i].QuestionID, context);
					console.log("<h3>Q{0}: {1}</h3><div>".format(data.d[i].QuestionID, context));
				}

				var questionID = data.d[i].QuestionID;
				var studentName = data.d[i].StudentName;
				var studentID = data.d[i].StudentID;
				var answer = data.d[i].Answer;

				accordionContent += "<p>{0}  Answer: {1}</p>".format(studentName, answer);
				console.log("<p>{0}  Answer: {1}</p>".format(studentName, answer));
			}
			if (accordionContent.length > 0)
			{
				accordionContent += "</div>";	
				console.log("</div>");
			}
			$("#questions_accordion").accordion('destroy').html(accordionContent).accordion({
			      heightStyle: "content"
			    });

			$("#activityContentRow").show();
		}

		// get list of questions with context for this lesson
		framework.dataObj.GetStudentAnswers(selectLesson, selectActivity, classID, callback);
	}

	this.showAdmin = function ()
	{

	    var adminCallback;

	    if (framework.student.UserType == "Instructor")
	    {
	        adminCallback = function ()
	        {
	            framework.ui.loadInstructorView();
                $("#adminViewDialog").dialog("open");
	        }
	        loadDivHTML("#adminViewDialog", "#instructor_main", "admin_main.html", adminCallback);
	    }
	    else if (framework.student.UserType == "Admin")
	    {
	        adminCallback = function ()
	        {
	            framework.ui.buildInstructorsTable();
	            $("#adminViewDialog").dialog("open");
	        }
	        loadDivHTML("#adminViewDialog", "#admin_main", "admin_main.html", adminCallback);
	    }
	    
	}

	this.loadInstructorView = function()
	{
	    var SetClassInfo = function (data)
	    {
	        if (data.d.indexOf('fail:') == 0)
	        {
	            // failed
	            var msg = data.d.split(":")[1];
	            if (msg.indexOf("Not Found") >= 0)
	            {
	                $("#instructor_main").html("<span style='color: red'>No Classes Assigned</span>");
	            }
	            else
	            {
	                $("#instructor_main").html("<span style='color: red'>" + msg + "</span>");
	            }
	            return;
	        }

	        var classes = data.d.split("|");
	        var isFirst = true;
	        $("#InstructorClassesDiv").html("");
	        for (var i = 0; i < classes.length; i++)
	        {
	            framework.currentInstructorDetails.push(classes[i]);
	            var parts = classes[i].split("~");
	            if (typeof parts[3] == 'undefined') continue;
	            framework.ui.buildStudentsTable(parts[2], parts[3], isFirst ? '' : ";padding-top:15px; padding-bottom: 15px");
	            isFirst = false;
	        }

	    };

	    framework.dataObj.GetInstructorDetails(framework.student.Email, SetClassInfo);
	    // var ajaxData = "{'Email':'{0}'}".format(framework.student.Email);
	    // callWebService("main", "GetInstructorDetails", ajaxData, SetClassInfo);
	}

	this.buildInstructorsTable = function()
	{

	    // reset padding
        // top, right, bottom, left
        $(".drop-shadow").css("padding", "30px 40px 35px 40px");

	    $("#admin_main.tr").hide(0);
	    $("#adminInstructorTable").find("tr:gt(0)").remove();

	    var buildTable = function(data)
	    {
	            framework.instructorList.length = 0;
	            var instructorEmail = '';
	            for (var i = data.d.length - 1; i > -1; i--)
	            {

	                if (instructorEmail != data.d[i].Email)
	                {
	                    var modifiedEmail = data.d[i].Email.replace("@", "_");
	                    modifiedEmail = modifiedEmail.replace(".", "_");

	                    var rowBG = rowBG == "#f1f1f3" ? "#f4f4f6" : "#f1f1f3";
	                    var row = "  <tr class=\"tableCell\" style=\"background-color: {0}\">".format(rowBG);

	                    row += "  <td>" + data.d[i].FullName + "</td>";
	                    //row += "  <td><span id='instructorTableClassCell_{0}' {1}>".format(modifiedEmail, styleName) + classTitle + "</span></td>";
	                    row += "  <td>" + data.d[i].Email + "</td>";
	                    row += "  <td>" + data.d[i].Password + "</td>";
	                    row += "  <td align='center'><a style=\"padding-left: 7px; text-decoration:underline; font-size:smaller\" href='javascript:framework.deleteInstructor(\"{0}\")'><button id='deleteInstructorButton' class='adminButton'><i class='icon-remove'></i></button></a></td>".format(data.d[i].Email);
	                    row += "  </tr>";
	                    $("#adminInstructorTable > tbody:last").after(row);
	                }
	                instructorEmail = data.d[i].Email;

	                var instructorDetails = "{0}:{1}:{2}:{3}".format(data.d[i].Email, data.d[i].FullName, data.d[i].Password, data.d[i].ClassID);
	                framework.instructorList.push(instructorDetails);
	            }
	            framework.ui.buildClassesTable();
	            $("#admin_main.tr").show();
	            $(".adminTables").show();
	    }

	    framework.dataObj.getInstructors(buildTable);
	}

	this.getInstructorList = function(classID, selectedInstructor)
	{
	    var instructors = "";
	    for (var i = 0; i < window.framework.instructorList.length; i++)
	    {
	        var instructorDetails = window.framework.instructorList[i];
	        var instructorParts = instructorDetails.split(':');
	        if (instructorParts[3] == classID)
	        {
	            instructors += "<div style='font-size: smaller'>" + instructorParts[1] + "</div>";
	        }
	    }
	    return instructors;
	}

	this.buildClassesTable = function(callback)
	{
	    $("#AdminClassesTable").find("tr:gt(0)").remove();

	    var buildTable = function(data)
	    {
            for (var i = data.d.length - 1; i > -1; i--)
            {
                var instructor = data.d[i].Instructor == "" ? "--select instuctor--" : data.d[i].Instructor;
                //var instructorList = getInstructorDropdownHTML(data.d[i].ClassID, data.d[i].InstructorEmail);
                var instructorList = framework.ui.getInstructorList(data.d[i].ClassID);
                instructorList = instructorList == "" ? "-none assigned-" : instructorList;

                var editLinks = "<a style=\"padding-left: 7px; text-decoration:underline; font-size:smaller\" href=\"javascript:framework.ui.chooseInstructors('{0}')\"><button class='adminButton' id='chooseInstructorButton'><i class='icon-user'></i></button></a>".format(data.d[i].ClassID);
                editLinks += "<a style=\"padding-left: 7px; text-decoration:underline; font-size:smaller\" href=\"javascript:framework.ui.showEditClass('{0}')\"><button class='adminButton' id='editClassButton'><i class='icon-cog'></i></button></a>".format(data.d[i].ClassID);
                editLinks += "<a style=\"padding-left: 7px; text-decoration:underline; font-size:smaller\" href=\"javascript:framework.removeClass('{0}')\"><button class='adminButton' id='removeClassButton'><i class='icon-remove'></i></button></a>".format(data.d[i].ClassID);

				var rowBG = rowBG == "#f1f1f3" ? "#f4f4f6" : "#f1f1f3";

				var lastClass = "";

				if (i == 0)
				{
					lastClass = " adminClassLastRowTop";
				}

				var row = "  <tr class=\"tableCell\" style=\"background-color: {0}\">".format(rowBG);
				row += "  <td class='adminClassSeparator"+lastClass+"'><div id='classTableTitleCell_{0}'>".format(data.d[i].ClassID) + data.d[i].Title + "</div><div id='classTableClassNameCell_{0}'".format(data.d[i].ClassID) + " style='color:#205f5a; font-size:smaller'>[" + data.d[i].ClassCode + "]</div></td>";
                row += "  <td class='adminClassSeparator"+lastClass+"' id='classTableDescriptionCell_{0}'>".format(data.d[i].ClassID) + data.d[i].Description + "</td>";
                row += "  <td class='adminClassSeparator"+lastClass+"'><div id='class_instructors_{0}'>{1}</div></td>".format(data.d[i].ClassID, instructorList);
                row += "  <td class='adminClassSeparator"+lastClass+"'>{0}</td>".format(editLinks);
                row += "  </tr>";

                $("#AdminClassesTable > tbody:last").after(row);
	    	}
	    }
	    framework.dataObj.getClasses(buildTable);
	}

	this.chooseInstructors = function(classID)
	{
	    $('#instructorsDialog').load("content/admin_main.html #selectInstructorsDiv", function ()
	    {
	        $("#selectedClassID").html(classID);
	        framework.ui.initializeInstructors(classID);
	        $("#select-result").hide();
	        $("#instructorsDialog").dialog("open");
	    });
	}

	this.initializeInstructors = function(classID)
	{
	        $("#selectableInstructors").selectable({
	            stop: function ()
	            {
	                var result = $("#select-result").empty();
	                $("#select-result").hide();

	                $(".ui-selected", this).each(function ()
	                {
	                    var instructorIDs = $(this).attr('id');
	                    result.append(instructorIDs + ":");
	                });
	            }
	        });

	    var instructorArray = new Array();
	    var instructors = "";
	    // This next loop is necessary to identify all instructors that are assigned to a class.  Since
	    // the instructorList array could have the same instructor for multiple elements, we need to construct
	    // an array to hold whether that instructor is part of the class being considered
	    for (var i = 0; i < framework.instructorList.length; i++)
	    {
	        var instructorDetails = framework.instructorList[i];
	        var instructorParts = instructorDetails.split(':');
	        if (instructors.indexOf(instructorParts[1]) == -1)
	        {
	            instructors += instructorParts[1] + ':';
	            var highlight = instructorParts[3] == classID ? "yes" : "no";
	            instructorArray[instructorParts[0]] = instructorParts[1] + ":" + highlight;
	        }
	        else
	        {
	            var highlight = instructorParts[3] == classID ? "yes" : "no";
	            parts = instructorArray[instructorParts[0]].split(":");
	            highlight = parts[1] == "yes" ? "yes" : highlight;
	            instructorArray[instructorParts[0]] = instructorParts[1] + ":" + highlight;
	        }
	    }

	    for (var key in instructorArray)
	    {
	        parts = instructorArray[key].split(":");
	        var classVar = "is-selected='{0}'".format(parts[1]);
	        $("#selectableInstructors").append('<li id="{0}" class="ui-widget-content" {1}>{2}</li>'.format(key, classVar, parts[0]));
	    }


	    result = $("#select-result").empty();
	    $("li[is-selected='yes']").each(function ()
	    {
	        $(this).addClass("ui-selected");
	        instructorIDs = $(this).attr('id');
	        result.append(instructorIDs + ":");
	    });
	}

	this.setInstructors = function()
	{
	    var classID = $("#selectedClassID").html();
	    var instructors = $("#select-result").html();
	    var callback1 = function (data)
	    {
	        if (data.d.indexOf('success') >= 0)
	        {
			 	framework.dataObj.SetClassInstructors(instructors, classID, callback2);
	        }
	    };

	    var callback2 = function (data)
	    {
	        if (data.d.indexOf('fail') < 0)
	        {
	            // the result should have the full names of the instructors to be put back into the ui
	            var parts = data.d.split(':');
	            $("#class_instructors_" + classID).html('');
	            for (var i = 0; i < parts.length; i++)
	            {
	                if (parts[i] == '') continue;
	                $("#class_instructors_" + classID).append("<div style='font-size:smaller'>" + parts[i] + "</div>");
	            }
	            $("#instructorsDialog").dialog("close");
	        }
	        else
	        {
	            siteMessage(data.d, "Operation Failed");
	        }
	    };

	 	framework.dataObj.ClearClassInstructors(classID, callback1);
	}

	this.buildStudentsTable = function (classID, classTitle, padding)
	{
	    var registerLink = "<a class='btn btn-mini' href=\"javascript:framework.ui.ShowRegister('Register Student', " + classID + ")\" id=\"register\">Register Students</a>";
	    registerLink += "<a class='btn btn-mini' href=\"javascript:framework.ui.studentActivity(" + classID + ");\" id=\"studentActivityLink\">Student Activity</a>";

	    var tableframe = '<div style="{0};color: #4d4d4d;" class="bodyTitle"><H4>Class: {1}</H4></div>'.format(padding, classTitle);
	    tableframe += '<div style="width=800px">';

	    tableframe += '	<div style="float: left; color:#4d4d4d; font-size:12px; font-family:Verdana, Geneva, sans-serif; font-weight:bold">Students</div>';

	    tableframe += '	<div style="float: right; color:#4d4d4d; font-size:12px; font-family:Verdana, Geneva, sans-serif; font-weight:bold;">' + registerLink + '</div>';

	    tableframe += '	<div id="classActiveTests{0}" style="float: left;font-size: 13px;color: #88223F;">'.format(classID);
	    tableframe += '</div>';
	    tableframe += '<div style="clear:both"></div>';
	    tableframe += '</div>';
	    tableframe += '<table id="adminStudentTable' + classID + '" class="borderedTable" width="903" cellspacing="0" cellpadding="0">';
	    tableframe += '<tr bgcolor="#dddce3">';
	    tableframe += '<th width="225" scope="col" style="text-align:left"><font color="4d4d4d"size="2" face="Verdana"><b> Name</b></font></th>';
	    tableframe += '<th width="317" scope="col" style="text-align:left"><font color="4d4d4d"size="2" face="Verdana"><b>  E-mail</b></font></th>';
	    tableframe += '<th width="258" scope="col" style="text-align:left"><font color="4d4d4d"size="2" face="Verdana"><b>  Password</b></font></th>';
	    tableframe += '<th width="159" scope="col" style="text-align:left;white-space:nowrap;"><font color="4d4d4d"size="2" face="Verdana"><b>  Remove/Progress</b></font></th>';
	    tableframe += '</tr>';
	    tableframe += '</table>';

	    $("#InstructorClassesDiv").append(tableframe);
	    $("#adminStudentTable" + classID).find("tr:gt(0)").remove();

	    var bldHTML = function (data)
	    {
	        for (var i = data.d.length - 1; i > -1; i--)
	        {
	            var progressLink = "<a style=\"padding-left: 7px; text-decoration:underline; font-size:smaller\" rel='tooltip' data-placement='top' title='View student progress' href='javascript:framework.ui.showProgress(\"\{0}\")'><button id='showProgressButton' class='adminButton'><i class='icon-tasks'></i></button></a>".format(data.d[i].Email);
	            var removeLink = "<a style=\"padding-left: 7px; text-decoration:underline; font-size:smaller\" rel='tooltip' data-placement='top' title='Remove student from class' href=\"javascript:framework.removeStudentFromClass('{0}', {1})\"><button id='clearStudentButton' class='adminButton'><i class='icon-remove'></i></button></a>".format(data.d[i].Email, classID);
	            var rowBG = rowBG == "#f1f1f3" ? "#f4f4f6" : "#f1f1f3";
	            var row = "  <tr class=\"tableCell\" style=\"background-color: {0}\">".format(rowBG);
	            row += "  <td>" + data.d[i].FullName + "</td>";
	            row += "  <td>" + data.d[i].Email + "</td>";
	            row += "  <td>" + data.d[i].Password + "</td>";
	            row += "  <td style='text-align:left;padding-left:25px;'>{0} {1}</td>".format(removeLink, progressLink);
	            row += "  </tr>";
	            $("#adminStudentTable" + classID + " > tbody:last").after(row);
	        }

	    };

	    framework.dataObj.GetStudents(classID, bldHTML);
	}

	this.lookupStudent = function()
	{
		if ($("#registrationClassID").val() == "-1") return; // registering an instructor
	    var callback = function (data)
	    {
	        if (data.d.indexOf('fail:') == 0)
	        {
	            // failed to find student
	            clearMessage("registerErrorLabel");
	            $("#RegisterFormItems #registerFirstName").val('');
	            $("#RegisterFormItems #registerLastName").val('');
	            return;
	        }
	        else
	        {
	            var studentParts = data.d.split("~");
	            if (studentParts[5] == $("#registrationClassID").val())
	            {
	            	$("#RegisterFormItems #registerFirstName").val('');
	   		        $("#RegisterFormItems #registerLastName").val('');
	                showMessage("registerErrorLabel", "<strong>Student is already registered for this class</strong>", "red");
	            }
	            else if (studentParts[5] == "") // not registered in any class... but found
	            {
	                $("#RegisterFormItems #registerFirstName").val(studentParts[2]);
	                $("#RegisterFormItems #registerLastName").val(studentParts[3]);
	                showMessage("registerErrorLabel", "<strong>Student Found</strong>: Click 'add' to add to class", "blue");
	                $("#registerButton").text("add to class");
	            }
	            else //  if (studentParts[5] != $("#registrationClassID").val()) // registered in another class
	            {
		            $("#RegisterFormItems #registerFirstName").val('');
	   		        $("#RegisterFormItems #registerLastName").val('');
	   		      	showMessage("registerErrorLabel", "<strong>Student is already registered in another class</strong>", "red");
	            }
	        }
	    };
	    // get user email
	    var userEmail = $("#RegisterFormItems #registerEmailName").val();

	    framework.dataObj.GetStudentDetails(userEmail, callback);
	}

	this.showClassStudents = function(classID)
	{
	    var TableHTML = "<table id='adminStudentTable' class='borderedTable' width='800' cellspacing='0' cellpadding='0'>";
	    TableHTML += "<tr class='tableTitle'>";
	    TableHTML += "<td width='185'>Name</td>";
	    TableHTML += "<td width='225'>Email (login)</td>";
	    TableHTML += "<td width='149'>Password</td>";
	    //TableHTML += "<td width='78'>&nbsp;</td>";
	    TableHTML += "</tr>{0}";
	    TableHTML += "</table>";

	    var bldHTML = function (data)
	    {
	        var row = "";
	        for (var i = data.d.length - 1; i > -1; i--)
	        {
	            //var removeLink = "<a href=\"javascript:removeStudentFromClass('{0}', {1})\">remove</a>".format(data.d[i].Email, classID);
	            var rowBG = rowBG == "#f1f1f3" ? "#f4f4f6" : "#f1f1f3";
	            row += "  <tr class=\"tableCell\" style=\"background-color: {0}\">".format(rowBG);
	            row += "  <td>" + data.d[i].FullName + "</td>";
	            row += "  <td>" + data.d[i].Email + "</td>";
	            row += "  <td>" + data.d[i].Password + "</td>";
	            //row += "  <td>{0}</td>".format(removeLink);
	            row += "  </tr>";
	        }

	        siteMessage(TableHTML.format(row), "Students", 850, 300);
	    };

	    var ajaxData = "{'ClassID':'{0}'}".format(classID);
	    callWebService("main", "GetStudents", ajaxData, bldHTML);
	}

	this.showGlossary = function()
	{
		// build glossary content
		loadDivHTML("#glossaryDialog", "#glossaryContents", "glossary.html", function() {

		// populate each tab group
		var groupingsArray = ['ab','cd','ef','gh','ij','kl','mn','op','qr','st','uv','wx','yz'];
		for (var i = 0; i < groupingsArray.length; i++)
		{
			var Template = "<div class='glossaryLink glossarylinkLeft'>{0}</div><div class='glossaryTranslation'>{1}</div><div class='glossaryLink glossaryLinkRight'>{2}</div><div class='glossaryTranslation'>{3}</div><div style='clear:both'></div>";
			var translationContent = "";

			var tabContent   = framework.glossary.getGlossaryGroup(groupingsArray[i]);
			var leftContent  = tabContent[0];
			var rightContent = tabContent[1];

			var title 	= "<div class='glossaryTitleArea'><div class='glossaryTitle'>{0}</div>".format(groupingsArray[i][0]);
			title 		+= "<div class='glossaryTitle'>{0}</div>".format(groupingsArray[i][1]);
			title 		+= "<div style='clear:both'></div></div>";

			var rowCount = Math.max(leftContent.length, rightContent.length);

			for (var index = 0; index < rowCount; index++)
			{
				var word1 			= "<div class='emptyGlossaryItem'>&nbsp;</div>";
				var translation1 	= "&nbsp;";
				var word2 			= "<div class='emptyGlossaryItem'>&nbsp;</div>";
				var translation2 	= "&nbsp;";

				// left side
				if (typeof leftContent[index] == "string")
				{
					// get items 
					var parts 		= leftContent[index].split('~');
					var linkString	= "framework.ui.showGlossaryWordContext(\"{0}\")".format(parts[0]);
					var word1		= "<a href='javascript:{0}'>{1}</a>".format(linkString, parts[0]);
					var translation1	= parts[1];
				}

				// right side
				if (typeof rightContent[index] == "string")
				{
					var parts 		= rightContent[index].split('~');
					var linkString	= "framework.ui.showGlossaryWordContext(\"{0}\")".format(parts[0]);
					var word2		= "<a href='javascript:{0}'>{1}</a>".format(linkString, parts[0]);
					var translation2	= parts[1];
				}

				translationContent += Template.format(word1, translation1, word2, translation2);
			}

			translationContent = "<div class='glossaryTranslationsArea'>"  + translationContent + "</div>";
			$("#{0}".format(groupingsArray[i])).html(title + translationContent);
		}

		// open glossary dialog
		  $(function () {
		    $('#myTab a:last').tab('show');
		  })

			$('#glossaryDialog').dialog('open');		
		})

	}

	this.showGlossaryWordContext = function(GlossaryWord)
	{
		var callback = function(data)
		{
		/*
			   public String Word;
			   public String Word_tl;
			   public String Context = "";
			   public int Lesson = -1;
			   public int Activity = -1;
		*/
			// get activity title
			var rows = "";
			for (var i = 0; i < data.d.length; i++)
			{
				var parts  	= getLessonNumber(data.d[i].Lesson);
				var unit 	= parts[0];
				var lesson 	= parts[1];
				var activity = data.d[i].Activity;

				if (typeof framework.Units[unit-1] == "undefined") continue;
				if (typeof framework.Units[unit-1].Lessons[lesson-1] == "undefined") continue;
				if (typeof framework.Units[unit-1].Lessons[lesson-1].Activities[activity-1] == "undefined") continue;
				var activityTitle 	= framework.Units[unit-1].Lessons[lesson-1].Activities[activity-1].Title;
				var context 		= data.d[i].Context;


				rows += "<div style='padding-bottom: 15px; width: 425px' class='glossaryTranslation'>{0}</div>".format(activityTitle);
				rows += "<div style='padding-bottom: 15px;' class='glossaryTranslation'>{0}</div>".format(context);
				rows += "<div style='clear: both'></div>";
			}


			$('#glossaryDialogDetail').html(rows);
			$('#glossaryDialogDetail').dialog('open');
			$('#glossaryDialogDetail').dialog('option', 'title', "Glossary - " + GlossaryWord);
		}

		framework.dataObj.GetGlossaryItemDetails(GlossaryWord, callback);
	}
}


/* -------------------------------------------------------------------------
Functions below are not in the UI class.
------------------------------------------------------------------------- */
function clearMessage(parentDiv) 
{
    var messageDiv = ".message";
    if (typeof parentDiv != "undefined") {
        messageDiv = "#{0}{1}".format(parentDiv, messageDiv);
    }

    $(messageDiv).html("");
    $(messageDiv).hide();
}

function clearRegisterFields()
{
    $("#registerButton").text("register another");
    $("#cancelButton").text("finish");
	$("#RegisterFormItems #registerFirstName").val("");
	$("#RegisterFormItems #registerLastName").val("");
	$("#RegisterFormItems #registerEmailName").val("");	
}

function showMessage(parentDiv, messageText, color, append) 
{
    var messageDiv = ".message";
    if (typeof parentDiv != "undefined") {
        messageDiv = "#{0}{1}".format(parentDiv, messageDiv);
    }

    if (typeof color != "undefined")
    {
        $(messageDiv).css("color", color);
    }
    else
    {
        $(messageDiv).css("color", "#e30f0f");
    }

    if (append)
    {
        $(messageDiv).append(messageText);
    }
    else
    {
        $(messageDiv).html(messageText);
    }
    $(messageDiv).show();
}
