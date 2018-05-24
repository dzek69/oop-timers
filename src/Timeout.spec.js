import Timeout from "./Timeout";

import { spy, wait } from "../test/utils";

describe("Timeout", () => {
    it("waits proper time before firing the callback", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 300);
        timer.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);
    });

    it("doesn't fire the callback by defualt", async () => {
        const callback = spy();
        new Timeout(callback, 250);

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
    });

    it("allows to fire the callback on constructing", async () => {
        const callback = spy();
        new Timeout(callback, 300, true);

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);
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

        await wait(300);
        callback.__spy.calls.must.have.length(1);
        timer.stop();

        await wait(600);
        callback.__spy.calls.must.have.length(1);
    });

    it("ignores multiple stop calls", async () => {
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
        (callback.__spy.calls[0].context === null).must.be.true()
    });

    it("calls the callback without arguments", async () => {
        const callback = spy();
        const timer = new Timeout(callback, 100);
        timer.start();

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        callback.__spy.calls[0].must.have.length(0);
    });
});
