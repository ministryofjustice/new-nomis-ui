module.exports = {
  collectCoverageFrom: [
    'test/*.js',
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/*/RbGenerated*/*.{js,jsx}',
    '!app/app.js',
    '!app/routes.js',
    '!app/theme/global-styles.js',
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  moduleDirectories: ['node_modules', 'app'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
    '^header$': '<rootDir>/app/customers/hmpps/app/components/Header/index.js',
    '^product-globals$': '<rootDir>/app/customers/hmpps/app/product-globals.js',
  },
  setupFilesAfterEnv: ['<rootDir>/internals/testing/test-bundler.js'],
  roots: ['tests', 'app', 'server'],
}
