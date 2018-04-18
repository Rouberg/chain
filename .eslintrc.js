module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  plugins: ['jest'],
  rules: {
    modules: true,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  env: {
    es6: true,
    'jest/globals': true
  }
}
