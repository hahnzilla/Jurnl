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
      $('#popUpDiv').attr('data-dist-count', result.distraction_count);
      $('#popUpDiv').attr('data-dist-time', result.duration);
      tinyMCE.get("entry_content").setContent(result.content);
      AlertFocused();
    }
  });
});
