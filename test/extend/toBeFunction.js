expect.extend({
  toBeFunction (received, argument) {
    const pass = typeof received === 'function'
    return {
      message: () => `expected ${received} ${pass ? '' : 'not '}to be function`,
      pass
    }
  }
})
