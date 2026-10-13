
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    var timestamp = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var name = data.name || '';
    var email = data.email || '';
    var phone = data.phone || '';
    var website = data.website || '';
    var budget = data.budget || '';
    var services = data.services || '';
    var message = data.message || '';

    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      website,
      budget,
      services,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Lead recorded successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'GrowthPilot Lead Webhook is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
