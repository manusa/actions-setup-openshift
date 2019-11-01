'use strict';

const checkOperatingSystem = () => {
  if (process.platform.toLowerCase().indexOf('win') === 0) {
    throw Error('Unsupported OS, action only works in *nix');
  }
};

const checkEnvironment = () => {
  checkOperatingSystem();
};

module.exports = checkEnvironment;
