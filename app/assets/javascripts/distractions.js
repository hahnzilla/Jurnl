/*Code by Chase Coates
 *Created 9-19-13
 *Last Modifyed
 *  By: Chase Coates
 *  Date: 10-6-13
 */

function distractions() {
    /*Distractions manager object.
     *Terminology: If start() has been called but a corresponding end()
     *      has not been(i.e. distraction.endTime = 0), object is said
     *      to be in 'distraction mode'.
     *Keeps an array of all the distractions, their duration and type
     *Provides useful statistics about the distractions such as:
     *mean(type) - the average
     *longest(type)
     *shortest(type)
     *numberOfDistractions(type)
     * All of the previous functions take a type string and will only
     * return stats based on matching types. If type is left blank,
     * then the functions will return stats based on all of the distractions
     *
     *To use:
     *Call start() to start a distraction
     *Once start() is called, it must be ended by end()
     *
     *Other useful functions:
     *isDistracted() - Returns boolean if currently in distraction mode.
     *toString() - Returns a delimited string of the distractions data
     *fromString(string) - Takes a string given by toString and adds them to the distractions array
     *toString format: "1st_startTime,1st_endTime,1st_type;2nd_startTime,2nd_endTime,2nd_type"
     *clear() - resets the distractions object.
     *
     *Possible changes to make:
     * * Get rid of numOdistractions and just work of of 
     *      distractions.length
     * * Add ability to have multiple types for distraction nodes
     *      and/or take multiple types for the stats parameters
     */
    this.distractions = [];
    this.numOdistractions = 0;
    this.distracted = false;

    function distraction(type, datetime) {
        /*Distraction Node 
         *Takes a string that is the type of distraction.
         *Automatically saves the start time when created.
         *
         *Call end() to end the distraction.
         *duration() returns how long this distraction was.
         *  If currently in distraction mode, then return how long
         *  the distraction has been going on.
         *getType() returns the type of this distraction.
         *isType(type) returns boolean if the types match.
         *  Also returns true if type is undefined(reason below)
         */
        this.type = type;
        if (datetime) {
            this.startTime = datetime;
        } else {
            this.startTime = Date.now();
        }
        this.endTime = 0;

        this.duration = function () {
            if (this.endTime == 0) {
                return Date.now() - this.startTime;
            } else {
                return this.endTime - this.startTime;
            } 
        }

        this.end = function (datetime) {
            if (datetime) {
                this.endTime = datetime;
            } else {
                this.endTime = Date.now();
            }
        }

        this.getType = function () {
            return this.type;
        }

        this.isType = function (type) {
            /*Returns true if types match.
             *Returns false if types don't match.
             *Returns true if type argument is undefined or null.
             *  This saves a bunch of work around parent object since
             *  if type is not given, we want to find statistics for
             *  all the elements.
             */
            if (type) {
                return type == this.type;
            } else {
                return true;
            }
        }
    }

    this.clear = function () {
        this.distractions = [];
        this.numOdistractions = 0;
        this.distracted = false;
    }

	this.toString = function () {
	    var outs = "";
	    for (var i = 0; i < this.numOdistractions; i++) {
	        if (i > 0) {
	            outs = outs + ";";
	        }
	        thisElement = this.distractions[i];
	        outs = outs + thisElement.startTime + "," + thisElement.endTime + "," + thisElement.type;
	    }
	    return outs;
	}
	
	this.fromString = function (inString) {
	    var ds = inString.split(";");
	    for (var i = 0; i < ds.length; i++) {
	        var element = ds[i].split(",");
	        this.start(element[2], element[0]);
	        if (element[1] != 0) {
	            this.end(element[1]);
	        }
	    }
	}
	
    this.isDistracted = function () {
        /*Returns whether or not in distraction mode*/
        return this.distracted;
    }

    this.start = function (type, datetime) {
        /*Starts a distraction.
         *Adds to the distractions array a new distraction
         *Will blow up if already in distraction mode
         */
        	 
		 
        if (this.distracted) throw "Previous distraction not ended";

        this.distractions.push(new distraction(type, datetime));
        this.numOdistractions++;
        this.distracted = true;
    }

    this.end = function (datetime) {
        /* Ends the current distraction.
           If not distracted, then does nothing.
        */
        if (this.distracted) {
            this.distractions[this.numOdistractions - 1].end(datetime);
            this.distracted = false;
        }
    }

    this.numDistractions = function (type) {
        /* Returns the number of distractions */
        
        if (type) {
            var totalItems = 0;
            for (var i = 0; i < this.numOdistractions; i++) {
                thisElement = this.distractions[i];
                if (thisElement.isType(type)) {
                    totalItems++;
                }
            }
            return totalItems;
        } else {
            return this.numOdistractions;
        }
    }

    this.mean = function (type) {
        /*returns the mean of the distraction durations
         *iterates through the array, adding up the durations,
         *then divides by the total number of distractions
         */

        var totalValue = 0;
        var totalItems = 0;
            
        for (var i = 0; i < this.numOdistractions; i++) {
            thisElement = this.distractions[i];
            if (thisElement.isType(type)) {
                totalValue += thisElement.duration();
                totalItems++;
            }
        }
        if (totalItems == 0) {
            //Prevent div by 0
            return 0;
        } else {
            return totalValue / totalItems; 
        }
    }

    this.longest = function (type) {
        /*returns the longest duration
         *iterates through the array, keeping a record of the longest
         *distraction encountered
         */

        var total = 0;
        var thisElement = this.distractions[i];
        for (var i = 0; i < this.numOdistractions; i++) {
            thisElement = this.distractions[i];
            if (thisElement.isType(type)) {
                curDuration = thisElement.duration();
                if (curDuration > total) {
                    total = curDuration;
                }
            }
        }
        return total;
    }

    this.shortest = function (type) {
        /*Returns the shortest duration distraction
         *iterates through the array, keeping a record of the shortest
         *distraction encontered
         */

        var i = 0;
        var total = 0;

        for (i = 0; i < this.numOdistractions; i++) {
            //Find the first element satisfying type
            if (this.distractions[i].isType(type)) {
                total = this.distractions[i].duration();
                break;
            }
        }

        for (j = i; j < this.numOdistractions; j++) {
            //Compare total to the rest of the elements satisfying type
            thisElement = this.distractions[j];
            if (thisElement.isType(type)){
                curDuration = thisElement.duration();
                if (curDuration < total) {
                    total = curDuration;
                }
            }
        }

        return total;      
    }

    this.TotalDuration = function() {
        var total = 0;
        for (var i = 0; i < this.numOdistractions; i++) {
            total += this.distractions[i].duration();
        }
        return Math.round(total / 1000);
    }
}

// for testing
dist = new distractions();
