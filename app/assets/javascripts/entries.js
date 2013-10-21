//http request for updating posts
//get content/userid/entryid from database

var autoSaveTimer = new Timer();
var INTERVAL = 10000;

function entry_update(){
	//$.post("/entries", {entry: {content: "call_getcontent_here", userid: "call_getuserid_here"}});
        var id = get_userid();
	$.ajax({ url: "/entries/"+get_postid(), 
                 data:{ entry:
                            { content: $("#entry_content").val() }},
                 datatype: "json",
                 type: "put"});
}

function get_userid(){
	return $("#userid").val();
}

function get_postid() {
    return 10;
}

function get_entrycontent(){

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
        console.log("Did something");
    };
    autoSaveTimer.start();
}
