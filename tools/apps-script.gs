// SHSAT activity log endpoint, deployed as a standalone Apps Script web app (Execute as me,
// access: Anyone) that writes to the "SHSAT activity log" sheet by ID. The deployed URL is LOG_URL in config.js.
// POST appends one row per event; GET returns every row as JSON for parent.html.
var SHEET_ID = '172X4ApQUVm8ewjz8CzzI-_iLRdMyuItskyvPfCcmJW4';
var COLS = ['ts', 'app', 'device', 'session', 'kind', 'form', 'block', 'n', 'tag', 'chosen', 'correct', 'ok', 'secs', 'score', 'title'];

function sheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('log') || ss.insertSheet('log');
  if (sh.getLastRow() === 0) sh.appendRow(COLS);
  return sh;
}

function doPost(e) {
  var events = JSON.parse(e.postData.contents);
  if (!Array.isArray(events)) events = [events];
  var rows = events.map(function (ev) { return COLS.map(function (c) { return ev[c] == null ? '' : ev[c]; }); });
  var sh = sheet();
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, COLS.length).setValues(rows);
  return ContentService.createTextOutput('ok');
}

function doGet() {
  var sh = sheet(), n = sh.getLastRow();
  var rows = n > 1 ? sh.getRange(2, 1, n - 1, COLS.length).getValues() : [];
  var out = rows.map(function (r) { var o = {}; COLS.forEach(function (c, i) { o[c] = r[i]; }); return o; });
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
