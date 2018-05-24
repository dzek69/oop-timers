/**
 * Replacement class for `setInterval`
 */
class Interval {
    /**
     * @param {function} callback - function to be called when given time passes
     * @param {number} time - time in ms to fire the callback
     * @param {boolean} [start] - start the interval
     * @param {boolean} [instantFirstRun] - run the callback instantly
     */
    constructor(callback, time, start, instantFirstRun) {
        this._cb = callback.bind(null);
        this._time = time;
        this._timerId = null;
        this._instantFirstRun = instantFirstRun;
        if (start) {
            this.start();
        }
    }

    /**
     * Starts or restarts the interval run
     *
     * @param {number} [newTime] - override time to call the callback
     * @param {boolean} [instantFirstRun] - run the callback instantly
     * @returns {Interval} - current instance
     */
    start(newTime, instantFirstRun) {
        if (newTime != null) {
            this._time = newTime;
        }
        if (instantFirstRun != null) {
            this._instantFirstRun = instantFirstRun;
        }
        this.stop();
        this._timerId = setInterval(this._cb, this._time);
        if (this._instantFirstRun) {
            this._cb();
        }
        return this;
    }

    /**
     * Stops the interval, so callback won't be fired anymore
     *
     * @returns {Interval} - current instance
     */
    stop() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
        return this;
    }
}

module.exports = Interval;
