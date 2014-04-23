/* This file is NOT required for PlayIt.  
However in order to run the demos is IS required */

//MODES: DEV, WEB, PRO
//Build scripts modify these vars
var PLAYIT = new Object();
var PLAYIT_MODE;
var PLAYIT_VERSION;
var PLAYIT_DETAILS;
var PLAYIT_ONLINE_DEMOS = 'demo/data-web/index.html';

var PLAYIT_MODE_SET = PLAYIT_MODE || "DEV";
var PLAYIT_VERSION_SET = PLAYIT_VERSION || "1.0";


switch (PLAYIT_MODE_SET) {
	case "DEV" : PLAYIT_DETAILS	= "<span id='playit-devversion'>Developer " + PLAYIT_VERSION_SET + "</span>"; break;
	case "PRO" : PLAYIT_DETAILS = "<span id='playit-proversion'>Pro Version " + PLAYIT_VERSION_SET  + "</span>"; break;
}

jQuery(document).ready(function ()
{
	function isCompressionOn() 
	{
		var trigger1 = false;
		jQuery('head script').each(function() 
		{
			if (this.src.toLowerCase().indexOf("jquery.playit.min.js") != -1)
			{
				trigger1 = true;
			}
		});
		
		return (trigger1);
	}
	
	//Show Active Version in UI
	var fullDetails = PLAYIT_DETAILS + " | ";
	fullDetails += (isCompressionOn()) 
		? "<span class='playit-compression'>compression: on</span>"
		: "<span class='playit-compression'>compression: off</span>";

	jQuery('#playit-version-mode').html(fullDetails);
	
});


// =====================================
// UTILITY FUNCTIONS
PLAYIT.getParameterByName =	function (name)
{
	var name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}


