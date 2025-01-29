const SPREADSHEET_ID = '<id-spreadsheet>';
const CONFIG_SHEET = 'config';
const DATA_SHEET = 'ppdb';

let CONFIG = null;

function generateRegistrationId() {
  if (!CONFIG) loadConfig();
  const lastNumber = Number(CONFIG.ID.LAST_NUMBER || 0) + 1;
  const paddedNumber = String(lastNumber).padStart(Number(CONFIG.ID.DIGIT), '0');
  const regId = `${CONFIG.ID.PREFIX}${CONFIG.ID.YEAR}${paddedNumber}`;
  
  updateLastNumber(lastNumber);
  return regId;
}

function updateLastNumber(number) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CONFIG_SHEET);
  const data = sheet.getRange('A:B').getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 'ID.LAST_NUMBER') {
      sheet.getRange(i + 1, 2).setValue(number);
      break;
    }
  }
}

function loadConfig() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CONFIG_SHEET);
  const data = sheet.getRange('A:B').getValues();
  CONFIG = {};
  
  data.forEach(row => {
    if (row[0] && row[1]) {
      let keys = row[0].split('.');
      let current = CONFIG;
      
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          // Convert to number if possible, otherwise keep as string
          current[key] = isNaN(row[1]) ? row[1] : Number(row[1]);
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });
    }
  });
}

function getConfig() {
  if (!CONFIG) loadConfig();
  return CONFIG;
}

function formatFileName(prefix, regId, nama, timestamp) {
  const dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyyMMdd_HHmm");
  return `${prefix}_${regId}_${nama.replace(/\s+/g, '_')}_${dateStr}`;
}

function saveFile(fileData, fileName) {
  const folder = DriveApp.getFolderById(CONFIG.UPLOAD.FOLDER_ID);
  const blob = Utilities.newBlob(Utilities.base64Decode(fileData), 'image/png', fileName);
  const file = folder.createFile(blob);
  return file.getUrl();
}
