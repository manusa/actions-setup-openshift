'use strict';

const core = require('@actions/core');
const child_process = require('child_process');

const configureDocker = () => {
  core.info('Updating Docker configuration to support OC insecure registry');
  const dockerServiceUnitFile = '/lib/systemd/system/docker.service';
  child_process.execSync(
    `sudo sed -i '/ExecStart=/c\\ExecStart=\\/usr\\/bin\\/dockerd -H fd:\\/\\/ --dns 8.8.8.8 --insecure-registry 172.30.0.0\\/16' ${dockerServiceUnitFile}`
  );
  child_process.execSync('sudo mount --make-shared /');
  child_process.execSync('sudo systemctl daemon-reload');
  child_process.execSync('sudo service docker restart');
};

module.exports = configureDocker;
