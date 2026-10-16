// Paste into the destination spreadsheet's Extensions > Apps Script editor.
// Set RSVP_TOKEN in Script Properties; use the same value in Netlify's
// GOOGLE_SHEETS_WEBHOOK_TOKEN. Never put that value in this source file.
function doPost(e) {
  var output = function(ok) { return ContentService.createTextOutput(JSON.stringify({ok: ok})).setMimeType(ContentService.MimeType.JSON); };
  var expected = PropertiesService.getScriptProperties().getProperty('RSVP_TOKEN');
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (_) { return output(false); }
  if (!expected || data.token !== expected || !data.id || data.confirmed !== true) return output(false);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var book = SpreadsheetApp.openById('1nstp7ljqOkJdbRHwqqJK7L-cj-vUjpNsuO6lbU1VLOU');
    var sheet = book.getSheetByName('Guests') || book.getSheetById(0) || book.insertSheet('Guests');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Response ID', 'Guest 1', 'Guest 2', 'Adults attending', 'Confirmed', 'Submitted at']);
    if (sheet.getLastRow() > 1 && sheet.getRange(2, 1, sheet.getLastRow()-1, 1).createTextFinder(String(data.id)).matchEntireCell(true).findNext()) return output(true);
    var safe = function(value) { var text = String(value || ''); return /^[\s]*[=+@-]/.test(text) ? "'" + text : text; };
    sheet.appendRow([safe(data.id), safe(data.guest1), safe(data.guest2), data.guest2 ? 2 : 1, 'Yes', safe(data.createdAt)]);
    return output(true);
  } finally { lock.releaseLock(); }
}
