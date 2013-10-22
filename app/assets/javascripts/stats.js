//Stats Manager Object(to be completed)
function stats(elt) {
    //This function currently doesn't do anything.
    //this.elt = elt;
    //this.timer = new timer();
    //this.notTypingTime = new distractions();
   // window.setTimeout(this.timeout1, 1000, 3);
    //window.setInterval(timeout1, 1000, 3);
    console.log("here");
}



// Helpful functions and objects
function WordCount(str) {
    // Counts words in the string.
    // If no string is give, gets it from tinyMCE.
    // Note: This seems to work better than the plugin, and is easier to get the
    //      data than from the plugin
    if (!str) str = tinyMCE.activeEditor.getContent();
    var count = (str.length === 0) ? 0 : str.trim().split(/\s+/).length;
    return count;
}

function seconds(second) {
    // Seconds object
    // toString():
    // Displays the seconds in hh:mm:ss format
    // doesn't show hh if 00, or mm if 00(unless hour > 00)
    // examples: 5 => 5, 15 => 15, 60 => 1:00, 65 => 1:05, etc
    // other methods return time components
    this.sec = (second) ? second : 0;

    this.hours = function (second) {
        if (!second) second = this.sec;
        return Math.floor(second / 3600);
    }

    this.minutes = function (second) {
        if (!second) second = this.sec;
        return Math.floor((second % 3600) / 60);
    }

    this.seconds = function (second) {
        if (!second) second = this.sec;
        return second % 60;
    }

    this.toString = function (second) {
        if (!second) second = this.sec;
        var hour = (second >= 3600) ? this.hours(second) + ":" : "";
        var minute = (second >= 60) ? this.minutes(second) + ":" : "";
        if (hour && minute.length === 1) minute = "0" + minute;
        var second = "" + this.seconds(second);
        if (minute && second.length === 1) second = "0" + second;
        return hour + minute + second;
    }
}