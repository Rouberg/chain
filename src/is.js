import firstUpperCase from './firstUpperCase'

/**
 * 类型判断的工厂函数
 * @param type {string} 要生成的类型判断函数
 * @returns {Function} 生成的类型判断函数
 */
export default function it (type) {
  return function (target) {
    return Object.prototype.toString.call(target) === `[object ${firstUpperCase(type)}]`
  }
}
