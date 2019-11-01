'use strict';
const tc = require('@actions/tool-cache');
const child_process = require('child_process');
const fs = require('fs');

const install = async minishiftTar => {
  const extractedMinishift = await tc.extractTar(minishiftTar);
  const minishiftDirectory = fs.readdirSync(extractedMinishift)[0];
  fs.renameSync(`${extractedMinishift}/${minishiftDirectory}/minishift`, 'minishift');
  child_process.execSync(`chmod +x minishift`);
  const minishiftVersion = child_process.execSync(`./minishift version`)
    .toString()
    .replace(/[\n\r]/g, '');
  console.log(`${minishiftVersion} installed successfully`);
};

module.exports = install;
