/**
 * 将一个字符串的首字母大写
 * @param args {string} 入参字符串
 * @returns {string} 入参字符串首字母大写后的结果字符串
 */
export default function firstUpperCase (args) {
  const [first, ...rest] = args
  return first.toUpperCase() + rest.join('')
}
