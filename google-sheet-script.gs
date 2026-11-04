// Paste this into script.google.com (Extensions > Apps Script from inside your Google Sheet).
// Row 1 of your sheet should be: Time | Role | Name | Email | College | Availability
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var p = e.parameter;
  sheet.appendRow([new Date(), p.role || "", p.name || "", p.email || "", p.college || "", p.availability || ""]);
  return ContentService.createTextOutput("ok");
}
