# 📋 TESTING CHECKLIST - RMS DEMO (GitHub Pages)

## Pre-Testing Setup
- [ ] Demo deployed to GitHub Pages dan accessible via URL
- [ ] Browser: Chrome/Firefox/Edge (latest version)
- [ ] Console terbuka untuk monitoring errors
- [ ] Network tab terbuka untuk monitoring requests

---

## 🔐 LOGIN & AUTHENTICATION

### Admin Role
- [ ] Buka demo URL
- [ ] Banner "DEMO MODE - Read Only" muncul di atas
- [ ] Info kredensial demo terlihat jelas: `Password: demo123`
- [ ] Klik role "Administrator"
- [ ] Input password: `demo123`
- [ ] Berhasil login tanpa error
- [ ] Dashboard admin muncul dengan data mock
- [ ] **Console check**: `[SHIM] google.script.run mock installed`
- [ ] **Console check**: `[MOCK] getRentals() called`

### Financial Role
- [ ] Logout dari admin
- [ ] Login sebagai "Financial Controller"
- [ ] Password: `demo123`
- [ ] Berhasil masuk ke dashboard Financial
- [ ] Data pengeluaran & kas tampil

### Management Role
- [ ] Logout dari Financial
- [ ] Login sebagai "Executive Insights"
- [ ] Password: `demo123`
- [ ] Berhasil masuk ke dashboard Management
- [ ] Grafik dan laporan tampil

---

## 🖥️ ROLE: ADMIN

### Dashboard Admin
- [ ] Statistik card tampil (Total Sewa, Aktif, Telat, Selesai)
- [ ] Angka **TIDAK** nol semua
- [ ] Grafik "Tren Sewa 7 Hari" muncul dan memiliki data
- [ ] Tabel "Sewa Hari Ini" menampilkan minimal 1-3 baris
- [ ] Tabel "Jatuh Tempo Hari Ini" menampilkan data
- [ ] Tidak ada error di console

### Monitoring Sewa (Halaman Aktif)
- [ ] Menu "Monitoring Sewa" dapat diklik
- [ ] Tabel sewa aktif tampil dengan data
- [ ] Filter "Semua/Hari Ini/Jatuh Tempo/Telat" berfungsi
- [ ] Search bar berfungsi (ketik nama customer)
- [ ] Tombol "Tambah Sewa Baru" muncul
- [ ] Klik "Tambah Sewa Baru" → Form muncul
- [ ] Isi form dan submit → **Toast "Mode Demo - Read Only" muncul**
- [ ] Form TIDAK membuat data baru (expected behavior)
- [ ] Tombol "Edit" di tabel → Form edit muncul
- [ ] Submit form edit → **Toast read-only muncul**

### Peringatan Keterlambatan
- [ ] Menu "Peringatan Keterlambatan" dapat diklik
- [ ] Tabel telat tampil dengan warna badge (merah untuk 3+ hari)
- [ ] Filter telat berfungsi
- [ ] Tombol "Cetak Laporan" → Window print terbuka
- [ ] Preview cetak tampil normal (tidak blank)

### Tunggakan (Arrears)
- [ ] Menu "Tunggakan" dapat diklik
- [ ] Tabel tunggakan tampil
- [ ] Tombol "Pindah ke Hutang Sewa" → Confirmation muncul
- [ ] Konfirmasi Ya → **Toast read-only muncul** (data tidak berubah)

### Hutang Sewa
- [ ] Menu "Hutang Sewa" dapat diklik
- [ ] Tabel hutang tampil dengan status (Lunas/Sebagian/Belum Lunas)
- [ ] Tombol "Bayar" → Form pembayaran muncul
- [ ] Submit pembayaran → **Toast read-only muncul**
- [ ] Tombol "Cetak Rekapitulasi" → Window print terbuka

### Sewa Selesai
- [ ] Menu "Sewa Selesai" dapat diklik
- [ ] Tabel sewa selesai tampil
- [ ] Filter bulan berfungsi
- [ ] Data tampil sesuai filter

### Kredit Motor
- [ ] Menu "Kredit Motor" dapat diklik
- [ ] Tabel kredit tampil dengan angsuran
- [ ] Tombol "Tambah Kredit Baru" → Form muncul
- [ ] Submit form → **Toast read-only muncul**
- [ ] Tombol "Bayar Angsuran" → Form muncul
- [ ] Submit angsuran → **Toast read-only muncul**

