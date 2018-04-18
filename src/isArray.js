import is from './is'

/**
 * 判断一个数据是否是一个数组
 * 本来判断一个对象类型用typeof是最好的,不过对于Array类型是不适用的, 因为对一个数组使用typeof运算会返回object。
 * 当检测Array实例时, Array.isArray 优于 instanceof,因为Array.isArray能检测iframes.
 * var iframe = document.createElement('iframe');
 * document.body.appendChild(iframe);
 * xArray = window.frames[window.frames.length-1].Array;
 * var arr = new xArray(1,2,3); // [1,2,3]
 * Array.isArray(arr);  // true
 * Considered harmful, because doesn't work though iframes
 * arr instanceof Array; // false
 */
export default Array.isArray || is('array')
