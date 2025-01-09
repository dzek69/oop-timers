import { Timeout } from "./Timeout.js";
import { spy, wait } from "./__test/utils.js";

describe("Timeout", () => {
    it("waits proper time before firing the callback", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.started.must.be.false();
        timer.start();

        timer.started.must.be.true();
        await wait(200);
        callback.__spy.calls.must.have.length(0);
        timer.started.must.be.true();
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        timer.started.must.be.true();
        await wait(50);
        callback.__spy.calls.must.have.length(1);
        timer.started.must.be.false();
    });

    it("doesn't fire the callback by default", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 250);

        timer.started.must.be.false();
        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        timer.started.must.be.false();
    });

    it("allows to fire the callback on constructing", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300, true);

        timer.started.must.be.true();
        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);
        timer.started.must.be.false();
    });

    it("allows to restart the timer before callback fires", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        timer.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(200);
        callback.__spy.calls.must.have.length(1);
    });

    it("allows to restart the timer after callback fires", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.start();

        await wait(300);
        callback.__spy.calls.must.have.length(1);
        timer.start();

        await wait(200);
        callback.__spy.calls.must.have.length(1);
        await wait(100);
        callback.__spy.calls.must.have.length(2);
    });

    it("allows to change the time while restarting the timer", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.start();

        await wait(300);
        callback.__spy.calls.must.have.length(1);
        timer.start(50);

        await wait(50);
        callback.__spy.calls.must.have.length(2);
    });

    it("remembers changed time on restart", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.start();
        timer.start(50);

        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);

        timer.stop();
        await wait(50);
        callback.__spy.calls.must.have.length(1);
        await wait(200);
        callback.__spy.calls.must.have.length(1);

        timer.start();
        callback.__spy.calls.must.have.length(1);
        await wait(50);
        callback.__spy.calls.must.have.length(2);
    });

    it("allows to stop the timer", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        timer.started.must.be.true();
        timer.stop();
        timer.started.must.be.false();

        await wait(600);
        callback.__spy.calls.must.have.length(0);
        timer.started.must.be.false();
    });

    it("ignores multiple stop calls", () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        (() => {
            timer.stop();
            timer.stop();
            timer.stop();
        }).must.not.throw();
    });

    it("calls the callback with null as context", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 100);
        timer.start();

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        (callback.__spy.calls[0].context === null).must.be.true();
    });

    it("calls the callback without arguments", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 100);
        timer.start();

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        callback.__spy.calls[0].must.have.length(0);
    });

    describe("should crash when time is lower than zero", () => {
        const callback = spy();

        it("in constructor", () => {
            (() => new Timeout(callback, -1)).must.throw(TypeError, "Time must be a positive number");
            (() => new Timeout(callback, -600)).must.throw(TypeError, "Time must be a positive number");
            (() => new Timeout(callback, 0)).must.not.throw();
        });

        it("on start method", () => {
            const timeout = new Timeout(callback, 100);
            (() => {
                timeout.start(-1);
            }).must.throw(TypeError, "Time must be a positive number");
            (() => {
                timeout.start(-600);
            }).must.throw(TypeError, "Time must be a positive number");
            (() => {
                timeout.start(0);
            }).must.not.throw();
        });
    });

    describe("should crash when time is higher than max supported value for setTimeout", () => {
        const callback = spy();

        const MAX_VALUE = 2147483647;

        it("in constructor", () => {
            (() => new Timeout(callback, MAX_VALUE + 1)).must.throw(
                TypeError, "Time must not be greater than 2147483647",
            );
            (() => new Timeout(callback, MAX_VALUE)).must.not.throw();
        });

        it("on start method", () => {
            const timeout = new Timeout(callback, 100);
            (() => {
                timeout.start(MAX_VALUE + 1);
            }).must.throw(TypeError, "Time must not be greater than 2147483647");
            (() => {
                timeout.start(MAX_VALUE);
                timeout.stop();
            }).must.not.throw();
        });
    });

    it("should allow Infinity but should just do nothing", async () => {
        const callback = spy();
        const timeout = new Timeout(callback, Infinity, true);
        const timeout2 = new Timeout(callback, 100);
        timeout2.start(Infinity);

        await wait(200); // we can't wait forever so let's wait for a while at least to see if it was not started with 0
        callback.__spy.calls.must.have.length(0);

        timeout.stop();
        timeout2.stop();
    });

    it("allows to start the timer only if not started", async () => {
        {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            const r1 = timeout.startOnly();
            await wait(50);
            // will not restart
            const r2 = timeout.startOnly();
            await wait(50);
            // should start again
            const r3 = timeout.startOnly();
            await wait(50);
            const r4 = timeout.startOnly();
            await wait(200);
            callback.__spy.calls.length.must.be.gt(1);

            r1.must.be.true();
            r2.must.be.false();
            r3.must.be.true();
            r4.must.be.false();
        }

        {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            // it will keep restarting, so it will call the callback only once
            timeout.start();
            await wait(50);
            timeout.start();
            await wait(50);
            timeout.start();
            await wait(50);
            timeout.start();
            await wait(200);
            callback.__spy.calls.length.must.be.equal(1);
        }
    });

    it("allows to restart the timer only if alredy started", async () => {
        const callback = spy();
        const timeout = new Timeout(callback, 100);
        const r1 = timeout.restartOnly();
        r1.must.be.false();

        await wait(200);
        callback.__spy.calls.length.must.be.equal(0);

        timeout.start();
        const r2 = timeout.restartOnly();
        await wait(50);
        const r3 = timeout.restartOnly();
        await wait(50);
        const r4 = timeout.restartOnly();
        await wait(50);
        const r5 = timeout.restartOnly();
        await wait(50);
        const r6 = timeout.restartOnly();
        await wait(200);

        r2.must.be.true();
        r3.must.be.true();
        r4.must.be.true();
        r5.must.be.true();
        r6.must.be.true();

        callback.__spy.calls.length.must.equal(1);
    });

    it("allows to change the time while restarting-only the timer", async () => {
        const callback = spy();
        const timeout = new Timeout(callback, 100);
        timeout.start();

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        timeout.restartOnly(50);

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        timeout.start();

        await wait(50);
        callback.__spy.calls.must.have.length(2);
        timeout.restartOnly(50);
    });

    it("allows to change the time while restarting-only, remembering new time if timer is stopped", async () => {
        const callback = spy();
        const timeout = new Timeout(callback, 100);
        timeout.stop();

        await wait(100);
        callback.__spy.calls.must.have.length(0);
        timeout.restartOnly(50);

        await wait(100);
        callback.__spy.calls.must.have.length(0);
        timeout.start();

        await wait(50);
        callback.__spy.calls.must.have.length(1);
    });

    describe("has a function to change time", () => {
        it("that works when timer is started ", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.start();
            timeout.changeTime(150);

            await wait(100);
            callback.__spy.calls.must.have.length(0);

            await wait(50);
            callback.__spy.calls.must.have.length(1);
        });

        it("that restarts the timer to change time", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.start();

            timeout.changeTime(101);
            await wait(50);
            callback.__spy.calls.must.have.length(0);
            timeout.changeTime(100);
            await wait(50);
            callback.__spy.calls.must.have.length(0);
            timeout.changeTime(101);
            await wait(50);
            callback.__spy.calls.must.have.length(0);
            timeout.changeTime(100);
            await wait(50);
            callback.__spy.calls.must.have.length(0);

            await wait(100);
            callback.__spy.calls.must.have.length(1);
        });

        it("that works when timer is stopped", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.stop();
            timeout.changeTime(150);
            timeout.start();

            await wait(100);
            callback.__spy.calls.must.have.length(0);

            await wait(50);
            callback.__spy.calls.must.have.length(1);
        });

        it("does not start the time if stopped", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.stop();
            timeout.changeTime(150);

            timeout.started.must.be.false();
            await wait(200);
            callback.__spy.calls.must.have.length(0);
        });

        it("does not restart the timer if the same exact time is given", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.start();

            timeout.changeTime(100);
            await wait(50);
            callback.__spy.calls.must.have.length(0);

            timeout.changeTime(100);
            await wait(50);
            callback.__spy.calls.must.have.length(1);
        });
    });

    describe("has timeLeft property", () => {
        it("that returns time to next invocation", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.start();

            await wait(25);
            const time1 = timeout.timeLeft;
            timeout.timeLeft.must.be.between(0, 75);

            await wait(25);
            const time2 = timeout.timeLeft;
            timeout.timeLeft.must.be.between(0, 50);

            time2.must.be.lt(time1);

            await wait(50);
            timeout.timeLeft.must.equal(0);
            await wait(50);
            timeout.timeLeft.must.equal(0);
        });

        it("that returns zero if timer is not started", async () => {
            const callback = spy();
            const timeout = new Timeout(callback, 100);
            timeout.timeLeft.must.equal(0);
        });
    });
});
