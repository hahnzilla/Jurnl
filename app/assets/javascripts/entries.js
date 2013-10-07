//http request for updating posts
//get content/userid/entryid from database

function entry_update(){
	$.post("/entries", {entry: {content: "call_getcontent_here", userid: "call_getuserid_here"}});
	$.put("/entries/"+var_id, {entry:{content: "call_getcontent_here"}})
}

function get_userid{
	$.get("")
}

function get_entrycontent{

}