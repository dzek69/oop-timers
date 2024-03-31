import { validateTime } from "./validateTime.js";

type Nil = null | undefined;

/**
 * Replacement class for `setInterval`
 */
class Interval {
    private readonly _cb: OmitThisParameter<() => void>;

    private _time: number;

    private _timerId: ReturnType<typeof setInterval> | null;

    private _instantFirstRun: boolean;

    private _started: number = 0;

    /**
     * @param callback - function to be called when given time passes
     * @param time - time in ms to fire the callback
     * @param start - start the interval
     * @param instantFirstRun - run the callback instantly
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
     * @param newTime - override time to call the callback
     * @param instantFirstRun - run the callback instantly
     */
    public start(newTime?: number | Nil, instantFirstRun?: boolean | Nil) {
        this._updateTime(newTime);
        this._updateInstantFirstRun(instantFirstRun);

        this.stop();
        this._start();
    }

    private _start() {
        if (this._time !== Infinity) {
            this._timerId = setInterval(() => {
                this._started = Date.now();
                this._cb();
            }, this._time);
            this._started = Date.now();
        }
        if (this._instantFirstRun) {
            this._cb();
        }
    }

    private _updateTime(newTime: number | Nil) {
        if (newTime == null) {
            return;
        }
        validateTime(newTime);
        this._time = newTime;
    }

    private _updateInstantFirstRun(instantFirstRun: boolean | Nil) {
        if (instantFirstRun == null) {
            return;
        }
        this._instantFirstRun = instantFirstRun;
    }

    /**
     * Changes the interval time between the callback calls.
     * If the timer is started, it will be restarted (but not when the same time is given, in this case, the timer will continue).
     * If the timer is not started, new time will be used when it's started.
     *
     * @param newTime - time to call the callback
     */
    public changeTime(newTime: number) {
        if (this._time === newTime) {
            return;
        }
        this._updateTime(newTime);
        this.restartOnly(newTime);
    }

    /**
     * Starts the interval only if it's not already started.
     *
     * This function does not allow you to change the time while calling it to avoid any ambiguity about if the timer
     * should be restarted as usual when changing the time or not.
     * It accepts an optional parameter to run the callback instantly - it will be saved for next restart or immediately
     * if the interval is stopped.
     *
     * @param instantFirstRun - run the callback instantly
     * @returns true if newly started, false if already started
     */
    public startOnly(instantFirstRun?: boolean | Nil) {
        this._updateInstantFirstRun(instantFirstRun);

        if (this._timerId !== null) {
            return false;
        }
        this._start();
        return true;
    }

    /**
     * Restarts the interval only if it's already started
     *
     * @param newTime - override time to call the callback
     * @param instantFirstRun - run the callback instantly
     * @returns true if restarted, false if not started
     */
    public restartOnly(newTime?: number | Nil, instantFirstRun?: boolean | Nil) {
        this._updateTime(newTime);
        this._updateInstantFirstRun(instantFirstRun);

        if (this._timerId === null) {
            return false;
        }
        this.stop();
        this._start();
        return true;
    }

    /**
     * Stops the interval, so callback won't be fired anymore
     */
    public stop() {
        if (this._timerId !== null) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
    }

    public get started() {
        return this._timerId !== null;
    }

    /**
     * @returns time left in ms
     */
    public get timeLeft() {
        if (this._timerId === null) {
            return 0;
        }
        return this._started + this._time - Date.now();
    }
}

export { Interval };
