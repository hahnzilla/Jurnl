//Stats Manager Object
refreshInterval = 1000;
function dateFromString(inString) {
    var tokens = inString.split(/-|T|:/);
    return (Date.parse(inString) / 1000) + (tokens[6] * 3600); //the second part adds the timezone offset
}


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
    this.interval.interval = refreshInterval;
    //this.interval.start(refreshInterval);
    
    this.refresh = function () {
        //Displays the message to the element div provided

        if ($("#popUpDiv").data("created-at")) {
            //this is a workaround.
            //When data-created-at is set in Donuts.Application.OpenEditor, the DOM doesn't
            //imediatly update. This checks to see if the value has been set
            this.startTime = dateFromString($("#popUpDiv").data("created-at"));
        }
        var d = new Date(this.startTime);
        

        distractionTime = Donuts.Utils.TotalDuration(); //updated to refactored JS
        

        //first div for distractions
        //had to do the var inner to fix a glitch
        var inner = "<div>\nDistractions: " + Donuts.Utils.TotalDistractions() + "\n<br />\n" + //Updated to refactored JS
                         "Duration: " + Donuts.Utils.secondsToString(distractionTime, 2) + "\n<br />\n</div>";

        //second div for word count:
        wCount = WordCount();
        inner += "<div>\nWord Count: " + wCount + "\n<br />\n" +
                        "Word Count Goal: " + this.wordGoal + "\n<br />\n";

        inner += (wCount >= this.wordGoal) ? "Goal Completed!" : ("Remaining: " + (this.wordGoal - wCount));
        inner += "\n</div>\n";

        //third div for times n such
        elapsedTime = Math.round(Date.now() / 1000) - this.startTime;
        typingTime = elapsedTime - distractionTime;
        inner += "<div>\nElapsed Time: " + Donuts.Utils.secondsToString(elapsedTime, 2) + "\n<br />\n" +
                              "Typing Time: " + Donuts.Utils.secondsToString(typingTime, 2) + "\n<br />\n" +
                              "Words Per Minute: " + Math.round(60 * wCount / typingTime) + "\n</div>\n";
        this.elt.innerHTML = inner;

        //this.interval.restart();
    }

    this.start = function() {
        this.interval.start();
        this.refresh();
    }

    this.stop = function() {
        this.interval.stop();
    }

    //this.refresh(); //displays the div
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
