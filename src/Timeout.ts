import { validateTime } from "./validateTime.js";

/**
 * Replacement class for `setTimeout`
 */
class Timeout {
    private readonly _cb: OmitThisParameter<() => void>;

    private _time: number;

    private _timerId: ReturnType<typeof setTimeout> | null;

    /**
     * @param {function} callback - function to be called when given time passes
     * @param {number} time - time in ms to fire the callback
     * @param {boolean} [start] - start the timer
     */
    public constructor(callback: () => void, time: number, start: boolean = false) {
        validateTime(time);
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
     */
    public start(newTime?: number) {
        if (newTime != null) {
            validateTime(newTime);
            this._time = newTime;
        }
        this.stop();
        this._start();
    }

    private _start() {
        if (this._time !== Infinity) {
            this._timerId = setTimeout(() => {
                this._cb();
                this.stop();
            }, this._time);
        }
    }

    /**
     * Starts the timer only if it's not already started
     * @returns {boolean} - true if newly started, false if already started
     */
    public startOnly() {
        if (this._timerId !== null) {
            return false;
        }
        this._start();
        return true;
    }

    /**
     * Restarts the timer only if it's already started
     * @returns {boolean} - true if restarted, false if not started
     */
    public restartOnly() {
        if (this._timerId === null) {
            return false;
        }
        this.stop();
        this._start();
        return true;
    }

    /**
     * Stops the timer, so callback won't be fired
     */
    public stop() {
        if (this._timerId !== null) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
    }

    public get started() {
        return this._timerId !== null;
    }
}

export { Timeout };
