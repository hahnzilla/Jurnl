$(document).ready(function(){

  //to close alerts and notices
  $('.close').click(function() {
    $(this).closest('div').hide();
  });
});

$(document).on("click", '#opener', function() {
  $.getJSON("/entries/current", function(result){
    if(result != null){
      $('#popUpDiv').data('entry-id', result.id);
      $('#popUpDiv').data('dist-count', result.distraction_count);
      $('#popUpDiv').data('dist-time', result.duration);
      tinyMCE.get("entry_content").setContent(result.content);
      AlertFocused();
    }
  });
});
