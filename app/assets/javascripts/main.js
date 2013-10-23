$(document).ready(function(){

  //to close alerts and notices
  $('.close').click(function() {
    $(this).closest('div').hide();
  });
});

$(document).on("click", '#opener', function() {
  $.getJSON("/entries/current", function(result){
    if(result != null){
      $('#popUpDiv').attr('data-entry-id', result.id);
      tinyMCE.get("entry_content").setContent(result.content);
    }
  });
});
