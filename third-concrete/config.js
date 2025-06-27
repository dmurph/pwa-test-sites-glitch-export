export default class Config {
  static apps = [{
    appId: 'A',
    colour: 'red',
  }, {
    appId: 'B',
    colour: 'orange',
  }, {
    appId: 'C',
    colour: 'green',
  }, {
    appId: 'D',
    colour: 'blue',
  }, {
    appId: 'E',
    colour: 'purple',
  }, {
    appId: 'F',
    colour: 'magenta',
  }];
  
  static externalAppSets = [{
    name: 'System',
    canUninstall: false,
    oneShot: false,
  }, {
    name: 'Policy',
    canUninstall: false,
    oneShot: false,
  }, {
    name: 'WebAPK',
    canUninstall: true,
    oneShot: false,
  }, {
    name: 'Default',
    canUninstall: true,
    oneShot: true,
  }];
};