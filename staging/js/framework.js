var framework;

function initialize_iLearn()
{
    window.framework = new framework();
    framework = window.framework;
//    window.framework.constructor();
}

function framework()
{

	this.progressStatus = { "noAttempt": 0, "success": 1, "inProgress": 2, "failed": 3 };
    this.location = document.location.href;
    this.path = window.location.pathname;

	this.standalone = window.location.protocol == 'file:';
    this.UserID = 'instructor@gmail.com~instructor'; //getSimpleCookie('logged_in_UserID');
    this.Units = new Array();
    this.instructorList = new Array();
    this.currentInstructorDetails = new Array();
    //this.glossary = new Glossary();
	
    this.activeLesson 	= -1;
    this.activeActivity = -1;

	//this.student = new StudentInfo();
	this.dataObj = null;
	this.ui = new UI(); this.ui.constructor(this);
	//this.progress = new Progress(); this.progress.constructor(this);
	this.configInfo = new ConfigInfo();
	//alert(this.configInfo.xmlPath);
	this.currentUnit = null;

    this.cookieDuration = 24 * 300; // default to 300 days
	this.registrationType = 'unset';
	
	//ech***  MOVE TO THE END OF LOADACTIVITY
	
	// set up culture notes and grammar notes

} // ---- END OF CLASS


function ConfigInfo()
{
	this.targetLanguage = "japanese";
	this.targetLangSm = "ja";
	this.coursePath = "/";
	this.templates = "templates/";
	this.xmlPath = "lessons/japanese/xml";
	this.mediaPath = "lessons/japanese/media";
	this.languagePath = "";
	this.developerEmail 	= "";
    this.developerPW = "";
    this.installationType = "classroom";
    this.cultureNotesPath = "lessons/japanese/culture_notes";
    this.grammarNotesPath = "lessons/japanese/grammar_note";

	var ThisRef = this;  // needed because we lose 'this' on ajax calls
	this.Load = function()
	{
        ajaxURL = "config.xml";

		// read from /config.xml
        $.ajax({
		
            type: "GET",
            url: ajaxURL,
         //   async: false,
            dataType: "xml",  //($.browser.msie) ? "text" : "xml",
            success: function (data)
            {
                data = parseXml(data);
                ThisRef.coursePath 		= $(data).find("coursePath").text();
                var coursePath 			= ThisRef.coursePath;
                ThisRef.activityCommonFolderPath = $(data).find("activityCommonFolderPath").text();
                ThisRef.targetLanguage 	= $(data).find("targetLanguage").text();
                ThisRef.targetLangSm 	= $(data).find("targetLangSm").text();
                ThisRef.templates		= $(data).find("templates").text();
                ThisRef.images 			= coursePath + $(data).find("images").text();
                ThisRef.jwplayer 		= coursePath + $(data).find("jwplayer").text();
                ThisRef.developerMode 	= $(data).find("developerMode").text();
                ThisRef.installationType = $(data).find("installationType").text();
                ThisRef.cultureNotesPath = $(data).find("cultureNotes").text();
                ThisRef.grammarNotesPath = $(data).find("grammarNotes").text();
                var devInfoArray    	= $(data).find("developerInfo").text().split('~');
                if (devInfoArray.length == 2)
                {
                	ThisRef.developerEmail 	= devInfoArray[0];
                	ThisRef.developerPW 	= devInfoArray[1];
                }
                ThisRef.xmlPath 	 = "{0}lessons/{1}/xml".format(coursePath, ThisRef.targetLanguage);
                ThisRef.mediaPath 	 = "{0}lessons/{1}/media".format(coursePath, ThisRef.targetLanguage);
                ThisRef.languagePath = "{0}lessons/{1}".format(coursePath, ThisRef.targetLanguage);
            },
            error: function (XMLHttpRequest, status, error)
            {
                alert('read paths XML Ajax Error: ' + error);
            }
        });
    }
}	