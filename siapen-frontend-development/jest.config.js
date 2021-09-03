module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['<rootDir>/tests/setup.js'],
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter'
}
