function Glossary()
{
	this.GlossaryGroups = new Array();
	var glossaryObj = this;
	var groupingsArray = ['ab','cd','ef','gh','ij','kl','mn','op','qr','st','uv','wx','yz'];

	this.initialize = function()
	{

		var callback = function(data)
		{
			var leftGroup   = new Array();
			var rightGroup  = new Array();

			if (typeof data.d[0] == 'undefined') return;

			// determin what group index we're in, and what side
			var letterIndex = data.d[0].Word_tl[0].toLowerCase();
			for (var i = 0; i < groupingsArray.length; i++)
			{
				var letterGroup = groupingsArray[i];
				if (letterGroup.indexOf(letterIndex) >= 0) break;
			}

			// create the glossary array element if necessary and push group value
			if (typeof glossaryObj.GlossaryGroups[letterGroup] == "undefined")
			{
				glossaryObj.GlossaryGroups[letterGroup] = new Array(2);
				glossaryObj.GlossaryGroups[letterGroup][0] = new Array();
				glossaryObj.GlossaryGroups[letterGroup][1] = new Array();
			}

			var sideIndex = letterGroup.indexOf(letterIndex);
			for (var dataIndex = 0; dataIndex < data.d.length-1; dataIndex++)
			{
				glossaryObj.GlossaryGroups[letterGroup][sideIndex].push("{0}~{1}".format(data.d[dataIndex].Word_tl, data.d[dataIndex].Word));
			}
		}

		for (var i = 0; i < groupingsArray.length; i++)
		{
			var leftLetter  = groupingsArray[i][0];
			var rightLetter = groupingsArray[i][1];

			framework.dataObj.GetGlossaryItems(leftLetter, callback);
			framework.dataObj.GetGlossaryItems(rightLetter, callback);
		}
	}

	this.getGlossaryGroup = function(letterGroup)
	{
		return this.GlossaryGroups[letterGroup];
	}

	this.getGlossaryGroups = function()
	{
		var contents = [this.leftGroup, this.rightGroup];
		return contents;		
	}

	this.search = function()
	{
		var searchString = $("#searchString").val();
		if (searchString.length < 2)
		{
			$("#glossarySearchResults").html("Minimum search length is 2 characters");
			return;
		}


		var callback = function(data)
		{
		    var output = data.d.length == 0 ? "<div class='searchResults'>no results found</div>" : "";
		    var word = "";
		    for (var i = 0; i < data.d.length; i++)
		    {
		    	if (data.d[i].Word == word) continue;
		    	word = data.d[i].Word;
		    	var wordout = word.replace(searchString, "<span style='color:red'>{0}</span>".format(searchString));
		        output += "<div class='glossaryLabel'>{0}</div><div class='glossaryValue'>{1}</div><div style='clear:both'></div>".format(wordout, data.d[i].Word_tl);
		    }
		    
			$("#glossarySearchResults").html(output);
		}

		framework.dataObj.searchGlossary(searchString, callback);
	}
}