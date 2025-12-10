module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'jest-transform-stub'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
    '**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testEnvironment: 'jsdom',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/login/login.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['html', 'text-summary']
};
