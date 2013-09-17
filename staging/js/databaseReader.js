//***********
//  Any function that you add to this file, 
//  must also be added to localStorageReader.js
//***********

function DatabaseReader()
{
    var FrameworkObj = null;
    this.constructor = function(obj)
    {
        FrameworkObj = obj;
    }   

    this.connectionString = "";  // must be set after instanciation 

    this.validateUser = function(UserID, pw, validationCallback)
    {
        var callback = function(data)
        {
            if (typeof validationCallback == "function")
            {
                validationCallback(UserID, data.d);               
            } 
        }
        var ajaxData = "{'email':'{0}','Password':'{1}'}".format(UserID, pw);
        callWebService("login", "VerifyUser", ajaxData, callback);
    }

    this.GetStudentInfo = function()
    {
        alert("DatabaseReader:GetStudentInfo() not implemented");
    }
    
    this.GetLessonInfo = function()
    {
        alert("DatabaseReader:GetLessonInfo() not implemented");
    }
    
    this.GetActivityInfo = function()
    {
        alert("DatabaseReader:GetActivityInfo() not implemented");
    }
    
    this.WriteProgress = function(progress, callback)
    {
        var ajaxData = "{'Language':'{0}','UserID':'{1}','progress':'{2}'}".format(FrameworkObj.configInfo.targetLangSm, FrameworkObj.UserID.toLowerCase(), progress);
        callWebService("main", "WriteProgress", ajaxData, callback);
    }
    
    this.ReadProgress = function()
    {
        alert("DatabaseReader:ReadProgress() not implemented");
    }

    this.GetCourseProgress = function(LoadLocalProgress)
    {
        /*
        Progress is stored as a serialized string in the database for each registered user.
        This ajax calls into a web service which then gets the progress from the db and returns
        the serialized string.                
        */

        var callback = function(data)
        {
            FrameworkObj.progress.SerializedProgress = data.d;
            if (typeof LoadLocalProgress == "function") LoadLocalProgress();
        }

        var ajaxData = "{'Language':'{0}','UserID':'{1}'}".format(FrameworkObj.configInfo.targetLangSm, FrameworkObj.UserID.toLowerCase());
        callWebService("main", "GetProgress", ajaxData, callback);
    }

    this.RegisterUser = function(registrationItems, handleRegistrationResult)
    {
        var callback = function(data)
        {
            if (typeof handleRegistrationResult == "function") handleRegistrationResult(registrationItems, data.d);
        }
        
        var Type = framework.registrationType == 'unset' ? 'Student' : framework.registrationType;
        var ajaxData = "{'email':'{0}','FirstName':'{1}','LastName':'{2}','Password':'{3}','Type':'{4}'}".format(registrationItems.registerEmailName, registrationItems.registerFirstName, registrationItems.registerLastName, registrationItems.registerPassword, Type);
        callWebService("login", "RegisterUser", ajaxData, callback);
    }

    this.loadUnitArray = function(callback)
    {
        var handleUnits = function(data)
        {
            if (typeof callback == "function") callback(data);
        }

        var ajaxData = "{'Language':'{0}'}".format(framework.configInfo.targetLangSm); //
        callWebService("main", "GetUnits", ajaxData, handleUnits);
    }

    this.LogMessage = function(userID, message)
    {
        var language = framework.configInfo.targetLangSm;
        var ajaxData = "{'Language':'{0}','UserID':'{1}','Message':'{2}'}".format(language, userID, message);
        callWebService("main", "LogMessage", ajaxData);
    }

    this.GetLogMessages = function (userID, SearchStr, callback)
    {
        var language = framework.configInfo.targetLangSm;
        var ajaxData = "{'Language':'{0}','UserID':'{1}','SearchStr':'{2}'}".format(language, userID, SearchStr);
        callWebService("main", "GetLogMessages", ajaxData, callback);
    }

    this.DeleteLogMessages = function(userID, SearchStr, callback)
    {
        var language = framework.configInfo.targetLangSm;
        var ajaxData = "{'Language':'{0}','UserID':'{1}','SearchStr':'{2}'}".format(language, userID, SearchStr);
        callWebService("main", "DeleteLogMessages", ajaxData, callback);
    }

    this.AddStudentToClass = function(email, classID, callback)
    {
        var successCallback = function (data)
        {
            if (data.d.indexOf('fail:') == 0)
            {
                // failed
                var errorMessage = data.d.split(':')[1];
                showMessage("registerErrorLabel", "<strong>**Error:</strong> " + errorMessage);
                return;
            }
            else
            {
                if (typeof callback == "function") callback();    
                var FirstName = $("#registerFirstName").val();
                var LastName = $("#registerLastName").val();
                clearRegisterFields();
                showMessage("registerErrorLabel", "<strong>{0} {1}</strong> successfully added to class".format(FirstName, LastName), "blue");
    //            buildStudentsTable(classID);
            }

        };

        var ajaxData = "{'Email':'{0}','ClassID':'{1}'}".format(email, classID);
        callWebService("login", "AddStudentToClass", ajaxData, successCallback);

    }

    this.getInstructors = function(callback)
    {
        ajaxData = "{'ClassID':'0'}";
        callWebService("main", "GetInstructors", ajaxData, callback);
    }

    this.GetStudents = function(ClassID, callback)
    {
        var ajaxData = "{'ClassID':'{0}'}".format(ClassID);
        callWebService("main", "GetStudents", ajaxData, callback);        
    }

    this.GetStudentDetails = function(userEmail, callback)
    {
        var ajaxData = "{'Email':'{0}'}".format(userEmail);
        callWebService("main", "GetStudentDetails", ajaxData, callback);
    }

    this.getClasses = function(callback)
    {
        ajaxData = "";
        callWebService("main", "GetClasses", ajaxData, callback);
    }

    this.ClearClassInstructors = function(classID, callback1)
    {
        var ajaxData = "{'ClassID':'{0}'}".format(classID);
        callWebService("main", "ClearClassInstructors", ajaxData, callback1);
    }

    this.SetClassInstructors = function(instructors, classID, callback2)
    {
        var ajaxData = "{'Emails':'{0}', 'ClassID':'{1}'}".format(instructors, classID);
        callWebService("main", "SetClassInstructors", ajaxData, callback2);
    }

    this.GetInstructorDetails = function(email, callback)
    {
        var ajaxData = "{'Email':'{0}'}".format(email);
        callWebService("main", "GetInstructorDetails", ajaxData, callback);
    }

    this.GetGlossaryItems = function(Letter, callback)
    {
        var ajaxData = "{'GlossaryIndex':'{0}','Language':'{1}'}".format(Letter, framework.configInfo.targetLangSm);
        callWebService("main", "GetGlossaryItems", ajaxData, callback);
    }

    this.GetGlossaryItemDetails = function(GlossaryWord, callback)
    {
        var ajaxData = "{'GlossaryIndex':'{0}','Language':'{1}'}".format(GlossaryWord, framework.configInfo.targetLangSm);
        callWebService("main", "GetGlossaryItemDetails", ajaxData, callback);
    }

    this.searchGlossary = function (searchString, callback)
    {
        var ajaxData = "{'SearchString':'{0}','Language':'{1}'}".format(searchString, framework.configInfo.targetLangSm);
        callWebService("main", "SearchGlossary", ajaxData, callback);
    }

    this.GetStudentAnswers = function(LessonID, ActivityID, ClassID, callback)
    {
        var ajaxData = "{'Language':'{0}','LessonID':'{1}','ActivityID':'{2}','ClassID':'{3}'}".format(framework.configInfo.targetLangSm, LessonID, ActivityID, ClassID);
        callWebService("main", "GetStudentAnswers", ajaxData, callback);
    }


}