---

## 💰 ROLE: FINANCIAL

### Dashboard Financial
- [ ] Login sebagai Financial
- [ ] Card summary tampil (Total Pengeluaran, Kas Tersedia, dll)
- [ ] Tabel "Pengeluaran Hari Ini" tampil
- [ ] Grafik "Tren Pengeluaran" tampil dengan data
- [ ] Rekon harian (Cash/Transfer) tampil

### Pengeluaran
- [ ] Menu "Pengeluaran" dapat diklik
- [ ] Tabel pengeluaran tampil
- [ ] Filter kategori (Operasional/Rental/Lainnya) berfungsi
- [ ] Search bar berfungsi
- [ ] Tombol "Tambah Pengeluaran" → Form muncul
- [ ] Submit form → **Toast read-only muncul**
- [ ] Tombol "Edit" → Form edit muncul
- [ ] Submit edit → **Toast read-only muncul**
- [ ] Tombol "Hapus" → Confirmation muncul
- [ ] Konfirmasi hapus → **Toast read-only muncul**

### Kasbon Karyawan
- [ ] Menu "Kasbon Karyawan" dapat diklik
- [ ] Tabel kasbon tampil
- [ ] Summary per karyawan tampil
- [ ] Tombol "Tambah Kasbon" → Form muncul
- [ ] Submit kasbon → **Toast read-only muncul**
- [ ] Tombol "Edit/Hapus" → **Toast read-only muncul**

### Petty Cash
- [ ] Menu "Petty Cash" dapat diklik
- [ ] Filter bulan/tahun berfungsi
- [ ] Tabel transaksi tampil sesuai filter
- [ ] Card summary (Modal Awal, Saldo Saat Ini) tampil
- [ ] Tombol "Topup Modal" → Form muncul
- [ ] Submit topup → **Toast read-only muncul**

### Laporan Transaksi Sewa
- [ ] Menu "Laporan Transaksi Sewa" dapat diklik
- [ ] Tabel pendapatan tampil
- [ ] Filter tanggal berfungsi
- [ ] Total pendapatan dihitung dengan benar
- [ ] Tombol "Cetak Laporan" → Window print terbuka

---

## 📊 ROLE: MANAGEMENT

### Dashboard Management
- [ ] Login sebagai Management
- [ ] Card KPI tampil (Pendapatan, Pengeluaran, Profit)
- [ ] **Angka bukan nol** dan realistis
- [ ] Grafik "Tren Pendapatan vs Pengeluaran" tampil
- [ ] Filter bulan/tahun berfungsi
- [ ] Data update sesuai filter

### Rekapitulasi Harian
- [ ] Menu "Rekapitulasi Harian" dapat diklik
- [ ] Pilih tanggal → Data rekapitulasi tampil
- [ ] Tabel detail pendapatan tampil
- [ ] Total pendapatan harian tampil
- [ ] Tombol "Cetak Laporan" → Window print terbuka
- [ ] Preview cetak tampil dengan format professional

### Rekapitulasi Bulanan
- [ ] Menu "Rekapitulasi Bulanan" dapat diklik
- [ ] Filter bulan/tahun berfungsi
- [ ] Tabel per hari dalam bulan tampil
- [ ] Total bulanan tampil
- [ ] Tombol "Cetak Laporan" → Window print terbuka

### Laporan Keuangan
- [ ] Menu "Laporan Keuangan" dapat diklik
- [ ] Filter bulan/tahun berfungsi
- [ ] 5 card ringkasan eksekutif tampil
- [ ] Tabel detail pendapatan tampil
- [ ] Tabel detail pengeluaran tampil
- [ ] Profit/Loss dihitung dengan benar
- [ ] Tombol "Cetak Laporan" → Window print terbuka
- [ ] Preview cetak tampil dengan header/footer professional

### Laporan Pengeluaran
- [ ] Menu "Laporan Pengeluaran" dapat diklik
- [ ] Filter bulan/tahun/kategori berfungsi
- [ ] Card KPI (Total, per kategori) tampil
- [ ] Tabel ringkasan per kategori tampil
- [ ] Tabel "5 Pengeluaran Terbesar" tampil
- [ ] Search bar berfungsi
- [ ] Tombol "Cetak PDF" → Window print terbuka

