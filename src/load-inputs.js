'use strict';

const core = require('@actions/core');

const loadInputs = () => {
  console.log('Loading input variables');
  const result = {};
  result.minishiftVersion = core.getInput('minishift version', {required: true});
  return result;
};

module.exports = loadInputs;
