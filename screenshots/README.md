# 📸 Screenshots

> Placeholder for RMS application screenshots

---

## Required Screenshots

### 1. Dashboard Admin
**Filename:** `dashboard-admin.png`

**Content:**
- Header dengan company name dan role indicator
- Cards: Total Pendapatan (Hari Ini, Minggu Ini, Bulan Ini)
- Unit Status: Tersedia vs Disewa (dengan angka)
- Top 5 Hutang Pelanggan (tabel)
- Quick Actions: Tambah Rental, Cek Hutang (buttons)

**Recommended Size:** 1920x1080 atau 1440x900

---

### 2. Form Rental
**Filename:** `form-rental.png`

**Content:**
- Form "Tambah Rental Baru"
- Fields: Nama Pelanggan, No HP, Alamat, No Identitas
- Fields: Nama Penjamin, HP Penjamin, Alamat Penjamin
- Fields: Unit (dropdown), Tipe Rental (Harian/Mingguan/Bulanan)
- Fields: Durasi (hari), Tanggal Mulai
- Fields: Harga per Hari, Uang Muka, Metode Pembayaran
- Auto-calculated: Total Biaya, Sisa Pembayaran
- Buttons: Simpan, Batal

**Recommended Size:** 1920x1080 atau 1440x900

---

### 3. Financial Report
**Filename:** `financial-report.png`

**Content:**
- Header "Laporan Keuangan"
- Date range selector (Start Date - End Date)
- Summary cards: Total Pendapatan, Total Pengeluaran, Laba Bersih
- Chart.js line chart: Pendapatan vs Pengeluaran (time series)
- Breakdown table: Pendapatan by category, Pengeluaran by category
- Export buttons: PDF, Excel

**Recommended Size:** 1920x1080 atau 1440x900

---

### 4. Audit Log
**Filename:** `audit-log.png`

**Content:**
- Header "Audit Log" dengan "Management" role indicator
- Filter options: User, Action, Date Range
- Table columns: Timestamp, User, Action, Description, Data
- Pagination controls: Previous, Page 1 of 10, Next
- Search box
- Export button

**Recommended Size:** 1920x1080 atau 1440x900

---

## Additional Screenshots (Optional)

### 5. Mobile View
**Filename:** `mobile-view.png`

**Content:**
- Responsive layout pada mobile (375x667 - iPhone SE)
- Hamburger menu
- Compact dashboard cards
- Touch-friendly buttons

---

### 6. Login Page
**Filename:** `login-page.png`

**Content:**
- RMS logo/title
- Role selector (dropdown): Admin, Financial, Management
- Password field
- Login button
- Demo mode banner (jika demo)

---

### 7. Hutang Management
**Filename:** `hutang-management.png`

**Content:**
- List semua hutang pelanggan
- Columns: Nama, HP, Unit, Total Hutang, Sudah Dibayar, Sisa, Status
- Action buttons per row: Bayar, Detail
- Filter: Lunas / Belum Lunas
- Export to Excel button

---

### 8. Unit Management
**Filename:** `unit-management.png`

**Content:**
- List semua unit motor
- Columns: Nomor Polisi, Jenis Motor, Status (Tersedia/Disewa/Maintenance)
- Statistics per unit: Total Rental, Total Pendapatan
- Color coding: Green (Tersedia), Red (Disewa), Yellow (Maintenance)

---

## How to Add Screenshots

1. **Take Screenshots:**
   ```bash
   # macOS
   Cmd + Shift + 4 → Select area
   
   # Windows
   Win + Shift + S → Select area
   
   # Chrome DevTools (for responsive)
   F12 → Toggle device toolbar (Cmd/Ctrl + Shift + M)
   ```

2. **Optimize Images:**
   ```bash
   # Install ImageMagick
   brew install imagemagick  # macOS
   
   # Resize to 1440px width
   convert dashboard-admin.png -resize 1440x dashboard-admin.png
   
   # Compress PNG
   pngquant dashboard-admin.png --quality 80-90 --output dashboard-admin.png
   ```

3. **Naming Convention:**
   - Lowercase with hyphens: `dashboard-admin.png`
   - No spaces or special characters
   - Descriptive filename

4. **Add to Repository:**
   ```bash
   git add screenshots/*.png
   git commit -m "Add application screenshots"
   git push
   ```

---

## Screenshot Checklist

- [ ] `dashboard-admin.png` - Admin Dashboard
- [ ] `form-rental.png` - Add Rental Form
- [ ] `financial-report.png` - Financial Report with Chart
- [ ] `audit-log.png` - Audit Log Table
- [ ] `mobile-view.png` - Mobile Responsive (optional)
- [ ] `login-page.png` - Login Screen (optional)
- [ ] `hutang-management.png` - Debt Management (optional)
- [ ] `unit-management.png` - Unit Management (optional)

---

## Tips for Great Screenshots

✅ **DO:**
- Use demo data (not real customer data)
- Show realistic values (not 0 or 9999999)
- Capture full window (with browser chrome for context)
- Use consistent theme/colors
- Show interactive states (hover, active)

❌ **DON'T:**
- Include sensitive real data
- Take blurry or low-res images
- Show empty states (no data)
- Include personal bookmarks/tabs
- Show error states (unless intentional)

---

**Current Status:** 📂 Empty - Screenshots needed

**Target:** 4-8 high-quality screenshots

**Estimated Time:** 15-30 minutes
