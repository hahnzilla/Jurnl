$(document).on("click", "#export", function (){
    if(window.location.pathname == "/")
      var url = document.URL + "/entries"
    else
      var url = document.URL.replace(/\/[a-zA-Z\.]+.*(?:\?|$)/, "/entries?")
    
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

