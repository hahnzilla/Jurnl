function export_entries(){
    var url = document.URL;
    var subURL = url.substring(url.indexOf("search"), url.length);
    //var input = prompt("Enter html or txt");
    //var div = document.getElementById('dia');
    //div.id = 'dialog';
    
    $( "#dialog" ).dialog({
        autoOpen: true,
        buttons: {
            HTML: function() {
                location.href = "http://localhost:3000/entries.js?" + subURL;
                $(this).dialog("close");
            },
            TXT: function() {
                location.href = "http://localhost:3000/entries.json?" + subURL;
                $(this).dialog("close");
            }
        },
        width: "200px"
    });
    
    //div.id = 'dia';
}