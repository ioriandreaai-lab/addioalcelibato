// GOOGLE APPS SCRIPT — Addio al Celibato Check-in Form
// Istruzioni:
// 1. Vai su script.google.com → Nuovo progetto
// 2. Incolla questo codice
// 3. Salva, poi Deploy → Nuova distribuzione → Tipo: App Web
//    - Esegui come: Me
//    - Accesso: Chiunque
// 4. Copia l'URL della distribuzione
// 5. Incollalo in index.html nella variabile FORM_API (sostituisci INSERISCI_QUI_IL_DEPLOYMENT_ID)

const SHEET_NAME = 'Check-in';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Crea il foglio con intestazioni se non esiste
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Nome e Cognome',
        'Arrivo',
        'Allergie',
        'Grigliata',
        'Modulo Barca',
        'Soldi Inviati'
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date().toLocaleString('it-IT'),
      data.nome || '',
      data.arrivo || '',
      data.allergie || '',
      data.grigliata || '',
      data.barca || '',
      data.soldi || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Funzione di test — eseguila manualmente per verificare che tutto funzioni
function testSubmit() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nome: 'Mario Rossi',
        arrivo: 'Venerdì sera',
        allergie: 'Nessuna',
        grigliata: 'Sì, ottima idea',
        barca: 'Sì, fatto',
        soldi: 'Sì, bonifico inviato'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
