'use strict';

const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const fs = require('fs');
const {execSync, logExecSync} = require('./exec');

const getClusterDir = cwd => {
  const inCwd = `${cwd}/openshift.local.clusterup`;
  const inHome = '~/openshift.local.clusterup';
  const inTmp = '/tmp/openshift.local.clusterup';
  return [inCwd, inHome, inTmp].find(f => fs.existsSync(f));
};

const startCluster = () => logExecSync('oc cluster up --routing-suffix="127.0.0.1.${OC_DOMAIN:-nip.io}"');

const stopCluster = () => logExecSync('oc cluster down');

const replaceDnsIp = (clusterDir, dnsIp) => {
  core.info(`Replacing dnsIp field in ${clusterDir}`);
  const nodeConfigYaml =  `${clusterDir}/node/node-config.yaml`;
  const config = fs.readFileSync(nodeConfigYaml, 'utf8');
  const updatedConfig = config.replace("dnsIP: \"\"", `dnsIp: "${dnsIp}"`);
  fs.writeFileSync(nodeConfigYaml, updatedConfig);
  const kubeDnsResolvConf = `${clusterDir}/kubedns/resolv.conf`;
  const customResolv = `nameserver ${dnsIp}\n`;
  fs.writeFileSync(kubeDnsResolvConf, customResolv);
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
  const clusterDir = getClusterDir(cwd);
  if (inputs.dnsIp && clusterDir) {
    stopCluster();
    replaceDnsIp(clusterDir, inputs.dnsIp);
    startCluster();
  }
  execSync('oc login -u system:admin');
  const openshiftVersion = execSync(`oc version`)
    .toString()
    .replace(/[\n\r]/g, '');
  core.info(`${openshiftVersion} installed successfully`);
};

module.exports = install;
