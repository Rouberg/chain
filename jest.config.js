module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  modulePaths: ['<rootDir>'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/']
}
