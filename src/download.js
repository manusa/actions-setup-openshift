'use strict';

const core = require('@actions/core');
const axios = require('axios');
const tc = require('@actions/tool-cache');

const download = async inputs => {
  core.info(`Downloading OpenShift Cluster ${inputs.ocVersion}`);
  const tagInfoUrl = `https://api.github.com/repos/openshift/origin/releases/tags/${inputs.ocVersion}`;
  const tagInfo = await axios.axios({
    method: 'GET',
    url: tagInfoUrl,
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });
  const downloadUrl = tagInfo.data.assets.find(
    asset =>
      asset.name.indexOf('linux') >= 0 && asset.name.indexOf('client') >= 0
  ).browser_download_url;
  core.info(`OpenShift Cluster version found at: ${downloadUrl}`);
  return await tc.downloadTool(downloadUrl);
};

module.exports = download;
