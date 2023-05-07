import { validateTime } from "./validateTime.js";

/**
 * Replacement class for `setInterval`
 */
class Interval {
    private readonly _cb: OmitThisParameter<() => void>;

    private _time: number;

    private _timerId: ReturnType<typeof setInterval> | null;

    private _instantFirstRun: boolean;

    /**
     * @param {function} callback - function to be called when given time passes
     * @param {number} time - time in ms to fire the callback
     * @param {boolean} [start] - start the interval
     * @param {boolean} [instantFirstRun] - run the callback instantly
     */
    public constructor(callback: () => void, time: number, start: boolean = false, instantFirstRun: boolean = false) {
        validateTime(time);
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
     * @returns {Interval} current instance
     */
    public start(newTime?: number, instantFirstRun?: boolean) {
        if (newTime != null) {
            validateTime(newTime);
            this._time = newTime;
        }
        if (instantFirstRun != null) {
            this._instantFirstRun = instantFirstRun;
        }
        this.stop();
        if (this._time !== Infinity) {
            this._timerId = setInterval(this._cb, this._time);
        }
        if (this._instantFirstRun) {
            this._cb();
        }
        return this;
    }

    /**
     * Stops the interval, so callback won't be fired anymore
     *
     * @returns {Interval} current instance
     */
    public stop() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
        return this;
    }

    public get started() {
        return this._timerId != null;
    }
}

export { Interval };
