# oop-timers

This library wraps JavaScript timers (timeout and interval) in a class to provide OOP way of using them.

- 🌟 Extra features - stop repeating yourself
- 🛠 First class TypeScript support - 100% type safe and intellisense friendly
- 📦 No dependencies - it's small and can be used anywhere
- 🌎 Universal - exposes both ESM modules and CommonJS
- 🛡️ Safe - fully tested and used in production

## Quick example

```typescript
import { Timeout } from 'oop-timers';

const timeout = new Timeout(() => console.log('Hello world!'), 1000);
timeout.start();

// Imagine UI with start and stop buttons and input for new timeout value :)

stopButton.addEventListener('click', () => timeout.stop());
startButton.addEventListener('click', () => timeout.start(Number(newTimeoutInput.value)));
```

## Docs

Documentation can be found here: [oop-timers documentation](https://ezez.dev/docs/oop-timers/latest).

## To do

- Support for requestAnimationFrame?

## License

MIT
