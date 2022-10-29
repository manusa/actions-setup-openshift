describe('install module test suite', () => {
  let exec;
  let core;
  let install;
  beforeEach(() => {
    jest.resetModules();
    jest.mock('../exec', () => ({
      execSync: jest.fn(arg => (arg === 'pwd' ? '/home/worker' : '')),
      logExecSync: jest.fn(() => '')
    }));
    jest.mock('@actions/io', () => ({}));
    jest.mock('@actions/tool-cache', () => ({
      extractTar: jest.fn(() => '/var/tmp')
    }));
    jest.mock('@actions/core');
    jest.mock('fs', () => ({
      existsSync: jest.fn(() => true),
      readdirSync: jest.fn(() => ['oc-dir']),
      readFileSync: jest.fn(() => ''),
      writeFileSync: jest.fn(),
      promises: {}
    }));
    jest.mock('axios');
    exec = require('../exec');
    core = require('@actions/core');
    install = require('../install');
  });
  describe('install', () => {
    let openshiftTar;
    beforeEach(() => {
      openshiftTar = 'openshift.tar';
    });
    test('no inputs, should launch standard cluster up command', async () => {
      // Given
      const inputs = {};
      // When
      await install({openshiftTar, inputs});
      // Then
      expect(exec.execSync).toHaveBeenCalledWith('pwd');
      expect(exec.execSync).toHaveBeenCalledWith('chmod +x /var/tmp/oc-dir/oc');
      expect(core.exportVariable).toHaveBeenCalledWith(
        'OPENSHIFT_HOME',
        '/var/tmp/oc-dir'
      );
      expect(core.addPath).toHaveBeenCalledWith('/var/tmp/oc-dir');
      expect(exec.logExecSync).toHaveBeenCalledWith(
        'oc cluster up --routing-suffix="127.0.0.1.${OC_DOMAIN:-nip.io}" '
      );
      expect(
        exec.logExecSync.mock.calls.filter(c =>
          c[0].startsWith('oc cluster up')
        ).length
      ).toBe(1);
    });
    test('withDnsIp, should launch standard cluster up command + stop + fix dns and relaunch', async () => {
      // Given
      const inputs = {
        dnsIp: '1.1.1.1'
      };
      // When
      await install({openshiftTar, inputs});
      // Then
      expect(exec.execSync).toHaveBeenCalledWith('pwd');
      expect(exec.execSync).toHaveBeenCalledWith('chmod +x /var/tmp/oc-dir/oc');
      expect(core.exportVariable).toHaveBeenCalledWith(
        'OPENSHIFT_HOME',
        '/var/tmp/oc-dir'
      );
      expect(core.addPath).toHaveBeenCalledWith('/var/tmp/oc-dir');
      expect(exec.logExecSync).toHaveBeenCalledWith(
        'oc cluster up --routing-suffix="127.0.0.1.${OC_DOMAIN:-nip.io}" '
      );
      expect(exec.logExecSync).toHaveBeenCalledWith('oc cluster down');
      expect(
        exec.logExecSync.mock.calls.filter(c =>
          c[0].startsWith('oc cluster up')
        ).length
      ).toBe(2);
    });
    test('enable, should launch standard cluster up command with extra arguments to enable components', async () => {
      // Given
      const inputs = {
        enable: 'component1,-component2,component-3'
      };
      // When
      await install({openshiftTar, inputs});
      // Then
      expect(exec.execSync).toHaveBeenCalledWith('pwd');
      expect(exec.execSync).toHaveBeenCalledWith('chmod +x /var/tmp/oc-dir/oc');
      expect(core.exportVariable).toHaveBeenCalledWith(
        'OPENSHIFT_HOME',
        '/var/tmp/oc-dir'
      );
      expect(core.addPath).toHaveBeenCalledWith('/var/tmp/oc-dir');
      expect(exec.logExecSync).toHaveBeenCalledWith(
        'oc cluster up --routing-suffix="127.0.0.1.${OC_DOMAIN:-nip.io}" --enable=component1 --enable=-component2 --enable=component-3'
      );
      expect(
        exec.logExecSync.mock.calls.filter(c =>
          c[0].startsWith('oc cluster up')
        ).length
      ).toBe(1);
    });
  });
});