### Audit Log
- [ ] Menu "Audit Log" **dapat diklik** (BUG FIX)
- [ ] Halaman Audit Log **muncul tanpa error**
- [ ] Tabel log aktivitas tampil
- [ ] Filter role (Admin/Financial/Management) berfungsi
- [ ] Filter aksi (CREATE/UPDATE/DELETE) berfungsi
- [ ] Search bar berfungsi
- [ ] Data lama/baru tampil di kolom

---

## 🖨️ PRINT FUNCTIONALITY

### Formulir Sewa (Admin)
- [ ] Buka halaman Monitoring Sewa
- [ ] Klik "Lihat Detail" pada satu rental
- [ ] Form detail muncul
- [ ] Klik tombol "Cetak Formulir"
- [ ] Window print terbuka
- [ ] Preview tampil dengan:
  - [ ] Kop surat "DEMO RENTAL COMPANY"
  - [ ] Data customer lengkap
  - [ ] Checkbox jaminan tercentang sesuai data
  - [ ] Blok tanda tangan 3 kolom (Penyewa, Penjamin, Staff)
  - [ ] Format 2 halaman (halaman 1: data, halaman 2: syarat & ketentuan)

### Laporan Keterlambatan (Admin)
- [ ] Buka halaman Peringatan Keterlambatan
- [ ] Klik "Cetak Laporan"
- [ ] Window print terbuka
- [ ] Preview tampil dengan:
  - [ ] Kop surat "DEMO RENTAL COMPANY"
  - [ ] Tabel daftar telat
  - [ ] Total tagihan
  - [ ] Format landscape A4

### Laporan Keuangan (Management)
- [ ] Buka halaman Laporan Keuangan
- [ ] Klik "Export PDF (Cetak)"
- [ ] Window print terbuka
- [ ] Preview tampil dengan:
  - [ ] Header professional dengan bulan/tahun
  - [ ] 5 card ringkasan executive
  - [ ] Tabel detail pendapatan
  - [ ] Tabel detail pengeluaran
  - [ ] Section profit/loss
  - [ ] Footer dengan tanda tangan (3 kolom kosong)
  - [ ] Format portrait A4

---

## 🔍 FILTER & SEARCH

### Filter Umum
- [ ] Filter tanggal (dari-sampai) berfungsi di semua halaman laporan
- [ ] Filter bulan/tahun berfungsi (dropdown)
- [ ] Filter kategori berfungsi (Operasional/Rental/Lainnya)
- [ ] Filter status berfungsi (Aktif/Selesai/Telat)
- [ ] Filter role berfungsi (Admin/Financial/Management)

### Search Umum
- [ ] Search bar di tabel berfungsi (real-time filtering)
- [ ] Search case-insensitive
- [ ] Search tidak menghasilkan error jika input kosong
- [ ] Search dapat di-clear dengan tombol X atau backspace

---

## 📱 RESPONSIVE DESIGN

### Desktop (1920x1080)
- [ ] Layout rapi, tidak ada elemen overflow
- [ ] Sidebar visible di kiri
- [ ] Tabel tidak terpotong
- [ ] Grafik tampil penuh

### Tablet (768x1024)
- [ ] Sidebar collapse menjadi hamburger menu
- [ ] Topbar muncul dengan tombol burger
- [ ] Tabel scroll horizontal jika perlu
- [ ] Card KPI stack vertical

### Mobile (375x667)
- [ ] Hamburger menu berfungsi
- [ ] Overlay dark muncul saat sidebar terbuka
- [ ] Tabel scroll horizontal
- [ ] Font size readable (tidak terlalu kecil)
- [ ] Button tidak terlalu kecil (min 36px height)
- [ ] Banner demo tidak menutupi konten

---

## ⚠️ ERROR HANDLING

### Console Errors
- [ ] **Tidak ada error merah di console** saat normal operation
- [ ] Warning kuning boleh ada (tapi minimal)
- [ ] Network requests ke `demo/shim.js` dan `demo/mock-data.js` berhasil (status 200)

### Missing Data
- [ ] Jika halaman tidak ada data, tampil placeholder "Belum ada data" (bukan crash)
- [ ] Grafik kosong tidak crash (tampil "No data available")

