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
	theme_advanced_buttons2 : "newdocument,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,fontsizeselect",
	theme_advanced_buttons3 : "forecolor,backcolor,|,spellchecker,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,insertdate,inserttime,|,Verbatim, Monospace",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : false,
	
	//Toggles show/hide toolbars
	pdw_toggle_on : 1,
	pdw_toggle_toolbars : "2, 3",
	
	//Setup for custom buttons
	setup : function(ed) {
	    //status of toggle buttons verbatim and monospace
	    var verbatimToggle = false;
	    var monospaceToggle = false;
	    
	    //TinyMCE Default settings
	    ed.onInit.add(function(ed) {
		ed.getDoc().body.style.font="18px arial, serif";
	    });

	    ed.addButton('Verbatim',{
		title : 'Change verbatim',
		image : 'V.png',
		onclick : function(){
		    //verbatim is off being turned on
		    if(!verbatimToggle){
			ed.execCommand('FormatBlock', false, 'blockquote');
			ed.execCommand('FontName', false, 'Monospace');
			ed.controlManager.get('Verbatim').setActive(true);
			verbatimToggle = true;
		    }
		    //verbatim is on being turned off
		    else{
			ed.execCommand('FormatBlock', false, 'blockquote');
			ed.execCommand('FontName', false, 'Monospace');
			ed.controlManager.get('Verbatim').setActive(false);
			verbatimToggle = false;
		    }          	
		}
	    });
	    
	    // Monospace button
	    ed.addButton('Monospace',{
		title : 'Change to monospace',
		image : 'M.png',
		onclick : function(){
		    if(!verbatimToggle){
			//monospace is off being turned on
			if(!monospaceToggle){
			    monospaceToggle = true;
			    ed.controlManager.get('Monospace').setActive(true);
			    ed.execCommand('FontName', false, 'Monospace');
			}
			//monospace is on being turned off
			else{
			    monospaceToggle = false;
			    ed.controlManager.get('Monospace').setActive(false);
			    ed.execCommand('FontName',false, 'Arial');
			}
		    }
		}
	    });
	    
	    // checks the current node type to activate/deactivate monospace button
	    ed.onNodeChange.add(function(ed, cm, e) {
		// just need to fix the cursor positiong to +1 and -1 form current position
		// to get from non-mono to mono when backspacing
		// currently backspacing from mono to non-mono works
		if(e.style.fontFamily != 'Monospace') {
		    cm.setActive('Monospace', false);
		    monospaceToggle = false;
		}
		else if(e.style.fontFamily == 'Monospace') {
		    cm.setActive('Monospace', true);
		    monospaceToggle = true;
		}
	    });
	    
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
	    
	    // Checks for keypresses to become not distracted.
	    ed.onKeyPress.add(function(ed, e) {tinyTimer.KeyPressHandler(); });
	}
    });
}

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
}

function addEntry(){
    var saveButton = document.getElementById("createEntry");
    saveButton.submit();
}

function downloads(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
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
