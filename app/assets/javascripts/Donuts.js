
//Namespace register
var Donuts = Donuts||{};
Donuts.Application = Donuts.Application||{};
Donuts.Utils = Donuts.Utils||{};
Donuts.Editor = Donuts.Editor||{};

INTERVAL = 10000; //TODO Get from db, this line should not be here

Donuts.init = function() {
    Donuts.Timers = {};
    Donuts.Editor.Initialize();
    Donuts.Application.InitTimers(Donuts.Timers);
    Donuts.Application.AttachEvents();
};

/* ------------------------------------- *
 *   Application namespace definitions   *
 * ------------------------------------- */
Donuts.Application.UpdateEntry = function() {
    var uid = Donuts.Utils.GetUserID();
    var entryid = Donuts.Utils.GetEntryID();
    tinyMCE.triggerSave();
    if(entryid === "") {
        $.ajax({ url: "/entries",
                 data:  { entry: { content: $("#entry_content").val(),
                                   user_id: uid}},
                 dataType: "json",
                 type: "post",
                 success: function(data) {
                     $("#popUpDiv").data("entry-id", data.id);
                 }});
    }
    else {
        $.ajax({ url: "/entries/" + Donuts.Utils.GetEntryID(), 
                 data:{ entry: { content: $("#entry_content").val(),
                                 distraction_count: Donuts.Utils.TotalDistractions(),
                                 duration: Donuts.Utils.TotalDuration() }},
                 dataType: "json",
                 type: "put"});
    }
};

Donuts.Application.AutoSaveCallback = function() {
    Donuts.Application.UpdateEntry();
    this.stop();    //TODO Verify using 'this' here is best practice
    this.reset();
    this.start();
};

Donuts.Application.DistractionCallback = function() {
    //TODO Figure out some better way of doing all of this
    var AlertDiv = document.getElementById("distractionAlerts");
    AlertDiv.style.backgroundColor = "#cc0011";
    AlertDiv.innerHTML = "DISTRACTED!!!\n<br/>\n";
    AlertBody(AlertDiv);
};

Donuts.Application.FocusedCallback = function() {
    var AlertDiv = document.getElementById("distractionAlerts");
    AlertDiv.style.backgroundColor = "#00cc11";
    AlertDiv.innerHTML = "NOT DISTRACTED!!!\n<br/>\n";
    AlertBody(AlertDiv);
};

Donuts.Application.InitTimers = function(Timers) {
    Timers["AutoSave"] = new Timer();
    Timers["AutoSave"].setDuration(-1);
    Timers["AutoSave"].setInterval(5000); //TODO Get from db
    Timers["AutoSave"].onTick = Donuts.Application.AutoSaveCallback;
    Timers["Distraction"] = new DistractionTimer(function() { 
            Donuts.Application.DistractionCallback(); 
        }, 
        
        function() { 
            Donuts.Application.FocusedCallback(); 
        }
    );
    Timers["Distraction"].Initialize(INTERVAL);
};
Donuts.Application.AttachEvents = function() {
    $(document).on("click", "#opener", Donuts.Application.OpenEditor);
    $(".close").click(function() {
        $(this).closest("div").hide();
    });
};

Donuts.Application.StartTimers = function() {
    Donuts.Timers["Distraction"].Start();
    Donuts.Timers["AutoSave"].start();
};

Donuts.Application.StopTimers = function() {
    Donuts.Timers["Distraction"].Stop();
    Donuts.Timers["AutoSave"].stop();
};

Donuts.Application.OpenEditor = function() { 
    Donuts.Application.StartTimers();
    $.getJSON("/entries/current", function(result){
        Donuts.Editor.ToggleDisplay("popUpDiv");
        if(result != null) {
            $('#popUpDiv').data('entry-id', result.id);
            $('#popUpDiv').data('dist-count', result.distraction_count);
            $('#popUpDiv').data('dist-time', result.duration);
            tinyMCE.get("entry_content").setContent(result.content);
        }
        Donuts.Application.FocusedCallback();
    });
};

/* -------------------------------------------*
 *       Utils namespace definitions          *
 * -------------------------------------------*/
   
Donuts.Utils.GetUserID = function() {
    return $("#userid").val();
};

Donuts.Utils.GetEntryID = function() {
    return $("#popUpDiv").data("entry-id");
};

Donuts.Utils.GetSavedDistractionCount = function() {
    var DistractionCount = $("#popUpDiv").data("dist-count");
    return (DistractionCount === "" ? 0 : DistractionCount);
};

Donuts.Utils.GetSavedDistractionDuration = function() {
    var DistractionDuration = $("#popUpDiv").data("dist-time");
    return (DistractionDuration === "" ? 0 : DistractionDuration);
};

Donuts.Utils.TotalDistractions = function() {
    return Donuts.Utils.GetSavedDistractionCount() + Donuts.Timers["Distraction"].DistractionCount();
};

Donuts.Utils.TotalDuration = function() {
    return Donuts.Utils.GetSavedDistractionDuration() + Donuts.Timers["Distraction"].DistractionDuration();
};

/* --------------------------------------------- *
 *          Editor namespace defintions          *
 * --------------------------------------------- */

Donuts.Editor.Initialize = function() {
    tinyMCE.init({
	// General options
	mode : "textareas",
	theme : "advanced",
    skin: "donuts",
	width : "1000",
	height : "500",
	save_onsavecallback : Donuts.Editor.SaveClickHandler, //"addEntry",
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
		    Donuts.Editor.ToggleDisplay("popUpDiv");
                    Donuts.Application.StopTimers();
		}
	    });
	    ed.onKeyPress.add(function(ed, e) { Donuts.Timers["Distraction"].KeyPressHandler(); });
	}
    });
};

Donuts.Editor.SaveClickHandler = function() {
    Donuts.Application.UpdateEntry();
    location.reload(true);
};

Donuts.Editor.ToggleDivDisplay = function(divID) {
    var el = document.getElementById(divID);
    if(el.style.display == 'none') {
        el.style.display = 'block';
    }
    else {
        el.style.display = 'none';
    }
};

Donuts.Editor.StyleBackdrop = function(DivElem) {
	if (typeof window.innerWidth != 'undefined') {
		viewportheight = window.innerHeight;
	} 
        else {
		viewportheight = document.documentElement.clientHeight;
	}
	if ((viewportheight > document.body.parentNode.scrollHeight) && (viewportheight > document.body.parentNode.clientHeight)) {
		backdrop_height = viewportheight;
	} 
        else {
		if (document.body.parentNode.clientHeight > document.body.parentNode.scrollHeight) {
			backdrop_height = document.body.parentNode.clientHeight;
		} else {
			backdrop_height = document.body.parentNode.scrollHeight;
		}
	}
	var backdrop = document.getElementById('blanket');
	backdrop.style.height = backdrop_height + 'px';
	var popUpDiv = document.getElementById(DivElem);
	popUpDiv_height=backdrop_height/2-150;
	popUpDiv.style.top = popUpDiv_height + 'px';
};

Donuts.Editor.ToggleDisplay = function(windowname) {
    Donuts.Editor.StyleBackdrop(windowname);
    Donuts.Editor.ToggleDivDisplay('blanket');
    Donuts.Editor.ToggleDivDisplay(windowname);
};

/* Temporary function until status bar is real
   TODO Get rid of this function and make proper
        status bar
*/
function AlertBody(AlertDiv) {
    AlertDiv.innerHTML += "Distractions: " + Donuts.Utils.TotalDistractions() + "<br>" +
                          "Duration: " + Donuts.Utils.TotalDuration();
}
