
//Namespace register
var Donuts = Donuts||{};
Donuts.Application = Donuts.Application||{};
Donuts.Utils = Donuts.Utils||{};

INTERVAL = 10000; //TODO Get from db, this line should not be here

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
        popup("popUpDiv");
        if(result != null) {
            $('#popUpDiv').data('entry-id', result.id);
            $('#popUpDiv').data('dist-count', result.distraction_count);
            $('#popUpDiv').data('dist-time', result.duration);
			$('#popUpDiv').data('created-at', result.created_at);
            tinyMCE.get("entry_content").setContent(result.content);
        }
        Donuts.Application.FocusedCallback();
    });
    //console.log($("#popUpDiv").data("created-at"));
    window.statsMan = new stats(document.getElementById("distractionAlerts"), 20); //initalize the stats manager

};

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

Donuts.init = function() {
    Donuts.Timers = {};
    initTiny();
    Donuts.Application.InitTimers(Donuts.Timers);
    Donuts.Application.AttachEvents();
};

/* Temporary function until status bar is real
   TODO Get rid of this function and make proper
        status bar
*/
function AlertBody(AlertDiv) {
    AlertDiv.innerHTML += "Distractions: " + Donuts.Utils.TotalDistractions() + "<br>" +
                          "Duration: " + Donuts.Utils.TotalDuration();
}
