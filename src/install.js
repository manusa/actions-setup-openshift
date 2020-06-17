'use strict';

const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const fs = require('fs');
const {execSync, logExecSync} = require('./exec');

const getNodeConfigYaml= cwd => {
  const inCwd = `${cwd}/openshift.local.clusterup/node/node-config.yaml`;
  const inHome = '~/openshift.local.clusterup/node/node-config.yaml';
  const inTmp = '/tmp/openshift.local.clusterup/node/node-config.yaml';
  return [inCwd, inHome, inTmp].find(f => fs.existsSync(f));
};

const startCluster = () => logExecSync('oc cluster up --routing-suffix="127.0.0.1.${OC_DOMAIN:-nip.io}"');

const stopCluster = () => logExecSync('oc cluster down');

const replaceDnsIp = (nodeConfigYaml, dnsIp) => {
  core.info(`Replacing dnsIp field in ${nodeConfigYaml}`);
  const config = fs.readFileSync(nodeConfigYaml, 'utf8');
  const updatedConfig = config.replace("dnsIP: \"\"", `dnsIp: "${dnsIp}"`);
  core.info(`Contents of config is:\n${updatedConfig}`);
  fs.writeFileSync(nodeConfigYaml, updatedConfig);
};

const install = async ({openshiftTar, inputs}) => {
  core.info('Installing OpenShift Cluster');
  const cwd = execSync(`pwd`).toString().replace(/[\n\r]/g, '');
  core.info(`Current working directory: ${cwd}`);
  const extractedOpenshift = await tc.extractTar(openshiftTar);
  const openshiftDirectory = `${extractedOpenshift}/${
    fs.readdirSync(extractedOpenshift)[0]
  }`;
  execSync(`chmod +x ${openshiftDirectory}/oc`);
  core.exportVariable('OPENSHIFT_HOME', openshiftDirectory);
  core.addPath(openshiftDirectory);
  startCluster();
  const nodeConfigYaml = getNodeConfigYaml(cwd)
  if (inputs.dnsIp && nodeConfigYaml) {
    stopCluster();
    replaceDnsIp(nodeConfigYaml, inputs.dnsIp);
    startCluster();
  }
  execSync('oc login -u system:admin');
  const openshiftVersion = execSync(`oc version`)
    .toString()
    .replace(/[\n\r]/g, '');
  core.info(`${openshiftVersion} installed successfully`);
};

module.exports = install;