### Failed Actions
- [ ] Setiap aksi WRITE menampilkan toast read-only (bukan error overlay)
- [ ] Toast muncul di bottom-right
- [ ] Toast auto-dismiss setelah 3 detik
- [ ] Toast tidak stack (yang lama hilang jika ada baru)

---

## 🎨 UI/UX

### Visual
- [ ] Warna konsisten (blue untuk primary, red untuk danger, green untuk success)
- [ ] Border radius konsisten
- [ ] Shadow depth konsisten
- [ ] Font weight hierarchy jelas (bold untuk header, normal untuk body)

### Animasi
- [ ] Fade-in smooth saat berpindah halaman
- [ ] Hover state terlihat di button dan link
- [ ] Toast slide-in dari kanan
- [ ] Loading spinner (jika ada) smooth

### Accessibility
- [ ] Semua button memiliki hover state
- [ ] Contrast ratio text readable (tidak ada gray on gray)
- [ ] Form label jelas
- [ ] Error message readable

---

## 🔒 DEMO MODE SPECIFIC

### Banner Demo
- [ ] Banner "DEMO MODE" visible di semua halaman
- [ ] Banner tidak menutupi konten utama
- [ ] Banner warna orange/red gradient
- [ ] Banner sticky di top

### Kredensial Demo
- [ ] Info password `demo123` tampil di login
- [ ] Password sama untuk semua role
- [ ] Login berhasil tanpa backend Apps Script

### Read-Only Toast
- [ ] Toast muncul setiap kali klik tombol "Simpan/Tambah/Edit/Hapus"
- [ ] Toast tidak crash aplikasi
- [ ] Toast message jelas: "Mode Demo - Read Only"
- [ ] Toast auto-dismiss

### Data Sanitization
- [ ] Tidak ada data asli (nama customer, telepon, alamat) yang real
- [ ] Semua customer name fiktif (Ahmad, Budi, Citra, dll)
- [ ] Semua nomor telepon fiktif (08xxx)
- [ ] Alamat perusahaan fiktif: "Demo Rental Company, Jl. Demo Street No. 123"
- [ ] Tidak ada nomor rekening asli
- [ ] Footer login: "Demo Rental Company - Portfolio Project"

---

## ✅ FINAL VALIDATION

### Performance
- [ ] Halaman load dalam < 3 detik
- [ ] Transisi antar halaman smooth (< 500ms)
- [ ] Tidak ada memory leak (buka dev tools > Memory)
- [ ] CPU usage normal (tidak 100% terus)

### Cross-Browser
- [ ] Chrome: ✅ Semua test passed
- [ ] Firefox: ✅ Semua test passed
- [ ] Edge: ✅ Semua test passed
- [ ] Safari (jika ada): ✅ Semua test passed

### GitHub Pages
- [ ] URL accessible: `https://<username>.github.io/RMS/`
- [ ] HTTPS enabled (green padlock)
- [ ] CDN resources load (Tailwind, Chart.js, Font Awesome)
- [ ] Custom domain (jika ada) berfungsi

---

## 🐛 KNOWN ISSUES (Expected, tidak perlu diperbaiki)

- ✅ Bug injection system masih ada di code tetapi disabled
- ✅ Developer dashboard code masih ada tetapi tidak bisa diakses
- ✅ Fungsi WRITE tetap ada di code tetapi throw error read-only
- ✅ Beberapa fungsi unused (getDebtDetail) masih ada di mock-data.js

---

## 📝 NOTES

**Jika menemukan issue:**
1. Screenshot halaman + console error
2. Catat steps to reproduce
3. Browser & versi
4. URL demo

**Expected behavior:**
- Semua GET operations: ✅ Berfungsi penuh
- Semua WRITE operations: ⚠️ Toast "Mode Demo - Read Only"
- Semua PRINT operations: ✅ Berfungsi penuh
- Navigation: ✅ Semua menu accessible
- Filters: ✅ Semua filter berfungsi
- Search: ✅ Semua search berfungsi

**Success criteria:**
- ✅ 0 error merah di console
- ✅ Semua halaman dapat diklik dan dibuka
- ✅ Data tampil realistis (tidak nol/kosong)
- ✅ Toast read-only muncul untuk aksi tulis
- ✅ Cetak berfungsi dengan preview professional

---

**Checklist ini untuk memastikan demo siap dipublikasikan sebagai portfolio GitHub Pages!**
