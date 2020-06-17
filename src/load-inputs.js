'use strict';

const core = require('@actions/core');

const loadInputs = () => {
  console.log('Loading input variables');
  const result = {};
  result.ocVersion = core.getInput('oc version', {required: true});
  result.githubToken = core.getInput('github token');
  result.dnsIp = core.getInput('dns ip');
  return result;
};

module.exports = loadInputs;
