import isFunction from './isFunction'
import isArray from './isArray'

const isFunctionIncluded = it => isArray(it) ? it.some(isFunctionIncluded) : isFunction(it)

// 判断一段调用链的首位置是否是一份数据，不是函数则视作数据
const hasHeadData = function (list) {
  return isArray(list) && list.length > 1 && !isFunctionIncluded(list[0])
}

// 为一个promise(或者一份数据) 与 一个函数建立调用关系
const invoke = function (promiseOrData, fn) {
  if (!isFunction(fn)) throw new Error(`${JSON.stringify(fn)}不是函数`)
  return promiseOrData instanceof Promise ? promiseOrData.then(fn, reason => Promise.reject(reason)) : Promise.resolve(fn(promiseOrData))
}

// 判断是否是并行的chain
// serial为true表示串行，parallel为true表示并行，chain里只能串行或者并行
// 如果一个数组不为空，里全是函数或者函数组成的数组，则是chain，另外，偶数级的数组的首位可以替换成数据
// serial为true表示串行，数组的首位是数据的话，数组长度必须大于1
// 并行一级必须全是函数；串行一级，如果有首数据，剩余需要是函数，长度需要大于1，如果没有首数据，则需要全是函数，长度需要大于或者等于1
const isChainArray = function (list, serial) {
  return isArray(list) && list.length > 0 && list.every(it => {
    return isArray(it) ? isChainArray(it, !serial) : (isFunction(it) || (hasHeadData(list) && serial))
  })
}

/**
 * 串行一组异步函数的执行，每个异步函数均返回一个promise对象，并接受上一个异步函数返回的promise对象的值
 * chain(fnA, fnB, fnC)表示的是
 * fnA().then(value => fnB(value).then(value => fnC(value))
 *
 * chain(data, fnA, fnB, fnC)表示的是
 * fnA(data).then(value => fnB(value)).then(value => fnC(value))
 *
 * chain([fnA, fnB], fnC)表示的是
 * Promise.all([fnA(), fnB()]).then(value => fnC(value))
 *
 * chain([[fnA, fnB], [fnC, fnD]], fnE)表示的是
 * Promise.all([fnA().then(value => fnB(value)), fnC().then(value => fnD(value))]).then(value => fnE(value))
 *
 * @param list<Function|*> 执行链 一组希望异步、串行执行的promise函数，它们的数量大于或者等于1个
 * @returns {Promise} 执行链的执行结果，返回的是一个promise
 * @private
 */
const chain = function (...list) {
  const resolve = value => Promise.resolve(value)
  /**
   * source为当前执行链的链头
   * 这里使用了归并函数Array.prototype.reduce来对执行链中的各异步函数进行串行化
   * 为了简化处理逻辑，在这里给执行链添加了一个链头
   * 因为当执行链中只有一个函数时，归并函数reduce无法执行归并操作(归并需要归并数量大于1)
   * 所以，添加一个链头会大大简化逻辑
   * 另外，为了再进一步简化api和优化当前api的调用体验，一个执行链的首位置可允许函数外的其它值
   * 当一个执行链中的首位置是一个数据是，该数据会作为执行链中的第二位置的调用参数传递给它
   * source是当前执行链调用前，处理得出的链头。
   * 如果执行链首位置是数据，则该数据会从执行链中移除，变成链头，这时链头是一个数据
   * 其它情况下，链头是一个补位的、立即fulfilled的promise
   */
  const source = hasHeadData(list) ? list.shift() : resolve()
  return list.reduce((promiseOrData, fn) => {
    // invoke(...)的返回值，会变成下一次list.reduce()的下一次执行的第一个参数 promiseOrData
    return invoke(promiseOrData, isChainArray(fn)
      ? value => Promise.all(
        fn.map(
          atom => isArray(atom)
            ? chain.apply(this, atom)
            : atom.call(this, value)
        )
      )
      : value => fn.call(this, value))
  }, source)
}

/**
 * 链式调用一串ajax请求(接受串行、并行或者进一步组合)，并在调用链结尾自动调用toast和捕获错误
 * 当前函数需要直接挂载到Vue对应的viewModel上(这一方面限制了调用条件，同时也是为了简化了调用时的API)
 * 当前函数接受任意个实参。
 * 除了第一个位置允许有数据外，其它位置均应是函数。
 * 第一个位置在这里包含任意偶数级嵌套数组中的第一项。
 * 函数如果是异步的，应该返回一个promise。函数如果是同步的，可以返回promise也可以正常return.
 * 第一个参数如果不是函数，则直接作为参数扔给链上的第二个promise函数
 * @param list {Function | *} 调用链列表
 * @returns {Promise} 返回一个promise，该promise由执行链中的最后一个调用函数返回
 */
function wrap (...list) {
  return chain.apply(this, list).then(value => Promise.resolve(value), isFunction(wrap.rejected) ? wrap.rejected : reason => Promise.reject(reason))
}

// e.g. toast, alert, console.warn (toast is a function to pop msg)
wrap.rejected = reason => console.error('[chain]:\n', reason)

// 期望每个chain内部自己可以捕获错误，把这过程也抽象掉
// 期望多个chain相互之间也可以串联 ？？
// chain中的step中的promise发生rejected时，同一chain后面的step不会再执行
// chain中的step中的promise发生rejected时，后面的另一chain不会再执行
export default wrap
