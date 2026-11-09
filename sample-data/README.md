# 📦 Sample Data

> Sample datasets for testing and development

---

## Available Files

### Coming Soon

**sample-data.csv** - Complete sample dataset with:
- 100 rental transactions
- 20 customer debts
- 50 expenses
- 10 employee loans
- 30 petty cash transactions
- 5 credit motorcycles
- 50 installment payments
- 200 audit log entries

---

## Data Schema

See **[SCHEMA.md](./SCHEMA.md)** for complete database documentation:
- All 8 sheets structure
- 49 columns of Data_Sewa explained
- Field types, constraints, and relationships
- Sample data examples
- Capacity planning guide

---

## How to Import Sample Data

### Option 1: Manual Import to Google Sheets

```bash
# 1. Download sample-data.csv (when available)

# 2. Open your RMS Google Sheets

# 3. Import for each sheet:
   File → Import → Upload → sample-data-rentals.csv
   Import location: Append to current sheet
   Separator type: Comma

# 4. Repeat for all sheets:
   - Data_Sewa
   - Hutang_Sewa
   - Pengeluaran
   - Kasbon_Karyawan
   - Petty_Cash
   - Data_Kredit
   - Detail_Angsuran
   - Audit_Log
```

### Option 2: Use Seed Script

```bash
# 1. Open Apps Script Editor
   Extensions → Apps Script

# 2. Run seedDemoData() function
   # This will populate all sheets with realistic fake data
   # See src/code.gs for implementation

# 3. Verify data
   # Check each sheet for populated rows
```

---

## Generate Your Own Sample Data

### Using Mock Data Generator

```javascript
// In Apps Script Editor, run:
function seedDemoData() {
  // Populates all sheets with:
  // - 5 rental transactions
  // - 10 expenses
  // - 3 employee loans
  // - 1 petty cash capital + 5 transactions
  // - 2 credits with installments
  
  // See src/code.gs for full implementation
}
```

### Using External Tools

**Mockaroo** (https://mockaroo.com):
1. Create schema matching SCHEMA.md
2. Generate 100+ rows
3. Download as CSV
4. Import to Google Sheets

**Faker.js** (for developers):
```javascript
const faker = require('faker');

const rentals = [];
for (let i = 0; i < 100; i++) {
  rentals.push({
    NamaPelanggan: faker.name.findName(),
    NoHP: faker.phone.phoneNumber('08##########'),
    Alamat: faker.address.streetAddress(),
    Unit: `${faker.vehicle.model()} - ${faker.vehicle.vrm()}`,
    // ... etc
  });
}
```

---

## Data Considerations

### Privacy

⚠️ **All sample data is fictional**
- Names: Generated using Faker library
- Phone numbers: Random 08123456789 pattern
- Addresses: Generic street names
- Transactions: Randomized amounts and dates

✅ **Safe to share publicly**
- No real customer information
- No sensitive business data
- No payment credentials

### Realism

✅ **Sample data includes:**
- Realistic Indonesian names
- Valid phone number formats (08xxx)
- Current/recent dates (relative to today)
- Plausible transaction amounts (Rp 50k - 2M)
- Various statuses (Aktif, Selesai, Batal, Lunas, Belum Lunas)
- Complete history (ActionHistory, PaymentHistory)

✅ **Use cases:**
- Testing all application features
- Demo presentations
- Screenshot/video tutorials
- User acceptance testing
- Performance testing (with 1000+ rows)

---

## Sample Data Statistics

### Data_Sewa (100 rows)
- **Status breakdown:**
  - 40% Aktif
  - 50% Selesai
  - 10% Batal
- **Tipe Rental:**
  - 60% Harian
  - 30% Mingguan
  - 10% Bulanan
- **Pembayaran:**
  - 50% CASH
  - 30% TRANSFER
  - 20% E-WALLET

### Pengeluaran (50 rows)
- **Kategori:**
  - 40% Service
  - 30% Bensin
  - 20% Pajak
  - 10% Lainnya
- **Range:** Rp 10k - 5M
- **Period:** Last 3 months

### Kasbon_Karyawan (10 rows)
- **Status:** 60% Belum Lunas, 40% Lunas
- **Range:** Rp 500k - 5M
- **Employees:** 5 unique employees

---

## Customization

### Adjust Date Range

```javascript
// In seedDemoData() helper functions:
const today = new Date();
const startDate = addDays(today, -90);  // 90 days ago
const endDate = addDays(today, 30);      // 30 days ahead

// Adjust -90 and 30 as needed
```

### Adjust Volume

```javascript
// In seedDemoData():
seedDemoRentals_(5);   // Change to 100 for more data
seedDemoExpenses_(10); // Change to 50 for more data
// etc.
```

### Adjust Values

```javascript
// In helper functions:
const hargaPerHari = 30000 + Math.floor(Math.random() * 70000);
// Change 30000 (min) and 70000 (range) as needed
```

---

## Export Sample Data

### From Your Spreadsheet

```bash
# 1. Select sheet (e.g., Data_Sewa)

# 2. File → Download → Comma-separated values (.csv)

# 3. Rename to sample-data-rentals.csv

# 4. Add to repository
   git add sample-data/sample-data-rentals.csv
   git commit -m "Add sample rental data"
```

### Programmatically

```javascript
function exportSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Data_Sewa');
  const data = sheet.getDataRange().getValues();
  
  // Convert to CSV
  const csv = data.map(row => row.join(',')).join('\n');
  
  // Log or save to Drive
  Logger.log(csv);
}
```

---

## Need Help?

**Schema Questions?** See [SCHEMA.md](./SCHEMA.md)

**Import Issues?** See [DEPLOYMENT.md](../DEPLOYMENT.md)

**GitHub Issues:** [Report a problem](https://github.com/your-username/RMS/issues)

---

**Status:** 📂 Placeholder - CSV files coming soon

**Contributions Welcome!** If you create good sample datasets, please submit a PR!
