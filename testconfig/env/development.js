'use strict';

module.exports = {
  karma: {
    browsers: ['ChromeCustom'],
    customLaunchers: {
      'ChromeCustom' : {
        base: 'Chrome',
        flags: [
          '--disable-web-security'
        ]
      }
    },
    autoWatch: true,
    singleRun: false,
    reporters: ['progress', 'kjhtml', 'coverage-istanbul', 'karma-typescript'],
  }
};
