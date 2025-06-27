import App from '/app.js';
import AppInstallation from '/app-installation.js';
import Config from '/config.js';
import Output from '/output.js';
import State from '/state.js';
import {inplaceRemove} from '/util.js';

export default class ExternalAppSet {
  static emptySets() {
    return Config.externalAppSets.map(({name, canUninstall, oneShot}) => ({
      name,
      canUninstall,
      oneShot,
      appIds: [],
    }));
  }

  static installMissing(externalAppSets, appIdsHistory, appInstallations) {
    for (const externalAppSet of externalAppSets) {
      for (const appId of AppInstallation.missingAppIds(appInstallations, externalAppSet.appIds)) {
        if (externalAppSet.oneShot && appIdsHistory.some(id => id == appId)) {
          continue;
        }
        appInstallations.push(AppInstallation.create({
          appId,
          isPlaceholder: false,
        }));
      }
    }

    for (let appInstallation of AppInstallation.partitionBySet(appInstallations, ExternalAppSet.persistentAppIds(externalAppSets)).inSet) {
      appInstallation.isPlaceholder = false;
    }
  }

  static cleanUp(externalAppSets, appInstallations) {
    for (const appInstallation of AppInstallation.partitionBySet(appInstallations, externalAppSets.flatMap(externalAppSet => externalAppSet.appIds)).notInSet) {
      if (!appInstallation.fromUser) {
        inplaceRemove(appInstallations, appInstallation);
      }
    }
  }

  static persistentAppIds(externalAppSets) {
    let appIds = [];
    for (const externalAppSet of externalAppSets) {
      if (!externalAppSet.oneShot) {
        appIds.push(...externalAppSet.appIds);
      }
    }
    return appIds;
  }

  static render(externalAppSet) {
    return Output.element({
      style: {
        display: 'flex',
        flexDirection: 'column',
      },
      children: [
        Output.element({
          text: externalAppSet.name + ' apps',
          style: {
            marginTop: '10px',
          },
        }),
        App.renderAll({
          isOn(appId) {
            return externalAppSet.appIds.includes(appId);
          },
          setup(element, appId, on) {
            ExternalAppSet.addAppStyle(element);
            element.addEventListener('click', event => {
              State.mutate(() => {
                if (on) {
                  inplaceRemove(externalAppSet.appIds, appId);
                } else {
                  externalAppSet.appIds.push(appId);
                }
              });
            });
          },
        }),
      ],
    });
  }
  
  static addAppStyle(element) {
    element.style.textTransform = 'lowercase';
  }
};
