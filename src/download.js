'use strict';

const tc = require('@actions/tool-cache');

const download = async inputs => {
  const version = inputs.minishiftVersion.replace(/[a-zA-Z]/g, '');
  const downloadUrl =
    `https://github.com/minishift/minishift/releases/download/${inputs.minishiftVersion}/minishift-${version}-linux-amd64.tgz`;
  return await tc.downloadTool(downloadUrl);
};

module.exports = download;
