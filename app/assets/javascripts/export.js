$(document).on("click", "#export", function (){
    if(window.location.pathname == "/"){
      var url = document.URL + "/entries";
    }
    else{
      var pathArray = document.URL.split("/");
      var rootURL = "/" + pathArray[2];
      var url = document.URL.replace(/\/[a-zA-Z\.]+.*(?:\?|$)/, rootURL + "/entries?");
    }
    
    $( "#dialog" ).dialog({
        autoOpen: true,
        buttons: {
            HTML: function() {
                var download_url = url.replace(/\/entries/,"\/entries.download_html");
                location.assign(download_url);
                $(this).dialog("close");
            },
            TEXT: function() {
                var download_url = url.replace(/\/entries/,"\/entries.download_text");
                location.assign(download_url);
                $(this).dialog("close");
            }
        },
        width: "210px"
    });
});

