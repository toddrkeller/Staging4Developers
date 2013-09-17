// ---------------------------------------------------------------------------------------------
// Purpose: 	Initialize and definition of all dialogs.  Any functionality beyond dialog 
// 				configuration should be made in the appropriate .js file.
//
// 				Define all dialog <div>'s at the bottom of index.html
// ---------------------------------------------------------------------------------------------

function enableEnterKey(dialogName, buttonId)
{

    $("#" + buttonId).css("outline", "-webkit-focus-ring-color auto 5px");
    $("#" + buttonId).css("outline-color", "-webkit-focus-ring-color");
    $("#" + buttonId).css("outline-style", "auto");
    $("#" + buttonId).css("outline-width", "5px");

    $("#" + dialogName).keypress(function (e)
    {

        if (e.keyCode == $.ui.keyCode.ENTER)
        {
            $("#" + buttonId).trigger("click");
        }
    });
}

function setupDialogs()
{

    $("#loginDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'LOGIN',
        modal: true,
        width: 370,
        height: 285,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("loginDialog", "loginButton"),
        buttons: [
		  {
		      text: "cancel",
		      click: function ()
		      {
		          $('#loginDialog').dialog('close');
		      }
		  },
		  {
		      text: "login",
		      id: "loginButton",
		      click: function ()
		      {
		          framework.validateLogin();
		      }
		  }
	   ]
    });

    $("#registerDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'REGISTER',
        modal: true,
        width: 350,
        height: 295,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("registerDialog", "registerButton"),
        buttons: [
		  {
		      text: "cancel",
		      id: "cancelButton",
		      click: function ()
		      {
		          $('#registerDialog').dialog('close');
		      }
		  },
		  {
		      text: "register",
		      id: "registerButton",
		      click: function ()
		      {
		          return framework.validateRegister();
		      }
		  }
	   ]
    });

    $("#contactDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'CONTACT US',
        modal: true,
        width: 500,
        height: 490,
        show: { effect: "drop", direction: "up" },
        open: function ()
        {
            enableEnterKey("contactDialog", "sendButton");
            $('#contactUsFirstName').focus();
        },
        buttons: [
		  {
		      text: "cancel",
		      click: function ()
		      {
		          $('#contactDialog').dialog('close');
		      }
		  },
		  {
		      text: "send",
		      id: "sendButton",
		      click: function ()
		      {
		          return framework.validateContactUs();
		      }
		  }
	   ]
    });

    // $("#cultureNotesDialog").dialog({
    //     autoOpen: false,
    //     resizable: false,
    //     title: 'Culture Notes',
    //     modal: true,
    //     width: 750,
    //     height: 600,
    //     show: { effect: "drop", direction: "up" },
    //     open: enableEnterKey("cultureNotesDialog", "cultureCloseButton"),
    //     buttons: [
    //       {
    //         text: framework.configInfo.targetLanguage,
    //         id: "toggleButton",
    //         click: function()
    //         {
    //             return framework.toggleCultureNotesCaptions();
    //         }
    //       },
    //       {
    //           text: "close",
    //           id: "cultureCloseButton",
    //           click: function ()
    //           {
    //               $('#cultureNotesDialog').dialog('close');
    //           }
    //       }          
	   // ]
    // });

    $("#grammarNotesDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Grammar Notes',
        modal: true,
        width: 750,
        height: 600,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("grammarNotesDialog", "grammarCloseButton"),
        buttons: [
		  {
		      text: "close",
		      id: "grammarCloseButton",
		      click: function ()
		      {
		          $('#grammarNotesDialog').dialog('close');
		      }
		  }
	   ]
    });


    $("#faqDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'FAQ',
        modal: true,
        width: 990,
        height: 600,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("faqDialog", "faqCloseButton"),
        buttons: [
              {
                  text: "close",
                  id: "faqCloseButton",
                  click: function ()
                  {
                      $('#faqDialog').dialog('close');
                  }
              }
           ]
    });

    $("#progressDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Student Progress',
        modal: true,
        width: 750,
        height: 600,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("progressDialog", "progressCloseButton"),
        buttons: [
		      {
		          text: "close",
		          id: "progressCloseButton",
		          click: function ()
		          {
		              $('#progressDialog').dialog('close');
		          }
		      }
	       ]
    });

    $("#glossaryDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Glossary',
        modal: true,
        width: 750,
        height: 600,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("glossaryDialog", "glossaryCloseButton"),
        buttons: [
		      {
		          text: "close",
		          id: "glossaryCloseButton",
		          click: function ()
		          {
		              $('#glossaryDialog').dialog('close');
		          }
		      }
	       ]
    });

    $("#glossaryDialogDetail").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Glossary -',
        modal: true,
        width: 650,
        height: 550,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("glossaryDialogDetail", "glossaryDetailCloseButton"),
        buttons: [
              {
                  text: "close",
                  id: "glossaryDetailCloseButton",
                  click: function ()
                  {
                      $('#glossaryDialogDetail').dialog('close');
                  }
              }
           ]
    });

    $("#adminViewDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'DLiLearn Administration',
        modal: true,
        width: 940,
        height: 700,
        show: { effect: "drop", direction: "up" },
        open: function (event, ui)
        {
            enableEnterKey("adminViewDialog", "adminCloseButton");
            $(":button:contains('close')").focus();
        },
        buttons: [
          {
              text: "close",
              id: "adminCloseButton",
              click: function ()
              {
                  $('#adminViewDialog').dialog('close');
              }
          }
       ]
    });

    $("#studentActivityDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Student Activity',
        modal: true,
        width: 940,
        height: 650,
        show: { effect: "drop", direction: "up" },
        open: function (event, ui)
        {
            enableEnterKey("studentActivityDialog", "adminCloseButton");
            $(":button:contains('close')").focus();
        },
        buttons: [
          {
              text: "close",
              id: "studentActivityCloseButton",
              click: function ()
              {
                  $('#studentActivityDialog').dialog('close');
              }
          }
       ]
    });

    $("#addClassDialog").dialog({
	   autoOpen: false,
	   resizable: false,
	   title: 'Add New Class',
	   modal: true,
	   width: 370,
	   buttons: [
		  {
			 "id": "okButton",
			 text: "cancel",
			 click: function () { $(this).dialog("close"); }
		  },
		  {
			 "id": "addClassButton",
			 text: "add class",
			 click: function () { framework.addClass(); }
		  }
	   ]
    });

    $("#errorDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Error',
        modal: true,
        width: 325,
        height: 250,
        show: { effect: "drop", direction: "up" },
        open: enableEnterKey("errorCloseButton"),
        buttons: [
		  {
		      text: "close",
		      id: "errorCloseButton",
		      click: function ()
		      {
		          $('#errorDialog').dialog('close');
		      }
		  }
	   ]
    });

    $("#debugDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Message Log',
        modal: true,
        width: 610,
        height: 500,
        show: { effect: "drop", direction: "up" },
        open: function ()
        {
            enableEnterKey("debugCloseButton");

            $('#debugFilter').keyup(function (event)
            {
                var currVal = $(this).val();
                if (currVal.length == 0)
                {
                    var currVal = $(this).val();
                    if (currVal.length == 0)
                    {
                        currVal = "*";
                    }
                    framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, currVal, framework.ui.showLogMessagesCallback);
                }
                else
                {
                    framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, currVal, framework.ui.showLogMessagesCallback);
                }

                //                $('#debugFrom').change(function (event)
                //                {
                //                    if ($('#debugFrom').val().trim().length == 0 || $('#debugTo').val().trim().length == 0)
                //                    {
                //                        return;
                //                    }
                //                    var currVal = $(this).val();
                //                    if (currVal.length == 0)
                //                    {
                //                        currVal = "*";
                //                    }
                //                    framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, currVal, framework.ui.showLogMessagesCallback);
                //                });

                //                $('#debugTo').change(function (event)
                //                {
                //                    if ($('#debugFrom').val().trim().length == 0 || $('#debugTo').val().trim().length == 0)
                //                    {
                //                        return;
                //                    }
                //                    var currVal = $(this).val();
                //                    if (currVal.length == 0)
                //                    {
                //                        currVal = "*";
                //                    }
                //                    framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, currVal, framework.ui.showLogMessagesCallback, 1, $('#debugFrom').val().trim(), $('#debugTo').val().trim());
                //                });

                //                $("#debugFrom").datepicker({
                //                    defaultDate: "+1w",
                //                    changeMonth: true,
                //                    numberOfMonths: 1,
                //                    onClose: function (selectedDate)
                //                    {
                //                        $("#to").datepicker("option", "minDate", selectedDate);
                //                    }
                //                });


                //                $("#debugTo").datepicker({
                //                    defaultDate: "+1w",
                //                    changeMonth: true,
                //                    numberOfMonths: 1,
                //                    onClose: function (selectedDate)
                //                    {
                //                        $("#from").datepicker("option", "maxDate", selectedDate);
                //                    }
                //                });

            });
        },
        buttons: [
		  {
		      text: "delete",
		      click: function ()
		      {
		          // remove highlighted rows

		          // set up function to delete log rows
		          var callback = function ()
		          {
		              var currVal = $("#debugFilter").val();
		              if (currVal.length == 0)
		              {
		                  currVal = "*";
		              }

		              var callback = function ()
		              {
		                  $("#debugFilter").val("");
		                  $("#debugFilter").focus();
		                  framework.dataObj.GetLogMessages(framework.configInfo.developerEmail, "*", framework.ui.showLogMessagesCallback);
		              }

		              framework.dataObj.DeleteLogMessages(framework.configInfo.developerEmail, currVal, callback);
		          }

		          var confirmMessage = "";

		          if ($("#debugFilter").val().length == 0)
		          {
		              confirmMessage = "Are you sure you want to clear all of your entries from the message log?";
		          }
		          else
		          {
		              confirmMessage = "Are you sure you want to clear the selected messages from the message log?";
		          }

		          confirmDialog(confirmMessage, "Confirm Delete", callback);

		      }
		  },
		  {
		      text: "close",
		      id: "debugCloseButton",
		      click: function ()
		      {
		          $('#debugDialog').dialog('close');
		      }
		  }
	   ]
    });

    $("#confirmationDialog").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Confirm',
        modal: true,
        width: 350,
        height: 225,
        show: { effect: "drop", direction: "up" },
        open: function ()
        {
            enableEnterKey("contactDialog", "sendButton");
        },
        buttons: [
		      {
		          text: "cancel",
		          click: function ()
		          {
		              $('#confirmationDialog').dialog('close');
		          }
		      },
		      {
		          text: "ok",
		          id: "confirmButton",
		          click: function ()
		          {
		              // This function object must be set programatically
		              framework.ui.confirmFunction();

		              $('#confirmationDialog').dialog('close');
		          }
		      }
	       ]
    });

    $("#siteMessage").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Message',
        modal: true,
        height: 200,
        width: 300,
        buttons: [
		  {
		      text: "0k",
		      click: function () { $(this).dialog("close"); }
		  }
	   ]
    });

    $("#signIn").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Sign In',
        modal: true,
        width: 370,
        buttons: [
		  {
		      text: "Ok",
		      click: function () { login(); }
		  }
	   ]
    });

    $('#signIn').keypress(function (e)
    {
        if (e.keyCode == $.ui.keyCode.ENTER)
        {
            login();
        }
    });

    $("#instructorsDialog").dialog({
	   autoOpen: false,
	   resizable: false,
	   title: 'Select Instructors',
	   modal: true,
	   width: 270,
	   buttons: [
		  {
			 "id": "cancelButton",
			 text: "cancel",
			 click: function () { $(this).dialog("close"); }
		  },
		  {
			 "id": "selectInstructorsButton",
			 text: "save",
			 click: function() {framework.ui.setInstructors();}
		  }
	   ]
    })    

    $("#simplePopup").dialog({
        autoOpen: false,
        resizable: false,
        title: 'Message',
        modal: true,
        width: 370
    });
}



