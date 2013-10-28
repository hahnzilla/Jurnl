$(document).ready(function(){

  //to close alerts and notices
  $('.close').click(function() {
    $(this).closest('div').hide();
  });
});

$(document).on("click", '#opener', function() {
  window.tinyTimer = new DistractionTimer(function() { AlertDistraction(); }, function() { AlertFocused(); });
  window.otherTimer = new Timer();
  tinyTimer.Initialize(5000);
  $.getJSON("/entries/current", function(result){
    if(result != null){
      $('#popUpDiv').data('entry-id', result.id);
      $('#popUpDiv').data('dist-count', result.distraction_count);
      $('#popUpDiv').data('dist-time', result.duration);
      tinyMCE.get("entry_content").setContent(result.content);
      AlertFocused();
      initAutoSave();
    }
  });
});

function AlertDistraction()
{
    dAlerts = document.getElementById("distractionAlerts");
    dAlerts.style.backgroundColor = "#cc0011";
    dAlerts.innerHTML = "DISTRACTED!!!\n<br/>\n";
    AlertBody();
    otherTimer.onTick = function() {
        dAlerts.innerHTML = "DISTRACTED!!!\n<br />\n";
        AlertBody();
    };
    otherTimer.start(1000, -1);
}

function AlertFocused()
{
    dAlerts = document.getElementById("distractionAlerts");
    dAlerts.style.backgroundColor = "#00cc11";
    dAlerts.innerHTML = "NOT DISTRACTED!!!\n<br/>\n";
    AlertBody();
    otherTimer.stop();
    otherTimer.reset();
    autoSaveTimer.stop();
    autoSaveTimer.reset();
}

function AlertBody()
{
    dAlerts = document.getElementById("distractionAlerts");
    var distCount = $("#popUpDiv").data("dist-count") + tinyTimer.GetDistractions().numDistractions();
    var distLength = $("#popUpDiv").data("dist-time") + tinyTimer.GetDistractions().TotalDuration();
    dAlerts.innerHTML += "Distractions: " + distCount + "\n<br />\n" +
                         "Duration(sec): " + distLength; 
}  
