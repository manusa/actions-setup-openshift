'use strict';

const core = require('@actions/core');
const child_process = require('child_process');

const configureDocker = () => {
  core.info('Updating Docker configuration to support OC insecure registry');
  const dockerServiceUnitFile = '/lib/systemd/system/docker.service';
  child_process.execSync(
    `sudo sed -i '/ExecStart=/c\\ExecStart=\\/usr\\/bin\\/dockerd -H fd:\\/\\/ --insecure-registry 172.30.0.0\\/16' ${dockerServiceUnitFile}`
  );
  child_process.execSync('sudo mount --make-shared /');
  child_process.execSync('sudo systemctl daemon-reload');
  child_process.execSync('sudo service docker restart');
  child_process.execSync('sudo apt-get install -y firewalld && sudo ufw disable');
  child_process.execSync('sudo firewall-cmd --permanent --new-zone dockerc');
  child_process.execSync('sudo firewall-cmd --permanent --zone dockerc --add-source $(docker network inspect -f "{{range .IPAM.Config }}{{ .Subnet }}{{end}}" bridge)');
  child_process.execSync('sudo firewall-cmd --permanent --zone dockerc --add-port 8443/tcp');
  child_process.execSync('sudo firewall-cmd --permanent --zone dockerc --add-port 53/udp');
  child_process.execSync('sudo firewall-cmd --permanent --zone dockerc --add-port 8053/udp');
  child_process.execSync('sudo firewall-cmd --reload');
};

module.exports = configureDocker;
