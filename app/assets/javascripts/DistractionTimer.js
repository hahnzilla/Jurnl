
function DistractionTimer() {
    /*

        DistractionTimer
            Encapsulates both the Timer and distractions objects.

        Interface:
            StartDistractions: readies the distractions and Timer
                objects for tracking distractions.

            KeyPressHandler: A handler for the KeyPress event to
                be attached to the text editor.

            BlurHandler: A handler for the Blur event to
                be attached to the window.

            ReturnTimer: Returns the internal timer.

            ReturnDistractions: Returns the interal distractions.

    */


    var InternalTimer = new Timer();
    var InternalDistractions = new distractions();

    this.StartDistractions = function(interval) {
        InternalTimer.onTick = InternalDistractions.start("timeout");
        InternalTimer.start(interval);
    }

    this.KeyPressHandler = function() {
        InternalTimer.reset();
        InternalDistractions.end();
    }

    this.BlurHandler = function() {
        InternalTimer.pause();
        InternalDistractions.start("lostfocus");
    }

    this.GetTimer = function() {
        return IternalTimer;
    }

    this.GetDistractions = function() {
        return InternalDistractions;
    }
}
