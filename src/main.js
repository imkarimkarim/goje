const { app, BrowserWindow } = require('electron');
const path = require('path');
require('./db');
const productsDoc = require('./db/productsDoc');
const {generateNewCustomId} = require('./modules/idGenerator');

setTimeout(() => {
    // const newProduct = {
    //   customeId: null,
    //   productName: 'سیب قرمز',
    //   owner: 'کاک رسول آذربایجان',
    //   weight: 200,
    //   amount: 20,
    //   arrivalDate: new Date(),
    //   finishDate: false,
    //   ownerCardNumber: '2222-1243-1532-1821',
    //   isProductFinish: false,
    //   commission: 5,
    //   driverInfo: {
    //     name: 'کریم گورابی',
    //     plaque: '۱۲ت۱۹ایران۱۸',
    //     car: 'نیسان',
    //     phoneNumber: '09118561211',
    //   }
    // }
    const newProduct = {
      customeId: null,
      productName: 'سیب سفید',
      owner: 'کاک رسول آذربایجان',
      weight: 200,
      amount: 20,
      arrivalDate: new Date(),
      finishDate: false,
      ownerCardNumber: '2222-1243-1532-1821',
      isProductFinish: false,
      commission: 5,
      driverInfo: {
        name: 'کریم گورابی',
        plaque: '۱۲ت۱۹ایران۱۸',
        car: 'نیسان',
        phoneNumber: '09118561211',
      }
    }
    generateNewCustomId((id) => {
      newProduct.customeId = id;
      productsDoc.insert(newProduct, () => {
        console.log('okk im in db :)))');
      })
    })
}, 4000)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
