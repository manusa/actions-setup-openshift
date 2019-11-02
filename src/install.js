'use strict';

const tc = require('@actions/tool-cache');
const child_process = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

const install = async minishiftTar => {
  const extractedMinishift = await tc.extractTar(minishiftTar);
  const minishiftDirectory = `${extractedMinishift}/${fs.readdirSync(extractedMinishift)[0]}`;
  child_process.execSync(`chmod +x ${minishiftDirectory}/minishift`);
  core.exportVariable("MINISHIFT_HOME", minishiftDirectory);
  core.addPath(minishiftDirectory);
  const minishiftVersion = child_process.execSync(`minishift version`)
    .toString()
    .replace(/[\n\r]/g, '');
  console.log(`${minishiftVersion} installed successfully`);
};

module.exports = install;
