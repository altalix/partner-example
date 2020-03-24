"use strict";

module.exports = {
  karma: {
    browsers: ["ChromeHeadlessCustom"],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-web-security",
          "--headless",
          "--disable-gpu",
          "--disable-translate",
          "--disable-extensions",
        ],
      },
    },
    autoWatch: false,
    singleRun: true,
    reporters: ["progress", "coverage-istanbul", "karma-typescript"],
  },
};
