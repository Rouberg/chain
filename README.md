# chain
A syntax sugar for promise, make function promise each other better.

##Install

```bash
npm install @rou/chain --save
```

##Useage

```javascript
import chain from '@rou/chain'
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


#### next description is optional.

`chain`是一个语法糖，使promise调用更舒服。

常规的教科书式promise调用太过冗长，不够健康。

+ 一个对象的函数，为了在调用时上下文this指针再指回对象，需要使用箭头函数不断地维护上下文。
+ 分散了不必要的精力在了promise的异常捕获和对rejected promise的处理上，但在一个项目中，它们一般是较为统一的，不必在每次写promise时重复。
一个promise，往往较为关心fulfilled时的流程。一次一次地写catch函数？我想这太无聊了。
如果把同步代码直接嵌入异步代码中，又容易把两段实现不同功能的函数耦合到一起。
+ 把几个异步函数并行调用，参数是promise数组，而不是一些函数，这和串行调用不够统一。

同时，直接使用promise的话，要么会显示太啰嗦，要么容易把依赖关系耦合进promise本身。
我希望promise代表着一段可能是异步的(当然，这也可以是同步的)操作，在这段操作之前和之后会发生什么，这个promise不用关心。
如果业务中不同的promise有依赖关系，那就再另作描述。
这就是`chain`设计的目的，让一个promise只关心自己的事，相互间的依赖关系用`chain`来描述。

假如有a，b，c三个函数，当函数a返回的promise状态变成了fulfilled时调用函数b，然后函数a返回的promise状态变成了fulfilled时调用函数c，
最后返回函数c的返回值，直接使用promise的写法是这样的

```javascript
const a = b = c = value => Promise.resolve (value + 1)
a(1).then(value => b(value)).then(value => c(value)).then(console.log) // => 4
```
但是我们也许可以使用另外一种风格来描述依赖关系：

```javascript
import chain from '@rou/chain'
const a = b = c = value => Promise.resolve(value + 1)
chain(a, b, c, console.log) // => 4
```
