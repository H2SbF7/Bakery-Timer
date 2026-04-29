module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'], // Chỉnh đường dẫn
  roots: ['<rootDir>/assets/scripts'],
  testMatch: ['**/*.test.js'],
};