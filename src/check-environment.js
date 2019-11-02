'use strict';

const fs = require('fs');

const isLinux = () => process.platform.toLowerCase().indexOf('linux') === 0;
const isUbuntu = () => {
  const osRelease = '/etc/os-release'
  return fs.existsSync(osRelease)
    && fs.readFileSync(osRelease).indexOf('Ubuntu') > 0;
};

const checkOperatingSystem = () => {
  if (!isLinux() || !isUbuntu()) {
    throw Error('Unsupported OS, action only works in Ubuntu');
  }
};

const checkEnvironment = () => {
  checkOperatingSystem();
};

module.exports = checkEnvironment;
