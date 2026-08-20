import {projectConfig} from '../schema';

const resolve = (config: unknown) => {
  const {error, value} = projectConfig.validate(config);
  expect(error).toBeUndefined();
  return value.project;
};

describe('projectConfig defaults', () => {
  it.each([
    ['no config at all', undefined],
    ['an empty config', {}],
    ['a config without a `project` key', {dependencies: {}}],
    ['a config with an empty `project`', {project: {}}],
    ['a config with an empty `project.ios`', {project: {ios: {}}}],
  ])('defaults `automaticPodsInstallation` to true with %s', (_, config) => {
    expect(resolve(config).ios.automaticPodsInstallation).toBe(true);
  });

  it('applies nested `assets` defaults to both platforms', () => {
    const project = resolve(undefined);
    expect(project.ios.assets).toEqual([]);
    expect(project.android.assets).toEqual([]);
  });

  it('does not override an explicit `automaticPodsInstallation: false`', () => {
    const project = resolve({
      project: {ios: {automaticPodsInstallation: false}},
    });
    expect(project.ios.automaticPodsInstallation).toBe(false);
  });
});
