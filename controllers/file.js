/* eslint-env node */
const {dialog, BrowserWindow} = require('electron');
const fs = require('fs');
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const fileOptionsSetting = {
  filters: [{
    name: 'ANSI',
    extensions: ['ans', 'ansi'],
  }],
};

module.exports.saveData = async (data) => {
  const filePath = data.filePath ? data.filePath : dialog.showSaveDialog(fileOptionsSetting);
  const saveData = Buffer.alloc(data.fileData.length);
  for (let i = 0, l = data.fileData.length; i < l; i++) {
    saveData[i] = data.fileData[i];
  }
  try {
    await writeFileAsync(filePath, saveData);
    return filePath;
  } catch (e) {
    return null;
  }
};

module.exports.readFile = async () => {
  try {
    const win = BrowserWindow.getFocusedWindow();
    const {canceled, filePaths} = await dialog.showOpenDialog(win, fileOptionsSetting);
    if (canceled) return;
    const result = await readFileAsync(filePaths[0]);
    return {
      path: filePaths[0],
      data: result,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};
