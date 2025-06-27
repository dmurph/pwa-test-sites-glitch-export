import App from '/app.js';
import AppInstallation from '/app-installation.js';
import ExternalAppSet from '/external-app-set.js';
import Output from '/output.js';
import State from '/state.js';
import SyncAppIds from '/sync-app-ids.js';
import {MOUSE_LEFT_BUTTON, MOUSE_RIGHT_BUTTON, inplaceRemove} from '/util.js';

export default class Device {
  static create(deviceNumber=0) {
    return {
      name: 'device' + deviceNumber,
      appIdsHistory: [],
      appInstallations: [],
      externalAppSets: ExternalAppSet.emptySets(),
    };
  }

  static updateApps(device, syncAppIds) {
    SyncAppIds.installMissing(syncAppIds, device.appInstallations);
    ExternalAppSet.installMissing(device.externalAppSets, device.appIdsHistory, device.appInstallations);

    device.appIdsHistory = Array.from(new Set([...device.appIdsHistory, ...device.appInstallations.map(appInstallation => appInstallation.appId)]));
    device.appIdsHistory.sort();

    SyncAppIds.cleanUp(syncAppIds, device.appInstallations);
    ExternalAppSet.cleanUp(device.externalAppSets, device.appInstallations);
  }

  static render(device, syncAppIds, devices) {
    return Output.element({
      style: {
        display: 'flex',
        flexDirection: 'column',
        paddingRight: '20px',
      },
      children: [
        Output.element({text: device.name}),
        Output.element({text: 'App history: ' + device.appIdsHistory.join(' ')}),
        Output.element({text: 'Apps on device:'}),
        App.renderAll({
          isOn(appId) {
            return device.appInstallations.some(appInstallation => appInstallation.appId == appId);
          },
          setup(element, appId, on) {
            const appInstallation = device.appInstallations.find(appInstallation => appInstallation.appId == appId);

            if (appInstallation && appInstallation.isPlaceholder) {
              element.style.backgroundColor = 'grey';
            }
            if (appInstallation && !appInstallation.fromUser) {
              ExternalAppSet.addAppStyle(element);
            }
            
            element.addEventListener('contextmenu', event => event.preventDefault());
            element.addEventListener('mousedown', event => {
              if (event.button == MOUSE_LEFT_BUTTON) {
                if (!appInstallation) {
                  State.mutate(() => {
                    device.appInstallations.push(AppInstallation.create({
                      appId,
                      fromUser: true,
                      isPlaceholder: false,
                    }));
                    syncAppIds.push(appId);
                  });
                  return;
                } else if (appInstallation.isPlaceholder) {
                  State.mutate(() => {
                    for (let appInstallation of device.appInstallations) {
                      if (appInstallation.appId == appId) {
                        appInstallation.fromUser = true;
                        appInstallation.isPlaceholder = false;
                      }
                    }
                  });
                  return;
                }
              }

              if ((event.button == MOUSE_RIGHT_BUTTON && appInstallation) || (event.button == MOUSE_LEFT_BUTTON && (appInstallation && !appInstallation.isPlaceholder))) {
                if (device.externalAppSets.some(externalAppSet => !externalAppSet.canUninstall && externalAppSet.appIds.some(id => id == appId))) {
                  return;
                }
                State.mutate(() => {
                  inplaceRemove(syncAppIds, appId);
                  for (let appInstallation of device.appInstallations) {
                    if (appInstallation.appId == appId) {
                      inplaceRemove(device.appInstallations, appInstallation);
                      return;
                    }
                  }
                });
              }
            });
          },
        }),
        Output.element({
          tag: 'button',
          text: 'update',
          setup(element) {
            element.addEventListener('click', event => {
              State.mutate(() => {
                Device.updateApps(device, syncAppIds);
              });
            });
          },
        }),
        Output.element({
          tag: 'button',
          text: 'remove device',
          setup(element) {
            element.addEventListener('click', event => {
              State.mutate(() => {
                inplaceRemove(devices, device);
              });
            });
          },
        }),
        Output.element({
          style: {
            marginTop: '10px',
          },
          text: 'External app sets:',
        }),
        ...device.externalAppSets.map(externalAppSet => ExternalAppSet.render(externalAppSet)),
      ],
    });
  }
};
