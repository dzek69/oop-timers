import Interval from "./Interval";

import { spy, wait } from "../test/utils";

describe("Interval", () => {
    it("waits proper time before firing the callback", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300);
        interval.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);

        interval.stop();
    });

    it("calls the callback every specified interval", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100);
        interval.start();

        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);
        await wait(100);
        callback.__spy.calls.must.have.length(2);
        await wait(100);
        callback.__spy.calls.must.have.length(3);

        interval.stop();
    });

    it("doesn't start the interval by defualt", async () => {
        const callback = spy();
        new Interval(callback, 100);

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
    });

    it("allows to start the interval on constructing", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300, true);

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);

        interval.stop();
    });

    it("allows to start the interval on constructing with instantly firing first call", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100, true, true);

        callback.__spy.calls.must.have.length(1);
        await wait(50);
        callback.__spy.calls.must.have.length(1);
        await wait(50);
        callback.__spy.calls.must.have.length(2);
        await wait(100);
        callback.__spy.calls.must.have.length(3);

        interval.stop();
    });

    it("requires truthy start argument when wanting to instantly fire first call", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100, false, true);

        await wait(100);
        callback.__spy.calls.must.have.length(0);

        interval.stop();
    });

    it("remembers instant fire value when starting the interval", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100, false, true);

        await wait(100);
        callback.__spy.calls.must.have.length(0);
        interval.start();
        callback.__spy.calls.must.have.length(1);
        interval.stop();
        interval.start();
        callback.__spy.calls.must.have.length(2);
        await wait(100);
        callback.__spy.calls.must.have.length(3);

        interval.stop();
    });

    it("allows to restart the interval before callback fires", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300);
        interval.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        interval.start();

        await wait(200);
        callback.__spy.calls.must.have.length(0);
        await wait(200);
        callback.__spy.calls.must.have.length(1);

        interval.stop();
    });

    it("allows to restart the interval with instantly firing first call", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100);
        interval.start();

        callback.__spy.calls.must.have.length(0);
        interval.start(undefined, true);
        callback.__spy.calls.must.have.length(1);
        await wait(100);
        callback.__spy.calls.must.have.length(2);

        interval.stop();
    });

    it("remembers instant firing first call value when restarting", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100);
        interval.start();

        callback.__spy.calls.must.have.length(0);
        interval.start(undefined, true);
        callback.__spy.calls.must.have.length(1);
        interval.start();
        callback.__spy.calls.must.have.length(2);
        interval.start(undefined, false);
        callback.__spy.calls.must.have.length(2);
        interval.start();
        callback.__spy.calls.must.have.length(2);

        interval.stop();
    });

    it("restarts with instantly firing first call when set like that while constructing", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100, true, true);

        callback.__spy.calls.must.have.length(1);
        interval.start();
        callback.__spy.calls.must.have.length(2);

        interval.stop();
    });

    it("allows to change the time and restart the interval", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300);
        interval.start();

        await wait(300);
        callback.__spy.calls.must.have.length(1);
        interval.start(50);

        await wait(50);
        callback.__spy.calls.must.have.length(2);
        
        interval.stop();
    });

    it("remembers changed time on restart", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300);
        interval.start();
        interval.start(50);

        callback.__spy.calls.must.have.length(0);
        await wait(50);
        callback.__spy.calls.must.have.length(1);

        interval.stop();
        await wait(50);
        callback.__spy.calls.must.have.length(1);
        await wait(200);
        callback.__spy.calls.must.have.length(1);

        interval.start();
        callback.__spy.calls.must.have.length(1);
        await wait(50);
        callback.__spy.calls.must.have.length(2);

        interval.stop();
    });

    it("allows to stop the interval", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300);
        interval.start();
        interval.stop();

        await wait(600);
        callback.__spy.calls.must.have.length(0);
    });

    it("ignores multiple stop calls", async () => {
        const callback = spy();
        const interval = new Interval(callback, 300);
        (() => {
            interval.stop();
            interval.stop();
            interval.stop();
        }).must.not.throw();
    });

    it("calls the callback with null as context", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100);
        interval.start();

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        (callback.__spy.calls[0].context === null).must.be.true();

        interval.stop();
    });

    it("calls the callback without arguments", async () => {
        const callback = spy();
        const interval = new Interval(callback, 100);
        interval.start();

        await wait(100);
        callback.__spy.calls.must.have.length(1);
        callback.__spy.calls[0].must.have.length(0);

        interval.stop();
    });
});
