
function DistractionTimer(elementName, interval, DistractCallBack, FocusCallBack) {
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

    var InternalTimer = new Timer();
    var InternalDistractions = new distractions();

    this.Initialize = function(interval) {
        var me = this;
        InternalTimer.onTick = function () {
            me.Distract("timeout");
            InternalTimer.stop();
        };
        InternalTimer.start(interval);
    };
    
    this.Attach = function(elementName) {
        var me = this;
        var targetElement = document.getElementById(elementName);
        targetElement.onkeypress = function() { me.KeyPressHandler(); };
        targetElement.onblur = function() { me.BlurHandler(); };
    }

    this.KeyPressHandler = function() {
        this.Focus();
    };

    this.BlurHandler = function() {
        this.Distract("lostfocus");
    };

    this.GetTimer = function() {
        return InternalTimer;
    };

    this.GetDistractions = function() {
        return InternalDistractions;
    };

    this.Distract = function(type) {
        InternalTimer.stop();
        InternalDistractions.start(type);
        DistractCallBack();
    };

    this.Focus = function() {
        if(InternalDistractions.distracted) FocusCallBack();
        InternalDistractions.end();
        InternalTimer.restart();
    };

    this.Initialize(interval);
    
    if(typeof elementName !== "undefined") {
        this.Attach(elementName);
    }

    if(typeof DistractCallBack !== "function" || typeof FocusCallBack !== "function")
        throw "Callback functions for Distract and Focus must be specified";
}
