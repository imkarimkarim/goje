const {app} = require('electron');
const fs = require('fs');
const path = require('path');

function getAppDataPath() {
  let appDataPath = app.getPath('appData') + '/goje';
  if(!fs.existsSync(appDataPath)){
    fs.mkdirSync(appDataPath);
  }
  return appDataPath;
}

module.exports = {
  getAppDataPath
}
