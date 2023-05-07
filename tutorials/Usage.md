## When to use

OOP style timers are useful when you need to start, stop & restart the timer in multiple places. You don't have to
juggle ids, just saving instance of a timer is enough.

If you need to start a timer, and you never care about it anymore - use native `setTimeout`.

## Examples

> This library is written with TypeScript and nicely documented. IDE suggestions should be enough to understand it.
>
> So if you don't like reading here is a little tl;dr warning: `start()` method for backwards compatibility actually
> starts or restarts the timer if already running. `restartOnly()` method restarts the timer only if running.
> `startOnly()` won't restart the timer if already running. None of the methods will throw, call them anytime.

Few examples of what you can do with timers:

### Start a timer

```typescript
const timeout = new Timeout(() => console.log('Hello world!'), 1000);
button.addEventListener('click', () => timeout.startOnly());
```

### Stop a timer
```typescript
const timeout = new Timeout(() => console.log('Hello world!'), 1000);
timeout.start();
button.addEventListener('click', () => timeout.stop());
```

### Restart a timer

```typescript
const timeout = new Timeout(() => console.log('Hello world!'), 1000);
timeout.start();
button.addEventListener('click', () => timeout.restartOnly());
```

### Start or restart if already running

```typescript
const timeout = new Timeout(() => console.log('Hello world!'), 1000);
button.addEventListener('click', () => timeout.start());
```

### Change timeout value and (re)start

```typescript
const timeout = new Timeout(() => console.log('Hello world!'), 1000);
timeout.start();
button.addEventListener('click', () => timeout.start(2000));
```

## Important difference from setTimeout and setInterval

A `timer.start()` method has to be run in order to start the timeout/interval, as opposed to using native
`setTimeout`/`setInterval`. This however can be changed with 3rd constructor argument, which defines if timer should
start on constructing.

- `new Timeout(callback, 1000, true)`
- `new Interval(callback, 1000, true)`

## Interval first call

Native interval calls the callback after given interval. Often you want to call the callback immediately and instead of

```typescript
setInterval(() => console.log("hi"), 1000);
```

You have to write:

```typescript
const sayHi = () => console.log("hi");
setInterval(sayHi, 1000);
sayHi();
```

`oop-timers` has solution for that, a 4th parameter in constructor, which tells the timer to call the callback
immediately on (re)start.

```typescript
// mind the 3rd parameter too, see previous section
const interval = new Interval(() => console.log("hi"), 1000, false, true);

button.addEventListener('click', () => interval.start()); // will immediately print "hi" and then every 1000ms
```

## Check if timer is running

```typescript
const timeout = new Timeout(() => console.log('Hello world!'), 1000);
timeout.start();
console.log(timeout.started); // true
```

## Methods and arguments list

### Timeout

See {@link Timeout}

### Interval

See {@link Interval}
