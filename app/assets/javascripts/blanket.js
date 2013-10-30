function initTiny() {
    tinyMCE.init({
	// General options
	mode : "textareas",
	theme : "advanced",
	width : "1000",
	height : "500",
	save_onsavecallback : "addEntry",
	plugins : "spellchecker,pdw,lists,style,save,insertdatetime,searchreplace,paste,nonbreaking,wordcount,advlist,visualblocks",

	// Theme options
	theme_advanced_buttons1 : "close,save,pdw_toggle",
	theme_advanced_buttons2 : "newdocument,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,fontselect,fontsizeselect",
	theme_advanced_buttons3 : "forecolor,backcolor,|,spellchecker,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,insertdate,inserttime",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : false,
	
	//Toggles show/hide toolbars
	pdw_toggle_on : 1,
	pdw_toggle_toolbars : "2, 3",
	
	//Setup for custom buttons
	setup : function(ed) {
	    // Close Editor Button
	    ed.addButton('close', {
		label : 'Close',
		image : 'close.png',
		onclick : function() {
		    popup("popUpDiv");
            autoSaveTimer.stop();
            otherTimer.stop();
            tinyTimer.GetTimer().stop();
		}
	    });
	    ed.onKeyPress.add(function(ed, e) {tinyTimer.KeyPressHandler(); });
	}
    });
}

function addEntry(){
    var saveButton = document.getElementById("createEntry");
    saveButton.submit();
}

function toggle(div_id) {
	var el = document.getElementById(div_id);
	if ( el.style.display == 'none' ) {	el.style.display = 'block';}
	else {el.style.display = 'none';}
}
function blanket_size(popUpDivVar) {
	if (typeof window.innerWidth != 'undefined') {
		viewportheight = window.innerHeight;
	} else {
		viewportheight = document.documentElement.clientHeight;
	}
	if ((viewportheight > document.body.parentNode.scrollHeight) && (viewportheight > document.body.parentNode.clientHeight)) {
		blanket_height = viewportheight;
	} else {
		if (document.body.parentNode.clientHeight > document.body.parentNode.scrollHeight) {
			blanket_height = document.body.parentNode.clientHeight;
		} else {
			blanket_height = document.body.parentNode.scrollHeight;
		}
	}
	var blanket = document.getElementById('blanket');
	blanket.style.height = blanket_height + 'px';
	var popUpDiv = document.getElementById(popUpDivVar);
	popUpDiv_height=blanket_height/2-150;
	popUpDiv.style.top = popUpDiv_height + 'px';
}
function popup(windowname) {
  initTiny();
  window.tinyTimer = new DistractionTimer(function() { AlertDistraction(); }, function() { AlertFocused(); });
  window.otherTimer = new Timer();
  blanket_size(windowname);
  toggle('blanket');
  toggle(windowname);
  tinyTimer.Initialize(5000);
  initAutoSave();
  AlertFocused();
}

function AlertDistraction()
{
    dAlerts = document.getElementById("distractionAlerts");
    dAlerts.style.backgroundColor = "#cc0011";
    dAlerts.innerHTML = "DISTRACTED!!!\n<br/>\n";
    AlertBody();
    otherTimer.onTick = function() {
        dAlerts.innerHTML = "DISTRACTED!!!\n<br />\n";
        AlertBody();
    };
    otherTimer.start(1000, -1);
}

function AlertFocused()
{
    dAlerts = document.getElementById("distractionAlerts");
    dAlerts.style.backgroundColor = "#00cc11";
    dAlerts.innerHTML = "NOT DISTRACTED!!!\n<br/>\n";
    AlertBody();
    otherTimer.stop();
    otherTimer.reset();
}

function AlertBody()
{
    dAlerts = document.getElementById("distractionAlerts");
    var distCount = $("#popUpDiv").data("dist-count") + tinyTimer.GetDistractions().numDistractions();
    var distLength = $("#popUpDiv").data("dist-time") + tinyTimer.GetDistractions().TotalDuration();
    dAlerts.innerHTML += "Distractions: " + distCount + "\n<br />\n" +
                         "Duration(sec): " + distLength; 
}  
