//Stats Manager Object
function stats(elt) {
    //This function currently doesn't do anything.
    //this.elt = elt;
    //this.timer = new timer();
    //this.notTypingTime = new distractions();
   // window.setTimeout(this.timeout1, 1000, 3);
    //window.setInterval(timeout1, 1000, 3);
    console.log("here");
}

function WordCount(str) {
    if (!str) str = tinyMCE.activeEditor.getContent();
    var count = (str.length === 0) ? 0 : str.trim().split(/\s+/).length;
    return count;
}

function seconds(second) {
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