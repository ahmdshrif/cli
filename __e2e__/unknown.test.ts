import {runCLI, getTempDirectory, cleanup, writeFiles} from '../jest/helpers';

const DIR = getTempDirectory('test_unknown');

beforeEach(() => {
  cleanup(DIR);
  writeFiles(DIR, {});
});
afterEach(() => {
  cleanup(DIR);
});

test('warn for passing in unknown commands', () => {
  const {exitCode, stderr} = runCLI(DIR, ['unknown'], {expectedFailure: true});
  expect(exitCode).toBe(1);
  expect(stderr).toContain("error: unknown command 'unknown'");
});

test('suggest matching command', () => {
  const {exitCode, stderr} = runCLI(DIR, ['ini'], {expectedFailure: true});
  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    `error: unknown command 'ini'
(Did you mean init?)`,
  );
});

test('explain missing @react-native/community-cli-plugin commands', () => {
  writeFiles(DIR, {'package.json': '{}'});
  const {exitCode, stderr} = runCLI(DIR, ['start'], {expectedFailure: true});
  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    'The "start" command is provided by @react-native/community-cli-plugin, which is not installed in this project.',
  );
});

test('explain project commands run outside of a project', () => {
  const {exitCode, stderr} = runCLI(DIR, ['info'], {expectedFailure: true});
  expect(exitCode).toBe(1);
  expect(stderr).toContain(
    'The "info" command has to run inside a React Native project, and no package.json was found in',
  );
  expect(stderr).not.toContain("unknown command 'info'");
});

test('keep detached commands available outside of a project', () => {
  const {exitCode, stdout} = runCLI(DIR, ['doctor', '--help']);
  expect(exitCode).toBe(0);
  expect(stdout).toContain('Diagnose and fix common');
});
