function export_entries(){
    var url = document.URL;
    var subURL = url.substring(url.indexOf("search"), url.length);
    location.href = "http://localhost:3000/entries.json?" + subURL;
}