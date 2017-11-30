module.exports = {
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  testRegex: "(/__tests__/.*|\\.(test))\\.(ts|js)$",
  globals: {
    'ts-jest': {
      skipBabel: true
    }
  },
  mapCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: [
    '<rootDir>/__tests__'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ]
};
