$(document).ready(function(){

  //to close alerts and notices
  $('.close').click(function() {
    $(this).closest('div').hide();
  });

  //fill in editor content with today's post
  //this isn't working
});

$(document).on("click", '#opener', function() {
  $.getJSON("/entries/current", function(result){
    console.log(result.content);
    tinyMCE.get("entry_content").setContent(result.content);
  });

  //You still need to add the id of the entry on the page if it exists
});
