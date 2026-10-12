/**
 * =========================================================================
 * GrowthPilot — Google Sheets & Excel Lead Integration Script
 * =========================================================================
 * 
 * SETUP INSTRUCTIONS (Takes less than 2 minutes):
 * 1. Open Google Sheets (https://sheets.new) and create a new sheet.
 * 2. Name your spreadsheet: "GrowthPilot Website Leads"
 * 3. In Row 1, add these exact column headers:
 *    A1: Timestamp
 *    B1: Name
 *    C1: Email
 *    D1: Phone
 *    E1: Website
 *    F1: Budget
 *    G1: Services
 *    H1: Message
 * 
 * 4. In Google Sheets menu, click: Extensions > Apps Script
 * 5. Delete any existing code in the editor, paste this entire file, and click Save (Floppy icon).
 * 6. Click "Deploy" (top right) > "New deployment"
 * 7. Click the gear icon next to "Select type" and choose "Web app"
 * 8. Set the following options:
 *    - Description: "GrowthPilot Form Webhook"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (IMPORTANT: This allows your website to submit data)
 * 9. Click "Deploy". Grant permissions if prompted (Click Advanced > Go to Untitled project).
 * 10. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/.../exec).
 * 11. Open your project's app.js file and paste this URL into `GOOGLE_SHEET_WEBHOOK_URL`.
 * 
 * That's it! Every submission on the contact page will instantly insert
 * a new row in your Google Sheet, which you can also download anytime as
 * an Excel file (.xlsx) via: File > Download > Microsoft Excel (.xlsx).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse incoming JSON or form parameters
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

    // Append new lead as a row in sheet
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
