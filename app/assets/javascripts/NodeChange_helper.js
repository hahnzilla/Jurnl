/*
	This page defines functions to be used by
	the TinyMCE Controls Manager on a node
	change. The purpose is to determine what
	is the current node as seen by the user
	from the 'current node' identified by the
	TinyMCE editor.
	
	Brys B. Sprint 5, formatting branch
*/

function inBlockquote(e, verdict){
/*
	Takes a DOM element from the TMCE text area
	Follows up parent nodes to the body tag
	Returns verdict true if <blockquote> found else false
*/
	if(e.tagName == "BLOCKQUOTE"){
		verdict = true;
	}
	
	if(e.tagName == 'BODY'){
		return verdict;
	}else{
		return inBlockquote(e.parentNode, verdict);
	}
}

function hasMono(e, verdict){
/*
	Takes a DOM element from the TMCE text area
	Follows child nodes until null
	Returns verdict true if <span style="Monospace"> found else false
	
	issue: any mixed mono/non-mono p's will always eval to true, even cursor on non-mono section
			this is due to the non mono being in the text node of the p
*/
	if(e.nodeType == 1){//node type one means html element
		if(e.style.fontFamily){
			if(e.style.fontFamily.toLowerCase() == 'monospace'){
				verdict = true;
				return verdict;
			}
		}/*
		if(e.childNodes){
			for(var i = 0; i < e.childNodes.length; i++){
				if(e.childNodes[i].nodeType == 1){
					verdict = verdict || hasMono(e.childNodes[i], verdict);
				}
			}
		}*/
	}
	
	return verdict;
}

function resolveNode(e){
/*
	Takes a DOM element from the TMCE text area
	Returns appropriate string from criteria:
	'Verbatim'  : e is in blockquote and has mono
	'Monospace' : e is not in blockquote and has mono
	'NoTarget'  : e is not in blockquote and has not mono
*/
	if(e.tagName.toLowerCase() == 'br' && e.parentNode.tagName.toLowerCase() != 'body'){
		//handles case when user inserts break inside a p that has the target formatting
		//this is not the 'current node' you're looking for
		e = e.parentNode;
	}

	if(hasMono(e, false)){
		if(inBlockquote(e, false)){
			return('Verbatim');
		}else{
			return('Monospace');
		}
	}else if (inBlockquote(e, false)) {
        return('Blockquote');
    }else{
		return('NoTarget');
	}
}

// checks the current node type to activate/deactivate monospace button
function NodeChangeHandler(ed, cm, e) {

    var resultnode = resolveNode(e);
    if(resultnode == 'Verbatim'){
        cm.setActive('Verbatim', true);
        cm.setActive('Monospace', false);
        cm.setActive('blockquote', false);
    }else if(resultnode == 'Monospace'){
        cm.setActive('Monospace', true);
        cm.setActive('Verbatim', false);
    }else if (resultnode == 'Blockquote') {
        cm.setActive('Verbatim', false);
        cm.setActive('Monospace', false);
        cm.setActive('blockquote', true);
    }else{
        cm.setActive('Monospace', false);
        cm.setActive('Verbatim', false);
    } 
}