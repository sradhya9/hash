/**
 * Google_Apps_Script.js
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Set Row 1 exactly to: Name | Phone | QR1 | QR2 | QR3 | QR4 | QR5 | QR6 | QR7 | QR8 | QR9 | QR10 | QR11 | QR12 | QR13 | QR14 | QR15 | QR16
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this entire code into Code.gs, overwriting anything there.
 * 5. Click "Deploy" > "New Deployment".
 * 6. Type: "Web App", Execute as: "Me", Who has access: "Anyone".
 * 7. Copy the "Web App URL" and paste it into `src/services/api.js` in your React app!
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Handle both POST data and GET parameters
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    const { action, name, phone, fragmentId } = data;
    
    if (!phone) return buildSuccess({ error: "Phone required" });

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][1]) === String(phone)) {
        rowIndex = i;
        break;
      }
    }

    let isNewUser = false;
    if (rowIndex === -1) {
      if (action === 'register') {
         const newRow = [name || "Unknown", phone];
         for(let k=0; k<16; k++) newRow.push(false);
         sheet.appendRow(newRow);
         rowIndex = sheet.getLastRow() - 1; // 0-indexed index of the last row
         isNewUser = true;
      } else {
         return buildSuccess({ error: "User not found." });
      }
    }

    if (action === 'scan' && fragmentId) {
       const colIndex = headers.indexOf(`QR${fragmentId}`);
       if (colIndex !== -1) {
          // Range is 1-indexed. rowIndex is 0-indexed.
          // +1 to convert to 1-indexed.
          sheet.getRange(rowIndex + 1, colIndex + 1).setValue(true);
       }
    }

    // Refresh data to get current progress
    const finalValues = sheet.getDataRange().getValues();
    const userRow = finalValues[rowIndex];
    const progress = [];
    
    // Scan columns labeled QR1...QR16
    for(let i=1; i<=16; i++) {
       const cIdx = headers.indexOf(`QR${i}`);
       if(cIdx !== -1 && userRow[cIdx] === true) {
         progress.push(i);
       }
    }

    return buildSuccess({ 
      success: true, 
      user: { name: userRow[0], phone: userRow[1] },
      fragments: progress,
      completed: progress.length === 16
    });

  } catch(err) {
    return buildSuccess({ error: "Oracle Error: " + err.toString() });
  }
}

function buildSuccess(res) {
  return ContentService.createTextOutput(JSON.stringify(res))
        .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return doPost(e);
}
