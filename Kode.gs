function doGet(e) {
  loadConfig();
  const page = e.parameter.page || 'landing';
  
  switch(page) {
    case 'form':
      return HtmlService.createTemplateFromFile('Index')
        .evaluate()
        .setTitle('Form PPDB ' + CONFIG.SEKOLAH.NAMA)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    default:
      return HtmlService.createTemplateFromFile('Landing')
        .evaluate()
        .setTitle('PPDB ' + CONFIG.SEKOLAH.NAMA)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function processForm(formData, photoFile, ijazahFile) {
  if (!CONFIG) loadConfig();
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(DATA_SHEET);
  const timestamp = new Date();
  const registrationId = generateRegistrationId();
  
  // Save files
  const photoFileName = formatFileName('foto', registrationId, formData.nama, timestamp);
  const ijazahFileName = formatFileName('ijazah', registrationId, formData.nama, timestamp);
  
  const photoUrl = saveFile(photoFile, photoFileName);
  const ijazahUrl = saveFile(ijazahFile, ijazahFileName);
  
  const row = [
    timestamp,
    registrationId,
    formData.nama,
    formData.email,
    formData.telepon,
    formData.alamat,
    formData.latitude,
    formData.longitude,
    formData.jarak,
    formData.sekolahAsal,
    photoUrl,
    ijazahUrl
  ];
  
  sheet.appendRow(row);
  
  const message = `
Selamat! Pendaftaran Anda di ${CONFIG.SEKOLAH.NAMA} telah berhasil.

Detail Pendaftaran:
Nomor Pendaftaran: ${registrationId}
Tanggal: ${Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "dd MMMM yyyy HH:mm")}

Data Pendaftar:
Nama: ${formData.nama}
Email: ${formData.email}
No. WhatsApp: ${formData.telepon}
Alamat: ${formData.alamat}
Jarak ke Sekolah: ${formData.jarak} km
Asal Sekolah: ${formData.sekolahAsal}

Dokumen yang telah diunggah:
- Pas Foto
- Ijazah/Surat Keterangan Lulus

Simpan nomor pendaftaran Anda untuk keperluan selanjutnya.
Informasi lebih lanjut akan dikirimkan melalui WhatsApp, Email, dan Telegram.

Terima kasih telah mendaftar di ${CONFIG.SEKOLAH.NAMA}.
  `.trim();

  try {
    // Send WhatsApp
    UrlFetchApp.fetch(CONFIG.NOTIF.WA.ENDPOINT, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        api_key: CONFIG.NOTIF.WA.API_KEY,
        sender: CONFIG.NOTIF.WA.SENDER,
        number: formData.telepon,
        message: message
      })
    });

    // Send Telegram
    const telegramUrl = `https://api.telegram.org/bot${CONFIG.NOTIF.TELEGRAM.BOT_TOKEN}/sendMessage`;
    UrlFetchApp.fetch(telegramUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: CONFIG.NOTIF.TELEGRAM.CHAT_ID,
        text: message
      })
    });

    // Send Email
    const subject = `Pendaftaran PPDB ${CONFIG.SEKOLAH.NAMA} - ${registrationId}`;
    GmailApp.sendEmail(formData.email, subject, message, {
      name: CONFIG.NOTIF.EMAIL.SENDER_NAME
    });

    return { 
      success: true,
      registrationId: registrationId 
    };
  } catch (error) {
    Logger.log('Error sending notifications: ' + error.toString());
    return {
      success: true,
      registrationId: registrationId,
      notificationError: error.toString()
    };
  }
}
