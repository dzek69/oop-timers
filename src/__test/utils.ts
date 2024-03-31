const spy = function spy(fn?: (...args: unknown[]) => unknown) {
    const calls: unknown[] = [];
    const mySpy = function(...innerArgs: unknown[]) {
        // @ts-expect-error Whatever, TS :)
        // eslint-disable-next-line @typescript-eslint/no-invalid-this,@typescript-eslint/no-unsafe-assignment
        arguments.context = this;
        calls.push(arguments); // eslint-disable-line prefer-rest-params
        return fn?.(...innerArgs);
    };
    mySpy.__spy = {
        reset() {
            calls.length = 0;
        },
        get calls() {
            return calls;
        },
    };
    return mySpy;
};

const wait = (time: number) => new Promise(resolve => {
    setTimeout(resolve, time);
});

export {
    spy, wait,
};
