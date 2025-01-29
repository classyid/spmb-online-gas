# 📚 SPMB Online 2024 dengan Google Apps Script

Sistem Penerimaan Murid Baru (SPMB) 2024 berbasis Google Apps Script - Solusi modern dengan sistem domisili untuk sekolah Indonesia!

## 🌟 Mengapa SPMB Online?
Sesuai kebijakan terbaru Kemendikbudristek, PPDB kini berubah menjadi SPMB dengan penerapan sistem domisili menggantikan zonasi. Sistem ini memastikan:
- Pemerataan akses pendidikan
- Efisiensi pendaftaran
- Transparansi proses seleksi
- Kemudahan bagi orang tua dan sekolah

## ✨ Fitur Utama
- Formulir pendaftaran responsif
- Perhitungan jarak domisili otomatis
- Validasi data real-time
- Upload dokumen dengan preview
- Notifikasi WhatsApp & Email
- Dashboard monitoring
- Penyimpanan data terintegrasi Google Workspace

## 💡 Keunggulan Sistem
- Gratis & tanpa biaya hosting
- Setup cepat & mudah
- Sistem domisili terintegrasi
- Data tersimpan aman di Google Cloud
- Customizable sesuai kebutuhan sekolah
- Dukungan multi-platform

## 📋 Prasyarat
- Akun Google Workspace for Education
- Google Spreadsheet
- Google Drive
- Akun WhatsApp Gateway (opsional)

## ⚙️ Panduan Implementasi
1. Clone repository
2. Setup Google Spreadsheet
3. Konfigurasi Apps Script
4. Sesuaikan parameter domisili
5. Deploy aplikasi
6. Mulai terima pendaftaran!

 **Setup Spreadsheet**
   - Buat spreadsheet baru
   - Buat 2 sheet: `config` dan `ppdb`
   - Isi sheet config sesuai template:
     ```
     ID.PREFIX | PPDB
     ID.YEAR | 2024
     ID.DIGIT | 4
     ID.LAST_NUMBER | 0
     SEKOLAH.NAMA | SMA Digital Indonesia
     SEKOLAH.LAT | -6.200000
}
