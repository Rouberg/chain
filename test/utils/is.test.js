import is from 'src/is'
import {types, testData} from '../typeTestData'
import 'test/extend/toBeFunction'

describe('#util/it', () => {
  types.forEach(type => {
    test(`is('${type}') should return a function`, () => {
      expect(is(type)).toBeFunction()
    })
    testData.forEach(item => {
      const expected = type === item.type
      test(`is('${type}')(${item.name}) === ${expected}`, () => {
        expect(is(type)(item.value)).toBe(expected)
      })
    })
  })
})
