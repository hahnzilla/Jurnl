function Timer()
{
    /*
        Object used to wrap functions related to timing into one package

        Interface:
            setDuration(duration)
                duration: integer (milliseconds)

                Sets the overall duration of timing. Timer automatically
                stops after duration has been met if duration is positive.
                Timer runs indefinitely if duration is -1. Gives error if
                duration is 0 or less than -1.

            setInterval(interval)
                interval: integer (milliseconds)

                Sets the interval to specify frequency of timer ticks

            execute()

                Starts the timer and runs for duration executing onTick 
                every interval. Use of start function preferred. Interval,
                duration, and onTick are required to be set prior to running
                this function.

            start(interval, duration, onTick)
                interval: integer (milliseconds)
                duration: integer (milliseconds)
                onTick: function reference

                Sets the interval, duration, and onTick function then
                starts the timer. Internally calls execute.


            pause()
                
                Halts the execution of timer tick

            reset()

                Resets elapsed time
            
            stop()

                Terminates the execution of the timer and resets the
                elapsed time.

            resume()

                Begins the execution of the timer. Only used after pause
                has been called.

            getElapsedPercent()
                RETURNS: decimal

                Gets the percent of duration elapsed. 

    */

    this.TimerStates = {
                         Running: "Running",
                         Stopped: "Stopped",
                         Paused:  "Paused",
                         NotStarted: "NotStarted"
                       };

    this.duration = 0;
    this.elapsed = 0;
    this.interval = 0;
    this.onTick = false;        //Event triggered every timer tick
    this.onStart = false;       //Event triggered when the timer is started 
    this.onStop = false;        //Event triggered when the timer is manually stopped
    this.onCompleted = false;   //Event triggered when the timer completes its duration
    this.indefinite = false;
    this.TimerState = this.TimerStates.NotStarted;
            
    this.setDuration = function(duration)
    {
        this.duration = duration;
    };
            
    this.setInterval = function(interval)
    {
        this.interval = interval;
    };

    this.start = function(interval, duration, onTick)
    {
        //Set defaults for parameters to one second
        this.interval = typeof interval === 'undefined' ? this.interval : interval;
        this.duration = typeof duration === 'undefined' ? this.interval : duration;
        this.onTick = typeof onTick === 'undefined' ? this.onTick : onTick;

        if(!this.onTick) {
            throw "onTick not defined";
        }
        else {
            if(this.TimerState !== this.TimerStates.Running)
                this.execute();
        }

    };
    
    this.execute = function() 
    {
        this.elapsed = 0;
        if((this.duration>0 || this.duration === -1) && this.interval>0)
        {
            var me = this;
            this.TimerState = this.TimerStates.Running;
            this.intElapse = window.setInterval(function(){ me.elapse(); }, this.interval);
            if(this.onStart) this.onStart();
        }
        else
            throw "interval or duration has invalid value";
    };
    
    this.pause = function()
    {
        this.TimerState = this.TimerStates.Paused;
        window.clearInterval(this.intElapse);
    };
    
    this.elapse = function()
    {
        if(this.duration!=-1) this.elapsed += this.interval;
        this.onTick();
        if((this.elapsed>=this.duration) && this.duration !== -1)
        {
            this.pause();
            this.elapsed = 0;
            if(this.onCompleted) this.onCompleted();
        }
    };
    
    this.reset = function()
    {
        this.elapsed = 0;
    };

    this.restart = function()
    {
        this.stop();
        this.start();
    };
        
    this.stop = function()
    {
        if(this.TimerState === this.TimerStates.Running) {
            this.pause();
            this.elapsed = 0;
            if(this.onStop) this.onStop();
        }
    };
    
    this.resume = function()
    {
        if(this.TimerState === this.TimerStates.Paused)
        {
            var me = this;
            this.intElapse = window.setInterval(function(){ me.elapse(); }, this.interval);
        }
    };
    
    this.getElapsedPercent = function()
    {
        return this.elapsed / this.duration;
    };
}
