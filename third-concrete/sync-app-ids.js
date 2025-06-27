import App from '/app.js';
import AppInstallation from '/app-installation.js';
import Output from '/output.js';
import State from '/state.js';
import {inplaceRemove} from '/util.js';

export default class SyncAppIds {
  static installMissing(syncAppIds, appInstallations) {
    for (const appId of AppInstallation.missingAppIds(appInstallations, syncAppIds)) {
      appInstallations.push(AppInstallation.create({
        appId,
        fromUser: true,
      }));
    }

    for (let appInstallation of AppInstallation.partitionBySet(appInstallations, syncAppIds).inSet) {
      appInstallation.fromUser = true;
    }
  }

  static cleanUp(syncAppIds, appInstallations) {
    for (const appInstallation of AppInstallation.partitionBySet(appInstallations, syncAppIds).notInSet) {
      if (appInstallation.isPlaceholder) {
        inplaceRemove(appInstallations, appInstallation);
      }
    }
  }

  static render(syncAppIds) {
    return Output.element({
      children: [
        Output.element({text: 'Synced Apps'}),
        App.renderAll({
          isOn(appId) {
            return syncAppIds.includes(appId);
          },
          setup(element, appId, on) {
            element.addEventListener('click', event => {
              State.mutate(() => {
                if (on) {
                  inplaceRemove(syncAppIds, appId);
                } else {
                  syncAppIds.push(appId);
                }
              });
            });
          },
        }),
      ],
    });
  }
};
