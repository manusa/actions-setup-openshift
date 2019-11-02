'use strict';

const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const child_process = require('child_process');
const fs = require('fs');

const install = async openshiftTar => {
  core.info("Installing OpenShift Cluster");
  const extractedOpenshift = await tc.extractTar(openshiftTar);
  const openshiftDirectory = `${extractedOpenshift}/${fs.readdirSync(extractedOpenshift)[0]}`;
  child_process.execSync(`chmod +x ${openshiftDirectory}/oc`);
  core.exportVariable("OPENSHIFT_HOME", openshiftDirectory);
  core.addPath(openshiftDirectory);
  child_process.execSync(
    'oc cluster up --routing-suffix="127.0.0.1.${OC_DOMAIN:-nip.io}"',
    {stdio: 'inherit'}
  );
  child_process.execSync('oc login -u system:admin');
  const openshiftVersion = child_process.execSync(`oc version`)
  .toString()
  .replace(/[\n\r]/g, '');
  console.log(`${openshiftVersion} installed successfully`);
};

module.exports = install;
