describe('configure-docker module test suite', () => {
  let configureDocker;
  let child_process;
  beforeEach(() => {
    jest.resetModules();
    jest.mock('child_process');
    configureDocker = require('../configure-docker');
    child_process = require('child_process');
  });
  test('configureDocker, should run all configuration commands', () => {
    // Given
    child_process.execSync.mockImplementation(() => {});
    // When
    configureDocker();
    // Then
    expect(child_process.execSync).toHaveBeenCalledTimes(11);
    expect(child_process.execSync).toHaveBeenCalledWith(
      "sudo sed -i '/ExecStart=/c\\ExecStart=\\/usr\\/bin\\/dockerd -H fd:\\/\\/ --insecure-registry 172.30.0.0\\/16' /lib/systemd/system/docker.service"
    );
    expect(child_process.execSync).toHaveBeenCalledWith(
      'sudo mount --make-shared /'
    );
    expect(child_process.execSync).toHaveBeenCalledWith(
      'sudo systemctl daemon-reload'
    );
    expect(child_process.execSync).toHaveBeenCalledWith(
      'sudo service docker restart'
    );
  });
});
