// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const MAX_TIMEOUT = (Math.pow(2, 32) / 2) - 1;

const validateTime = (time: number) => {
    if (time === Infinity) {
        return;
    }
    if (time < 0) {
        throw new TypeError("Time must be a positive number");
    }
    if (time > MAX_TIMEOUT) {
        throw new TypeError(`Time must not be greater than ${MAX_TIMEOUT}`);
    }
};

export { validateTime };
