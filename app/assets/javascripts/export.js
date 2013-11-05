function export_entries(){
    var url = document.URL;
    var subURL = url.substring(url.indexOf("search"), url.length);
    
    $( "#dialog" ).dialog({
        autoOpen: true,
        buttons: {
            HTML: function() {
                location.href = "http://localhost:3000/entriesDownload_html?" + subURL;
                $(this).dialog("close");
            },
            TXT: function() {
                location.href = "http://localhost:3000/entriesDownload_txt?" + subURL;
                $(this).dialog("close");
            }
        },
        width: "200px"
    });
}