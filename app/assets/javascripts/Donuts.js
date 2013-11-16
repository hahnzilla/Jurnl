
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
    Donuts.Stats = new stats(document.getElementById("distractionAlerts"), 20);
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
                                 duration: Donuts.Utils.TotalDuration(),
                                 word_count: Donuts.Stats.getWordCount(),
                                 words_per_minute: Donuts.Stats.WPM() }},
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
    /* Stats manager now does this
    var AlertDiv = document.getElementById("distractionAlerts");
    AlertDiv.style.backgroundColor = "#cc0011";
    AlertDiv.innerHTML = "DISTRACTED!!!\n<br/>\n";
    AlertBody(AlertDiv);*/
};

Donuts.Application.FocusedCallback = function () {
    /* Stats manager now does this
    var AlertDiv = document.getElementById("distractionAlerts");
    AlertDiv.style.backgroundColor = "#00cc11";
    AlertDiv.innerHTML = "NOT DISTRACTED!!!\n<br/>\n";
    AlertBody(AlertDiv);*/
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
    $(document).on("click", "#date-icon", Donuts.Application.ToggleDateSearch);
    $(document).on("click", "#prev-month", Donuts.Application.PrevMonthsEntries);
    $(document).on("click", "#next-month", Donuts.Application.NextMonthsEntries);
};

Donuts.Application.StartTimers = function() {
    Donuts.Timers["Distraction"].Start();
    Donuts.Timers["Distraction"].Focus();
    Donuts.Timers["AutoSave"].start();
};

Donuts.Application.StopTimers = function() {
    Donuts.Timers["Distraction"].Stop();
    Donuts.Timers["Distraction"].InternalDistractions.clear();
    Donuts.Timers["AutoSave"].stop();
    Donuts.Stats.stop();
};

Donuts.Application.OpenEditor = function() { 
    Donuts.Application.StartTimers();
    //Ajax call to get the current editor data
    $.getJSON("/entries/current", function(result){
        Donuts.Editor.ToggleDisplay("popUpDiv");
        if(result != null) {
            $('#popUpDiv').data('entry-id', result.id);
            $('#popUpDiv').data('dist-count', result.distraction_count);
            $('#popUpDiv').data('dist-time', result.duration);
            $('#popUpDiv').data('created-at', result.created_at);
            tinyMCE.get("entry_content").setContent(result.content);
            Donuts.Stats.updateStartTime(Donuts.Utils.dateFromString(result.created_at));
            //console.log(result.created_at); //debug
        }
        
        Donuts.Stats.start();
        Donuts.Application.FocusedCallback();
    });
    //window.statsMan = new stats(document.getElementById("distractionAlerts"), 20); //initalize the stats manager
};

Donuts.Application.ToggleDateSearch = function() {
    $(".date-selects").toggleClass("date-selects-hidden");
};

Donuts.Application.PrevMonthsEntries = function() {
    var currentMonthVal = parseInt($("#search_date_month").val());
    var currentYearVal = parseInt($("#search_date_year").val());
    if(currentMonthVal == 1){
      if(!isNaN(currentYearVal)){
        currentYearVal -= 1;
        $("#search_date_year").val(currentYearVal);
      }
      currentMonthVal = 13;
    }
    $("#search_date_month").val(currentMonthVal - 1);
    $("#search-form").submit();
};

Donuts.Application.NextMonthsEntries = function() {
    var currentMonthVal = parseInt($("#search_date_month").val());
    var currentYearVal = parseInt($("#search_date_year").val());
    if(currentMonthVal == 12){
      if(!isNaN(currentYearVal)){
        currentYearVal += 1;
        $("#search_date_year").val(currentYearVal);
      }
      currentMonthVal = 0;
    }
    $("#search_date_month").val(currentMonthVal + 1);
    $("#search-form").submit();
};

/* -------------------------------------------*
 *       Utils namespace definitions          *
 * -------------------------------------------*/
   
