module.exports = {
    setupFiles: [
      "<rootDir>/tests/dotenv-config.js"
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    roots: ['<rootDir>/tests'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.(js)'],
    collectCoverageFrom: ['src/**/*.{js}'],
  };
  