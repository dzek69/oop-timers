/**
 * Replacement class for `setTimeout`
 */
class Timeout {
    /**
     * @param {function} callback - function to be called when given time passes
     * @param {number} time - time in ms to fire the callback
     * @param {boolean} start - start the timer
     */
    constructor(callback, time, start) {
        this._cb = callback.bind(null);
        this._time = time;
        this._timerId = null;
        if (start) {
            this.start();
        }
    }

    /**
     * Starts or restarts the timer
     *
     * @param {number} [newTime] - override time to call the callback
     * @returns {Timeout} - current instance
     */
    start(newTime) {
        if (newTime != null) {
            this._time = newTime;
        }
        this.stop();
        this._timerId = setTimeout(this._cb, this._time);
        return this;
    }

    /**
     * Stops the timer, so callback won't be fired
     *
     * @returns {Timeout} - current instance
     */
    stop() {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
        return this;
    }
}

module.exports = Timeout;
