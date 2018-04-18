// list的key 是 数据类型
// list的value是对应类型的测试数据的数组列表
// 这是一组精心设计的数据
const list = {
  'number': [
    {value: 0, name: '0'},
    {value: -0, name: '-0'},
    {value: 1, name: '1'},
    {value: NaN, name: 'NaN'},
    {value: Infinity, name: 'Infinity'}
  ],
  'null': [
    {value: null, name: 'null'}
  ],
  'undefined': [
    {value: undefined, name: 'void 0'}
  ],
  'string': [
    {value: '', name: `''`},
    {value: 'abc', name: `'abc'`},
    {value: '0', name: `'0'`},
    {value: 'null', name: `'null'`},
    {value: 'false', name: `'false'`},
    {value: 'undefined', name: `'undefined'`}
  ],
  'array': [
    {groupId: 1, value: [], name: '[]', equals: [1, 3, 4]},
    {groupId: 2, value: [1, 2, 3], name: '[1, 2, 3]'},
    /* eslint-disable no-array-constructor */
    {groupId: 3, value: new Array(), name: 'new Array()', equals: [1, 3, 4]},
    {groupId: 4, value: Array.prototype, name: 'Array.prototype', equals: [1, 3, 4]}
  ],
  'function': [
    {value: () => [], name: '() => []'},
    {value: function () {}, name: 'function(){}'},
    {value: console.log, name: 'console.log'},
    {value: alert, name: 'alert'}
  ],
  'boolean': [
    {value: true, name: 'true'},
    {value: false, name: 'false'}
  ],
  'symbol': [
    {value: Symbol(0), name: 'Symbol(0)'},
    {value: Symbol('a'), name: `Symbol('a')`}
  ],
  'date': [
    {value: new Date(), name: 'new Date()'}
  ],
  'object': [
    {groupId: 1, value: {}, name: '{}', equals: [1, 2, 3, 4, 5]},
    {groupId: 2, value: Object.create(null), name: 'Object.create(null)', equals: [1, 2, 3, 4, 5]},
    {groupId: 3, value: Object.create(Object.prototype), name: 'Object.create(Object.prototype)', equals: [1, 2, 3, 4, 5]},
    {groupId: 4, value: Object.create({}), name: 'Object.create({})', equals: [1, 2, 3, 4, 5]},
    {groupId: 5, value: { __proto__: Array.prototype }, name: '{ __proto__: Array.prototype }', equals: [1, 2, 3, 4, 5]}
  ],
  'regExp': [
    {value: /abc/, name: '/abc/'}
  ]
}

export const types = Object.freeze(Object.keys(list))

export const testData = Object.freeze(Object.keys(list).reduce((pub, type) => {
  list[type].forEach(item => {
    item.type = type
    pub.push(item)
  })
  return pub
}, []))
