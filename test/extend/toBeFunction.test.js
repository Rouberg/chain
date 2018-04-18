import './toBeFunction'

describe('#jest extend toBeFunction', () => {
  test('arrow function should validate by "toBeFunction"', () => {
    const invoke = () => []
    expect(invoke).toBeFunction()
  })

  test('general function should validate by "toBeFunction"', () => {
    const invoke = function () {}
    expect(invoke).toBeFunction()
  })
})
