# chain
A syntax sugar for promise, make function promise each other better.

## Install

```bash
npm install chain-nemo --save
```

## Useage

Regular textbook-style promise calls are too verbose.

+ An object's method, in order to keep context, need to use arrow function to maintain context this.
+ Take unnecessary care when promise rejected again and again, 
but actually they are similar and do not have to be repeated each time.
Promise is often more concerned the scene of the promise have been resolved.
+ when calls several asynchronous functions in parallel, the arguments are promise arrays, not functions. 
This is not consistent with serial calls.

At the same time, use a promise directly, it will either show too much, or it will be easy to couple the dependencies into the promise itself.

I hope the promise represents a potentially asynchronous (and, of course, synchronous) operation. 
What happens before and after this operation, promise should not have to care.

promise describe business logic separately, and `chain` combine the dependencies, this is the purpose of the `chain` design.
so that a promise only cares about its own affairs, and the dependencies are described by `chain`.

```javascript
import chain from 'chain-nemo'
const asyncAdd5 = function (value) {
  return new Promise(resolve => {
    setTimeout(x => resolve(x + 5), 100, value)
  })
}
const syncMinus2 = function (value) {
  return value - 2
}

const asyncAdd3 = function (value) {
  return new Promise(resolve => {
    setTimeout(x => resolve(x + 3), 100, value)
  })
}

const asyncGet8 = function () {
  return new Promise(resolve => {
    setTimeout(() => resolve(8), 100)
  })
}

const multiply = function(arr) {
  return arr.reduce((a, b) => a * b)
}

// it is: asyncAdd5(10).then(syncMinus2).then(asyncAdd3).then(console.log).catch(/* do something*/)
chain(10, asyncAdd5, syncMinus2, asyncAdd3, console.log) // =>  16

// it is: asyncGet8().then(syncMinus2).then(asyncAdd3).then(console.log).catch(/* do something*/)
chain(asyncGet8, syncMinus2, asyncAdd3, console.log) // =>  9

// 8 * (6 + 5) * (8 -2)
chain([asyncGet8, [6, asyncAdd5], [asyncGet8, syncMinus2]], multiply, console.log) // => 528
const obj = {
  chain,
  count: 5,
  add (x) {
    return this.count + x
  },
  multiply (x) {
    return this.count * x
  },
  minus (x) {
    return this.count - x
  },
  divide (x) {
    return this.count - x
  },
  log (x) {
    return x
  }
}

// this is bad, it's boring: 
// obj.add(4)
// .then(value => obj.multiply(value))
// .then(value => obj.minus(value))
// .then(value => obj.divide(value))
// .then(value => obj.log(value)).catch(// do something)
chain(4, obj.add, obj.multiply, obj.minus, obj.divide, obj.log) // 45

```

## API

### chain(data?, fn, fn, fn, ...fn)

accept function of any number, but first one could replace with a data, 
if first one is a data, it would as the arguments of next data.

fn call will inherit context, so if fn is a method of an object, chain should fix context by as a member of object too.

fn could be either synchronous or asynchronous. prev fn's return value or resolved value will as next fn's arguments.

fn will be serial called. prev one finish, and the next one invoked only.

### chain([fn, fn, fn, ...fn])

accept an array of function, array could contain function of any number.

in this way, fn will be parallel called.

### chain([fn, fn, [fn, fn, ...fn]])

chain support combine serial call and parallel call.

in even level of array, it will serial call, in odd level of array, it will parallel call.

link this: `chain([fn1, fn2, [fn3, fn4], [fn5, fn6]], fn7)`, fn3, fn4 will serial called, fn5, fn6 will serial called to, 
and them parallel called with fn1, fn2, them both fulfilled, fn7 called follow.

### chain.rejected

type: function

a general function to handle reject reason when promise rejected. 

it has a default value of `console.error`, it should replace with a function such as your DIY `toast`, to toast reason in window.
