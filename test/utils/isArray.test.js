import isArray from 'src/isArray'
import {testData} from '../typeTestData'

describe('#utils/isArray', () => {
  testData.forEach(item => {
    const expected = item.type === 'array'
    test(`isArray(${item.name}) === ${expected}`, () => {
      expect(isArray(item.value)).toBe(expected)
    })
  })
})
