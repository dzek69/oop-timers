const spy = () => {
    const calls = [];
    const mySpy = function() {
        arguments.context = this;
        calls.push(arguments);
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

module.exports = {
    spy, wait,
};