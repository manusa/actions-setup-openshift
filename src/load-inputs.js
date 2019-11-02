'use strict';

const core = require('@actions/core');

const loadInputs = () => {
  console.log('Loading input variables');
  const result = {};
  result.ocVersion = core.getInput('oc version', {required: true});
  return result;
};

module.exports = loadInputs;
