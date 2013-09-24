
function DistractionTimer() {
    
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

    this.LostFocusHandler = function() {
        InternalTimer.pause();
        InternalDistractions.start("lostfocus");
    }
}
