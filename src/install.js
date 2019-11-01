'use strict';

const tc = require('@actions/tool-cache');
const child_process = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

const install = async minishiftTar => {
  const extractedMinishift = await tc.extractTar(minishiftTar);
  const minishiftDirectory = fs.readdirSync(extractedMinishift)[0];
  child_process.execSync(`chmod +x ${extractedMinishift}/${minishiftDirectory}/minishift`);
  core.addPath(`${extractedMinishift}/${minishiftDirectory}`);
  const minishiftVersion = child_process.execSync(`minishift version`)
    .toString()
    .replace(/[\n\r]/g, '');
  console.log(`${minishiftVersion} installed successfully`);
};

module.exports = install;
