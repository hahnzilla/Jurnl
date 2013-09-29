window.onload = function(){
    initTiny();
};

function initTiny() {
    tinyMCE.init({
	// General options
	mode : "textareas",
	//editor_selector :"mceEditor",
	theme : "advanced",
	width : "1000",
	height : "500",
	save_onsavecallback : "addEntry",
	plugins : "spellchecker,pdw,lists,style,save,insertdatetime,searchreplace,paste,nonbreaking,wordcount,advlist,visualblocks",

	// Theme options
	theme_advanced_buttons1 : "close,save,pdw_toggle",
	theme_advanced_buttons2 : "newdocument,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,fontselect,fontsizeselect",
	theme_advanced_buttons3 : "forecolor,backcolor,|,spellchecker,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,insertdate,inserttime",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : false,
	
	pdw_toggle_on : 1,
	pdw_toggle_toolbars : "2, 3",
    
	// Example content CSS (should be your site CSS)
	content_css : "css/content.css",
    
	// Style formats
	style_formats : [
	    {title : 'Bold text', inline : 'b'},
	    {title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
	    {title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
	    {title : 'Example 1', inline : 'span', classes : 'example1'},
	    {title : 'Example 2', inline : 'span', classes : 'example2'},
	    {title : 'Table styles'},
	    {title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
	],
	
	//Setup for custom buttons
	setup : function(ed) {
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
	popUpDiv_height=blanket_height/2-150;//150 is half popup's height
	popUpDiv.style.top = popUpDiv_height + 'px';
}
function window_pos(popUpDivVar) {
	if (typeof window.innerWidth != 'undefined') {
		viewportwidth = window.innerHeight;
	} else {
		viewportwidth = document.documentElement.clientHeight;
	}
	if ((viewportwidth > document.body.parentNode.scrollWidth) && (viewportwidth > document.body.parentNode.clientWidth)) {
		window_width = viewportwidth;
	} else {
		if (document.body.parentNode.clientWidth > document.body.parentNode.scrollWidth) {
			window_width = document.body.parentNode.clientWidth;
		} else {
			window_width = document.body.parentNode.scrollWidth;
		}
	}
	var popUpDiv = document.getElementById(popUpDivVar);
	window_width=window_width/2-150;//150 is half popup's width
	popUpDiv.style.left = window_width + 'px';
}
function popup(windowname) {
	blanket_size(windowname);
	//window_pos(windowname);
	toggle('blanket');
	toggle(windowname);		
}