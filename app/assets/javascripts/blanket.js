window.onload = function(){
    initTiny();
};

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

		ed.addButton('Verbatim',{
        	title : 'Change verbatim',
        	image : 'V.png',
        	onclick : function(){
        		//verbatim is off being turned on
        		if(!verbatimToggle){
        			ed.execCommand('FormatBlock', false, 'blockquote');
        			verbatimToggle = true;
        			if(!monospaceToggle){
        				ed.execCommand('FontName', false, 'Andale Mono');
        				mono = true;
        			}
        		}
            	//verbatim is on being turned off
            	else{
            		ed.execCommand('FormatBlock', false, 'blockquote');
            		verbatimToggle = false;
            		if(mono){
            			ed.execCommand('FontName', false, 'Andale Mono');
            			monospaceToggle = false;
            		}
            	}          	
        	}
        });

        ed.addButton('Monospace',{
        	title : 'Change to monospace',
        	image : 'M.png',
        	onclick : function(){

        		if(!verbatimToggle){
        			//monospace is off being turned on
        			if(!monospaceToggle){
        				ed.execCommand('FontName', false, 'Andale Mono');
        				monospaceToggle = true;
        			}
        			//monospace is on being turned off
        			else{
        				ed.execCommand('FontName',false, 'Andale Mono'); 
        				monospaceToggle = false; 
        			}
        		}
            	           		
        	}
        });
        
	    // Close Editor Button
	    ed.addButton('close', {
		label : 'Close',
		image : 'close.png',
		onclick : function() {
		    popup("popUpDiv");
		}
	    });
	}
    });
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
	blanket_size(windowname);
	toggle('blanket');
	toggle(windowname);		
}