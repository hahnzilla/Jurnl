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

    this.updateLastSaveTime = function(update) {
        this.updatedAt = update;
    };

    this.updateDurationGoal = function (update) {
        this.durationGoal = update;
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
        inner += "<div>\nWord Count: " + this.wCount + "\n<br />\n"; 

        inner += this.goalMessage();
        inner += "\n</div>\n";

        //div for distractions
        inner += "<div>\nDistractions: " + Donuts.Utils.TotalDistractions() + "\n<br />\n" + //Updated to refactored JS
                         "Duration: " + Donuts.Utils.secondsToString(distractionTime, 2) + "\n<br />\n</div>";

        this.elt.innerHTML = inner;
        if($('#popUpDiv').data('goal-completed')) {
            Donuts.Timers["Distraction"].Stop();
        }
        else {
            if(this.checkGoalCompleted())
                $('#popUpDiv').data('goal-completed', true);
        }
            
    }
    
    this.checkGoalCompleted = function() {
        if(this.wordGoal !== null)
            if(this.wCount >= this.wordGoal)
                return true;
        if(this.durationGoal !== null)
            if(Donuts.Utils.GetDuration() >= this.durationGoal)
                return true;

        return false;
    }

    this.remainingWords = function() {
        return this.wordGoal - this.wCount;
    }

    this.remainingTime = function() {
        return this.durationGoal - Donuts.Utils.GetDuration();
    }

    this.goalMessage = function() {
        var response = "";
        if(!this.checkGoalCompleted()) {
            if(this.wordGoal !== null)
                response = "Remaining words: " + this.remainingWords();
            if(this.durationGoal !== null)
            {
                if(response !== "") response += "<br/>";
                response += "Remaining time: " + this.remainingTime();
            }
        }
        else 
            return "Goal Completed!";
        return response;
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
