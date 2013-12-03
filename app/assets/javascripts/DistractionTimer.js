
function DistractionTimer(DistractCallBack, FocusCallBack) {
    /*

        DistractionTimer
            Encapsulates both the Timer and distractions objects.

        Interface:
            StartDistractions: readies the distractions and Timer
                objects for tracking distractions.

                INPUT:
                    elementName: name of the element you wish to target
                    interval: amount of idle time before distraction
                              starts
                    DistractCallBack: function to be called when a distraction
                              begins
                    FocusCallBack: function to be called when a distraction 
                              ends

            KeyPressHandler: A handler for the KeyPress event to
                be attached to the text editor.

            BlurHandler: A handler for the Blur event to
                be attached to the window.

            ReturnTimer: Returns the internal timer.

            ReturnDistractions: Returns the interal distractions.

    */

    this.InternalTimer = new Timer();
    this.InternalDistractions = new distractions();
    this.functionswap = undefined;

    this.Initialize = function(interval) {
        var me = this;
        this.interval = interval;
        this.InternalTimer.interval = interval;
        this.InternalTimer.duration = -1;
        this.InternalTimer.onTick = function() {
            me.Distract("timeout");
        };
        this.functionswap = this.InternalTimer.onTick;
    };
    
    this.Attach = function(elementName) {
        var me = this;
        var targetElement = document.getElementById(elementName);
        targetElement.onkeypress = function() { me.KeyPressHandler(); };
        targetElement.onblur = function() { me.BlurHandler(); };
    }

    this.SwapTimer = function() {
        this.Stop();
        if(this.IsDistracted()) {
            this.functionswap = this.InternalTimer.onTick;
            this.InternalTimer.onTick = DistractCallBack;
            this.InternalTimer.interval = 1000;
        }
        else {
            this.InternalTimer.onTick = this.functionswap;
            this.InternalTimer.interval = this.interval;
        }
        this.Start();
    }

    this.IsDistracted = function() {
        return this.InternalDistractions.isDistracted();
    };

    this.DistractionCount = function() {
        return this.InternalDistractions.numDistractions();
    };

    this.DistractionDuration = function() {
        return this.InternalDistractions.TotalDuration();
    };

    this.KeyPressHandler = function() {
        this.Focus();
    };

    this.BlurHandler = function() {
        this.Distract("lostfocus");
    };

    this.GetTimer = function() {
        return this.InternalTimer;
    };

    this.GetDistractions = function() {
        return this.InternalDistractions;
    };

    this.Restart = function() {
        this.InternalTimer.stop();
        this.InternalTimer.reset();
        this.InternalTimer.start();
    };

    this.Stop = function() {
        this.InternalTimer.stop();
    };

    this.Start = function() {
        if(this.IsDistracted()) {
            this.InternalTimer.interval = 1000;
            this.InternalTimer.start();
        }
        else { 
            this.InternalTimer.interval = this.interval;
            this.InternalTimer.start();
        }
    };

    this.Distract = function(type) {
        this.InternalDistractions.start(type);
        this.SwapTimer();
        DistractCallBack();
    };

    this.Focus = function() {
        if(this.InternalDistractions.distracted) {
            FocusCallBack();
        }
        this.InternalDistractions.end();
        this.SwapTimer();
        //this.InternalTimer.restart();
    };
    
    if(typeof DistractCallBack !== "function" || typeof FocusCallBack !== "function")
        throw "Callback functions for Distract and Focus must be specified";
}
