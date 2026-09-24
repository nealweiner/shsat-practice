// SHSAT activity log endpoint. One-time setup:
//   1. Create a Google Sheet. Extensions -> Apps Script. Replace the editor contents with this file. Save.
//   2. Deploy -> New deployment -> type "Web app". Execute as: Me. Who has access: Anyone. Deploy.
//   3. Copy the web app URL into config.js (LOG_URL) in both apps.
// POST appends one row per event; GET returns every row as JSON for parent.html.
var COLS = ['ts', 'app', 'device', 'session', 'kind', 'form', 'block', 'n', 'tag', 'chosen', 'correct', 'ok', 'secs', 'score', 'title'];

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
