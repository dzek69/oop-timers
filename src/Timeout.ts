import { validateTime } from "./validateTime.js";

type Nil = null | undefined;

/**
 * Replacement class for `setTimeout`
 */
class Timeout {
    private readonly _cb: OmitThisParameter<() => void>;

    private _time: number;

    private _started = 0;

    private _timerId: ReturnType<typeof setTimeout> | null;

    /**
     * @param callback - function to be called when given time passes
     * @param time - time in ms to fire the callback
     * @param start - start the timer
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
     * Starts or restarts the timer.
     *
     * @param newTime - override time to call the callback
     */
    public start(newTime?: number | Nil) {
        this._updateTime(newTime);

        this.stop();
        this._start();
    }

    private _start() {
        if (this._time !== Infinity) {
            this._timerId = setTimeout(() => {
                this._cb();
                this.stop();
            }, this._time);
            this._started = Date.now();
        }
    }

    private _updateTime(newTime: number | Nil) {
        if (newTime == null) {
            return;
        }
        validateTime(newTime);
        this._time = newTime;
    }

    /**
     * Changes the time to call the callback.
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
     * Starts the timer only if it's not already started.
     *
     * This function does not allow you to change the time while calling it to avoid any ambiguity about if the timer
     * should be restarted as usual when changing the time or not.
     *
     * @returns true if newly started, false if already started
     */
    public startOnly() {
        if (this._timerId !== null) {
            return false;
        }
        this._start();
        return true;
    }

    /**
     * Restarts the timer only if it's already started.
     * If newTime is given and the timer is stopped, it will be saved and used when the timer is started.
     *
     * @param newTime - override time to call the callback
     * @returns true if restarted, false if not started
     */
    public restartOnly(newTime?: number | Nil) {
        this._updateTime(newTime);

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

    /**
     * @returns true if the timer is started, false otherwise
     */
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

export { Timeout };
