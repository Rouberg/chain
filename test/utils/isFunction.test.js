import isFunction from 'src/isFunction'
import {testData} from '../typeTestData'

describe('#utils/isFunction', () => {
  testData.forEach(item => {
    const expected = item.type === 'function'
    test(`isFunction(${item.name}) === ${expected}`, () => {
      expect(isFunction(item.value)).toBe(expected)
    })
  })
})
