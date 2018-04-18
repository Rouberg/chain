import firstUpperCase from 'src/firstUpperCase'

describe('#utils/firstUpperCase', () => {
  test('upper case first letter of "test" should be "Test"', () => {
    expect(firstUpperCase('test')).toBe('Test')
  })

  test('upper case first letter of "Test" should be "Test"', () => {
    expect(firstUpperCase('Test')).toBe('Test')
  })

  test('upper case first letter of "TEST" should be "TEST"', () => {
    expect(firstUpperCase('TEST')).toBe('TEST')
  })

  test('upper case first letter of "123" should be "123"', () => {
    expect(firstUpperCase('123')).toBe('123')
  })
})
