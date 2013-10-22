$(document).ready(function(){

	//to close alerts and notices
	$('.close').click(function() {
		$(this).closest('div').hide();
	});

	//fill in editor content with today's post
	//this isn't working
	$('#opener').click(function() {
		// $.ajax({
		// 	type: "GET",
		// 	url: "/entries/",
		// })
  	tinyMCE.get("entry_content").setContent("appended");
	});
	
});