Donuts.Utils.GetUserID = function() {
    return $("#entry_user_id").val();
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

Donuts.Utils.secondsToString = function (time, min) {
    // Displays the seconds in hh:mm:ss format
    // doesn't show hh if 00, or mm if 00(unless hour > 00)
    // examples: 5 => 5, 15 => 15, 60 => 1:00, 65 => 1:05, etc
    // other methods return time components
    // if a second argument (min) is given, it defines how many blocks will be shown;
    // ie: if sec = 30 and min = 1, returns 30
    //     if sec = 30 and min = 2, returns 0:30
    var seconds = time % 60;
    var minutes = Math.floor((time % 3600) / 60)
    var hours = Math.floor(time / 3600);

    var hour = ((time >= 3600) || min >= 3) ? hours + ":" : "";
    var minute = ((time >= 60) || min >= 2) ? minutes + ":" : "";
    var second = "" + seconds;

    if (hour && minute.length === 2) minute = "0" + minute;
    if (minute && second.length === 1) second = "0" + second;
    return hour + minute + second;
}

Donuts.Utils.wordCount = function (str){
    // Counts words in the string.
    // If no string is give, gets it from tinyMCE.
    // Note: This seems to work better than the plugin, and is easier to get the
    //      data than from the plugin
    if (!str) str = tinyMCE.activeEditor.getContent();

    //console.log(str); //debug

    var words = str.split(/\s+/);
    var count = 0;

    for (i = 0; i < words.length; i++) {
        // the following tallies up all the non whitespace things
        if (!(
            // Add whitespace words as needed
            words[i] === "&nbsp;" ||
            words[i] === "<p>&nbsp;</p>" ||
            words[i] === ""
            )) count++;
    }
    return count;
}

Donuts.Utils.dateFromString = function (inString) {
    //takes a string date from the ajax call and converts it into # of seconds
    var tokens = inString.split(/-|T|:/);
    return (Date.parse(inString) / 1000) + (tokens[6] * 3600); //the second part adds the timezone offset
}

/* --------------------------------------------- *
 *          Editor namespace defintions          *
 * --------------------------------------------- */

Donuts.Editor.Initialize = function() {
    tinyMCE.init({
	// General options
	mode : "textareas",
	theme : "advanced",
	width : "1000",
	height : "500",
	save_onsavecallback : Donuts.Editor.SaveClickHandler, //"addEntry",
	plugins : "spellchecker,pdw,lists,style,save,insertdatetime,searchreplace,paste,nonbreaking,advlist,visualblocks",

	// Theme options
	theme_advanced_buttons1 : "close,save,pdw_toggle",
	theme_advanced_buttons2 : "newdocument,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,fontselect,fontsizeselect",
	theme_advanced_buttons3 : "forecolor,backcolor,|,spellchecker,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,insertdate,inserttime,Verbatim,Monospace",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : false,
	
	//Toggles show/hide toolbars
	pdw_toggle_on : 1,
	pdw_toggle_toolbars : "2, 3",
	
	//Setup for custom buttons
	setup : function(ed) {

		//Verbatim button
	    ed.addButton('Verbatim',{
		title : 'Change verbatim',
		image : 'V.png',
		onclick : function(){
			ed.execCommand('FormatBlock', false, 'blockquote');
			ed.execCommand('FontName', false, 'Monospace');
			ed.controlManager.get('Verbatim').setActive(true);
		}
	    });

	    // Monospace button
	    ed.addButton('Monospace',{
		title : 'Change to monospace',
		image : 'M.png',
		onclick : function(){
			ed.controlManager.get('Monospace').setActive(true);
			ed.execCommand('FontName', false, 'Monospace');
		}
	    });
	
	    // Close Editor Button
	    ed.addButton('close', {
		image : 'close.png',
		onclick : function() {
		    Donuts.Editor.ToggleDisplay("popUpDiv");
            Donuts.Application.StopTimers();
		}
	    });
	    ed.onKeyPress.add(function(ed, e) { Donuts.Timers["Distraction"].KeyPressHandler(); });
		
		// checks the current node type to activate/deactivate monospace button
	    ed.onNodeChange.add(function(ed, cm, e) {
			var resultnode = resolveNode(e);
			if(resultnode == 'Verbatim'){
				cm.setActive('Verbatim', true);
				cm.setActive('Monospace', false);
				cm.setActive('blockquote', false);
			}else if(resultnode == 'Monospace'){
				cm.setActive('Monospace', true);
				cm.setActive('Verbatim', false);
			}else{
				cm.setActive('Monospace', false);
				cm.setActive('Verbatim', false);
			}
			
			setTimeout(function(){//repeat to make sure
				var resultnode = resolveNode(e);
				if(resultnode == 'Verbatim'){
					cm.setActive('Verbatim', true);
					cm.setActive('Monospace', false);
					cm.setActive('blockquote', false);
				}else if(resultnode == 'Monospace'){
					cm.setActive('Monospace', true);
					cm.setActive('Verbatim', false);
				}else{
					cm.setActive('Monospace', false);
					cm.setActive('Verbatim', false);
				}
			}, 30);
		});
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
