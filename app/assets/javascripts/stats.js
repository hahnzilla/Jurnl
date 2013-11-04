//Stats Manager Object(to be completed)
refreshInterval = 1000;

function stats(elt, wordGoal, startTime) {
    this.elt = elt;
    this.wordGoal = wordGoal;
    this.startTime = (startTime) ? startTime : Math.round(Date.now() / 1000);

    this.interval = new Timer();

    var me = this;
    this.interval.onTick = function () {
        me.refresh();
    }
    this.interval.duration = -1; 
    this.interval.start(refreshInterval);
    
    this.refresh = function () {
        //Displays the message to the element div provided

        //distractionTime = window.tinyTimer.GetDistractions().TotalDuration()
        distractionTime = Donuts.Utils.TotalDuration(); //updated to refactored JS


        //first div for distractions
        //had to do the var inner to fix a glitch
        //var inner = "<div>\nDistractions: " + window.tinyTimer.GetDistractions().numDistractions() + "\n<br />\n" +
        var inner = "<div>\nDistractions: " + Donuts.Utils.TotalDistractions() + "\n<br />\n" + //Updated to refactored JS
                         "Duration: " + secondsToString(distractionTime, 2) + "\n<br />\n</div>";

        //second div for word count:
        wCount = WordCount();
        inner += "<div>\nWord Count: " + wCount + "\n<br />\n" +
                        "Word Count Goal: " + this.wordGoal + "\n<br />\n";

        inner += (wCount >= this.wordGoal) ? "Goal Completed!" : ("Remaining: " + (this.wordGoal - wCount));
        inner += "\n</div>\n";

        //third div for times n such
        elapsedTime = Math.round(Date.now() / 1000) - this.startTime;
        typingTime = elapsedTime - distractionTime;
        inner += "<div>\nElapsed Time: " + secondsToString(elapsedTime, 2) + "\n<br />\n" +
                              "Typing Time: " + secondsToString(typingTime, 2) + "\n<br />\n" +
                              "Words Per Minute: " + Math.round(60 * wCount / typingTime) + "\n</div>\n";
        this.elt.innerHTML = inner;

        //this.elt.innerHTML = "Distractions: " + window.tinyTimer.GetDistractions().numDistractions() + "\n<br />\n" +
        //         "Duration: " + window.tinyTimer.GetDistractions().TotalDuration() + "\n<br />\n" +
        //         "Word Count: " + WordCount();
        this.interval.restart();
    }
    this.refresh(); //displays the div
}

// Helpful functions and objects
function WordCount(str) {
    // Counts words in the string.
    // If no string is give, gets it from tinyMCE.
    // Note: This seems to work better than the plugin, and is easier to get the
    //      data than from the plugin
    if (!str) str = tinyMCE.activeEditor.getContent();

    var words = str.split(/\s+/);
    var count = 0;

    for (i = 0; i < words.length; i++) {
        // the following tallies up all the non whitespace things
        if (!(
            // Add whitespace words as needed
            words[i] === "&nbsp;" ||
            words[i] === "<p>&nbsp;</p>" ||
            words[i] === ""
            )) count++;
    }
    return count;
}

function secondsToString(time, min){
    sec = new seconds(time, min);
    return sec.toString(time, min);
}


function seconds(second, min) {
    // Seconds object
    // toString():
    // Displays the seconds in hh:mm:ss format
    // doesn't show hh if 00, or mm if 00(unless hour > 00)
    // examples: 5 => 5, 15 => 15, 60 => 1:00, 65 => 1:05, etc
    // other methods return time components
    // if a second argument (min) is given, it defines how many blocks will be shown;
    // ie: if sec = 30 and min = 1, returns 30
    //     if sec = 30 and min = 2, returns 0:30
    this.sec = (second) ? second : 0;
    this.min = (min) ? min : 1;

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

    this.toString = function (second, min) {
        if (!second) second = this.sec;
        if (!min) min = 1;
        var hour = ((second >= 3600) || min >= 3) ? this.hours(second) + ":" : "";
        var minute = ((second >= 60) || min >= 2) ? this.minutes(second) + ":" : "";
        if (hour && minute.length === 1) minute = "0" + minute;
        var second = "" + this.seconds(second);
        if (minute && second.length === 1) second = "0" + second;
        return hour + minute + second;
    }
}