//Stats Manager Object
refreshInterval = 1000;

function stats(elt, wordGoal, startTime) {
    this.elt = elt;
    this.wordGoal = wordGoal;
    this.wCount = 0;

    this.startTime = (startTime) ? startTime : Math.round(Date.now() / 1000);
    this.interval = new Timer();
    this.interval.duration = -1;
    this.interval.interval = refreshInterval;

    this.updateWordGoal = function (update) {
        this.wordGoal = update;
    }

    this.updateStartTime = function (time) {
        this.startTime = time;
    }

    var me = this;
    this.interval.onTick = function () {
        me.refresh();
    }
  
    this.refresh = function () {
        //Displays the message to the element div provided

        distractionTime = Donuts.Utils.TotalDuration(); //updated to refactored JS
        elapsedTime = this.elapsedTime();
        this.wCount = Donuts.Utils.wordCount();

        //had to do the var inner to fix a glitch
        var inner = "";

        //div for times n such	
        typingTime = elapsedTime - distractionTime;
        inner += "<div>\nElapsed Time: " + Donuts.Utils.secondsToString(this.elapsedTime(), 2) + "\n<br />\n" +
                              "Typing Time: " + Donuts.Utils.secondsToString(this.typingTime(), 2) + "\n<br />\n" +
                              "Words Per Minute: " + this.WPM() + "\n</div>\n";

        //div for word count:
        inner += "<div>\nWord Count: " + this.wCount + "\n<br />\n" +
                        "Word Count Goal: " + this.wordGoal + "\n<br />\n";

        inner += (this.wCount >= this.wordGoal) ? "Goal Completed!" : ("Remaining: " + (this.wordGoal - this.wCount));
        inner += "\n</div>\n";

        //div for distractions
        inner += "<div>\nDistractions: " + Donuts.Utils.TotalDistractions() + "\n<br />\n" + //Updated to refactored JS
                         "Duration: " + Donuts.Utils.secondsToString(distractionTime, 2) + "\n<br />\n</div>";

        this.elt.innerHTML = inner;
    }

    this.start = function() {
        this.interval.start();
        this.refresh();
    }

    this.stop = function() {
        this.interval.stop();
    }
	
	this.WPM = function() {
		return Math.round(60 * Donuts.Utils.wordCount() / typingTime);
	}
	
	this.elapsedTime = function() {
		return Math.round(Date.now() / 1000) - this.startTime;
	}
	
	this.typingTime = function() {
	    return this.elapsedTime() - Donuts.Utils.TotalDuration();
	}

	this.getWordCount = function () {
	    return this.wCount;
	}
}