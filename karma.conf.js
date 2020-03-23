// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
//
//
var testConfig = require('./testconfig');

module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      "src/**/*.ts"
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript"
    },
    frameworks: ["jasmine", "karma-typescript"],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-typescript')
    ],
    client: {
      clearContext: false
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/app'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    customLaunchers: testConfig.karma.customLaunchers,
    reporters: testConfig.karma.reporters,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: testConfig.karma.autoWatch,
    browsers: testConfig.karma.browsers,
    singleRun: testConfig.karma.singleRun,
    restartOnFileChange: true
  });
};

