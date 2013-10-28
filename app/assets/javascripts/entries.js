//http request for updating posts
//get content/userid/entryid from database

var autoSaveTimer = new Timer();
var INTERVAL = 10000;

function entry_update(){
	//$.post("/entries", {entry: {content: "call_getcontent_here", userid: "call_getuserid_here"}});
    var uid = get_userid();
    var entryid = get_postid();
    console.log(entryid);
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
        var oldDistractions = getOldDistractions();
        var oldDuration = getOldDuration();
	    $.ajax({ url: "/entries/"+get_postid(), 
                 data:{ entry:
                            { content: $("#entry_content").val(),
                              distraction_count: oldDistractions + tinyTimer.GetDistractions().numDistractions(),
                              duration: oldDuration + tinyTimer.GetDistractions().TotalDuration() }},
                 dataType: "json",
                 type: "put"});
    }
}

function get_userid(){
	return $("#userid").val();
}

function get_postid() {
    return $("#popUpDiv").data("entry-id");
}

function getOldDistractions() {
    var oldDistractions = $("#popUpDiv").data("dist-count");
    return (oldDistractions === "" ? 0 : oldDistractions);
}

function getOldDuration() {
    var oldDuration = $("#popUpDiv").data("dist-time");
    return (oldDuration === "" ? 0 : oldDuration);
}

function initAutoSave() {
    autoSaveTimer.setDuration(-1);
    autoSaveTimer.setInterval(INTERVAL);
    autoSaveTimer.onTick = function() { 
        tinyMCE.triggerSave();
        entry_update();
        this.stop();
        this.reset();
        this.start();
    };
    autoSaveTimer.start();
}
