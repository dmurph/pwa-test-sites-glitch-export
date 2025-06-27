export default class AppInstallation {
  static create({appId, fromUser=false, isPlaceholder=true}) {
    return {
      appId,
      fromUser,
      isPlaceholder,
    };
  }

  static* missingAppIds(appInstallations, appIds) {
    for (const appId of appIds) {
      if (!appInstallations.find(appInstallation => appInstallation.appId == appId)) {
        yield appId;
      }
    }
  }

  static partitionBySet(appInstallations, appIds) {
    let inSet = [];
    let notInSet = [];
    for (const appInstallation of appInstallations) {
      let found = false;
      for (const appId of appIds) {
        if (appInstallation.appId == appId) {
          inSet.push(appInstallation);
          found = true;
          break;
        }
      }
      if (!found) {
        notInSet.push(appInstallation);
      }
    }
    return {inSet, notInSet};
  }
};
