function export_entries() {
    var entriesContent = new Array();
    var entriesDate = new Array();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/entries",
        success: function(data){
            $.each(data,function(key,value){
                //alert(value.content);
                entriesContent.push(value.content);
                entriesDate.push(value.created_at);
            })
            for(i = 0; i < entriesContent.length; i++)
                download(entriesDate[i], entriesContent[i]+'');
        }
    });
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

window.URL = window.URL || window.webkitURL;

function download2(filename, text) {
    var aFileParts = [text];
    var a = document.createElement('a');
    var blob = new Blob(aFileParts,{'type':'text/html'});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
};



