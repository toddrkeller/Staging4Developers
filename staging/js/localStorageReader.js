function LocalStorage()
{
    this.validateUser = function(UserID, pw, validationCallback)
    {
        alert("LocalStorage:validateUser() not implemented");
        if (typeof validationCallback == "function") validationCallback();
    }

    this.GetStudentInfo = function()
    {
        alert("LocalStorage:GetStudentInfo() not implemented");
    }

    this.GetStudentDetails = function(userEmail, callback)
    {
        alert("LocalStorage:GetStudentDetails() not implemented");
    }
    
    this.GetStudents = function(ClassID, callback)
    {
        alert("LocalStorage:GetStudents() not implemented");
    }

    this.GetLessonInfo = function()
    {
        alert("LocalStorage:GetLessonInfo() not implemented");
    }
    
    this.GetActivityInfo = function()
    {
        alert("LocalStorage:GetActivityInfo() not implemented");
    }
    
    this.WriteProgress = function(progress, callback)
    {
        var enccode = "ojyh45@#";

        // load array from cookie and/or database
        var cookieKey = "UserProgress_" + $.rc4EncryptStr(FrameworkObj.UserID.toLowerCase(), enccode);

        setSimpleCookie(cookieKey, progress, 4000);
        if (typeof callback == 'function') callback();
    }
    
    this.ReadProgress = function()
    {
        alert("LocalStorage:ReadProgress() not implemented");
    }

    this.GetCourseProgress = function(LoadLocalProgress)
    {
        FrameworkObj.progress.SerializedProgress = getSimpleCookie(cookieKey);
        if (typeof LoadLocalProgress == "function") LoadLocalProgress();
    }

    this.RegisterUser = function()
    {
        alert("LocalStorage:RegisterUser() not implemented");
    }

    this.LogMessage = function(userID, message)
    {
        return false; // not avaliable for local systems
    }

    this.GetLogMessages = function(userID, SearchStr, callback)
    {
        return false; // not avaliable for local systems
    }

    this.getInstructors = function(callback);
    {
        alert("LocalStorage:getInstructors() not implemented");
    }

    this.getClasses = function(callback)
    {
        alert("LocalStorage:getClasses() not implemented");
    }

    this.ClearClassInstructors = function(classID, callback1)
    {
        alert("LocalStorage:ClearClassInstructors() not implemented");
    }

    this.GetInstructorDetails = function(email, callback)
    {
        alert("LocalStorage:GetInstructorDetails() not implemented");
    }

    this.AddStudentToClass = function(email, classID, callback)
    {
        alert("LocalStorage:AddStudentToClass() not implemented");
    }

    this.GetGlossaryItems = function(Letter, callback)
    {
        alert("LocalStorage:GetGlossaryItems() not implemented");
    }

    this.GetStudentAnswers = function(LessonID, ActivityID, ClassID)
    {
        alert("LocalStorage:GetStudentAnswers() not implemented");
    }
    
}