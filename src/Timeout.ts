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
     * @returns {Timeout} current instance
     */
    public start(newTime?: number) {
        if (newTime != null) {
            validateTime(newTime);
            this._time = newTime;
        }
        this.stop();
        if (this._time !== Infinity) {
            this._timerId = setTimeout(() => {
                this._cb();
                this.stop();
            }, this._time);
        }
        return this;
    }

    /**
     * Stops the timer, so callback won't be fired
     *
     * @returns {Timeout} current instance
     */
    public stop() {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
        return this;
    }

    public get started() {
        return this._timerId != null;
    }
}

export { Timeout };
