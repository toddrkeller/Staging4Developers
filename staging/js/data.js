// Purpose: 	Provide classes for reading data from xml, database, etc
function callWebService(serviceFile, functionName, ajaxData, successCallback, failCallback)
{
    var webServiceURL = "{0}{1}.asmx/{2}".format(window.framework.configInfo.coursePath, serviceFile, functionName);
    $.ajax({
        type: "POST",
        url: webServiceURL,
        dataType: "json",
        data: ajaxData,
        contentType: "application/json; charset=utf-8",
        success: successCallback,
	   error: function (xhr, ajaxOptions, thrownError)
	   {
            if (typeof failCallback == "function")
            {
                failCallback(xhr, thrownError);
            } 
            else
            {
                siteMessage("Ajax Call Failed for : " + functionName + " -->" + xhr.status + ", " + thrownError);                
            }
        }
    });    
}
