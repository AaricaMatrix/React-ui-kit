module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/storybook-static/'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/**/*.test.{ts,tsx}',
    '!src/components/**/*.stories.{ts,tsx}',
  ],
};
