module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFiles: ['./utils/jest-setup.js'],
  transform: {
    '^.+\\.[t|j]s$': 'ts-jest',
  },
};
