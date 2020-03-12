const spy = () => {
    const calls = [];
    const mySpy = function() {
        arguments.context = this; // eslint-disable-line no-invalid-this
        calls.push(arguments); // eslint-disable-line prefer-rest-params
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

const wait = time => new Promise(resolve => setTimeout(resolve, time));

export {
    spy, wait,
};
