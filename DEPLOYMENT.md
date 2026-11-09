# 🚀 Deployment Guide - RMS

> Panduan lengkap untuk deployment RMS menggunakan Git + Clasp workflow

[🇬🇧 English Version](#english-version) | [🏠 Back to README](./README.md)

---

## 📋 Daftar Isi

- [Prerequisites](#prerequisites)
- [Setup Awal](#setup-awal)
- [Local Development](#local-development)
- [Deploy ke Production](#deploy-ke-production)
- [Deploy GitHub Pages](#deploy-github-pages)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Prerequisites

### Tools yang Dibutuhkan

1. **Node.js & npm**
   ```bash
   # Check instalasi
   node --version  # v14+ recommended
   npm --version
   
   # Install jika belum ada
   # macOS: brew install node
   # Windows: https://nodejs.org/
   ```

2. **Google Clasp (Apps Script CLI)**
   ```bash
   npm install -g @google/clasp
   
   # Verify
   clasp --version
   ```

3. **Git**
   ```bash
   # Check instalasi
   git --version
   
   # Install jika belum ada
   # macOS: brew install git
   # Windows: https://git-scm.com/
   ```

4. **Google Account** dengan akses ke:
   - Google Sheets
   - Google Apps Script
   - Google Drive

---

## Setup Awal

### 1. Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/your-username/RMS.git
cd RMS

# Atau fork dulu, lalu clone fork Anda
```

### 2. Login ke Google Apps Script

```bash
# Login (akan buka browser)
clasp login

# Authorize clasp untuk akses:
# - Google Apps Script
# - Google Drive
# - Google Sheets
```

**Troubleshooting login:**
```bash
# Jika error "invalid credentials"
rm ~/.clasprc.json
clasp login

# Jika error "unauthorized client"
# Pastikan enable Apps Script API:
# https://script.google.com/home/usersettings
```

### 3. Buat Google Sheets Database

**Option A: Manual Setup**

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Buat 9 sheets:
   - `Data_Sewa` (49 kolom - lihat [SCHEMA.md](./sample-data/SCHEMA.md))
   - `Hutang_Sewa`
   - `Pengeluaran`
   - `Kasbon_Karyawan`
   - `Petty_Cash`
   - `Data_Kredit`
   - `Detail_Angsuran`
   - `Audit_Log`
   - `Konfigurasi`

4. Di sheet `Konfigurasi`, tambahkan:
   ```
   | Key                  | Value                  |
   |----------------------|------------------------|
   | COMPANY_NAME         | Nama Rental Anda       |
   | COMPANY_ADDRESS      | Alamat lengkap         |
   | ADMIN_CONTACT        | 081234567890           |
   | PASSWORD_ADMIN       | admin123               |
   | PASSWORD_FINANCIAL   | finance123             |
   | PASSWORD_MANAGEMENT  | mgmt123                |
   ```

5. Copy Spreadsheet ID dari URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

**Option B: Copy Template** (Coming Soon)
```bash
# Template link akan disediakan
# File → Make a copy → Rename
```

### 4. Link Apps Script ke Spreadsheet

```bash
cd src

# Option A: Buat script baru (jika spreadsheet baru)
clasp create --type sheets --title "RMS" --rootDir .

# Option B: Clone existing script
clasp clone <SCRIPT_ID>

# SCRIPT_ID bisa didapat dari:
# 1. Buka spreadsheet → Extensions → Apps Script
# 2. Project Settings → Script ID
```

File `.clasp.json` akan dibuat:
```json
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "/Users/your-name/RMS/src"
}
```

**⚠️ PENTING:** Jangan commit `.clasp.json` (sudah ada di .gitignore)

---

## Local Development

### 1. Edit Code Locally

```bash
# Edit dengan editor favorit
code src/           # VS Code
vim src/code.gs     # Vim
nano src/index.html # Nano
```

### 2. Push Changes ke Apps Script

```bash
cd src

# Push semua files
clasp push

# Push dengan watch (auto-push on save)
clasp push --watch

# Force push (overwrite remote)
clasp push --force
```

**Files yang di-push:**
- `code.gs` → Server-side code
- `index.html` → Main UI
- `dev-control.html` → Dev dashboard (optional)
- `appsscript.json` → Manifest

### 3. Open Apps Script Editor

```bash
# Buka di browser
clasp open

# Buka specific file
clasp open --creds
clasp open --webapp
```

### 4. Pull Changes dari Remote

```bash
# Jika edit di Apps Script Editor, pull dulu
clasp pull

# Pull dan overwrite local
clasp pull --force
```

### 5. View Logs

```bash
# Tail logs (real-time)
clasp logs

# Show recent logs
clasp logs --simplified
```

---

## Deploy ke Production

### 1. Test di Development

```bash
cd src
clasp push

# Open webapp untuk test
clasp open --webapp
# Klik "Test deployment" di Apps Script Editor
```

### 2. Create Deployment

**Via Clasp:**
```bash
# Create deployment baru
clasp deploy --description "v1.0.0 - Initial release"

# List deployments
clasp deployments

# Output example:
# 2 Deployments.
# - AKfycbxXXXXX @1 - v1.0.0 - Initial release
# - AKfycbxYYYYY @HEAD - Latest version
```

**Via Apps Script Editor:**
1. Klik **Deploy** → **New deployment**
2. Type: **Web app**
3. Description: `v1.0.0 - Initial release`
4. Execute as: **User accessing the web app**
5. Who has access: 
   - **Only myself** (private)
   - **Anyone** (public - untuk demo)
6. Klik **Deploy**
7. Copy **Web app URL**

### 3. Update Deployment

```bash
# Update deployment yang sudah ada
clasp deploy --deploymentId AKfycbxXXXXX --description "v1.0.1 - Bug fixes"

# Atau buat deployment baru (recommended untuk versioning)
clasp deploy --description "v1.0.1 - Bug fixes"
```

### 4. Undeploy (Rollback)

```bash
# List deployments
clasp deployments

# Undeploy specific version
clasp undeploy AKfycbxXXXXX

# Undeploy all except @HEAD
clasp undeploy --all
```

### 5. Setup Production Config

Di sheet `Konfigurasi`, ganti password default:
```
PASSWORD_ADMIN       → ganti dari admin123
PASSWORD_FINANCIAL   → ganti dari finance123
PASSWORD_MANAGEMENT  → ganti dari mgmt123
```

⚠️ **Jangan hardcode password di code.gs!**

---

## Deploy GitHub Pages

### 1. Setup GitHub Pages

```bash
# Pastikan folder docs/ sudah ada (dari FASE 2)
ls docs/
# Output: index.html, demo/, TESTING_CHECKLIST.md

# Commit docs/ folder
git add docs/
git commit -m "Add GitHub Pages demo"
git push origin main
```

### 2. Enable GitHub Pages

1. Buka repository di GitHub
2. **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / **docs** folder
5. Klik **Save**

### 3. Verify Deployment

```bash
# Wait 1-2 minutes, lalu akses:
# https://your-username.github.io/RMS/
```

### 4. Custom Domain (Optional)

Di **Settings → Pages → Custom domain**:
```
demo.your-domain.com
```

Tambahkan CNAME record di DNS provider:
```
CNAME demo.your-domain.com your-username.github.io
```

---

## Git Workflow

### Branching Strategy

```bash
# Main branch (production)
main ← deploy ke production

# Development branch
dev ← daily development

# Feature branches
feature/add-export-excel
feature/fix-audit-log-bug
```

### Daily Workflow

```bash
# 1. Buat feature branch
git checkout -b feature/new-feature

# 2. Edit code
code src/code.gs

# 3. Test dengan clasp push
cd src
clasp push
clasp open --webapp  # Test di browser

# 4. Commit changes
git add .
git commit -m "Add new feature: export to Excel"

# 5. Push ke GitHub
git push origin feature/new-feature

# 6. Create Pull Request di GitHub
# Review → Merge ke main

# 7. Setelah merge, deploy
git checkout main
git pull
cd src
clasp push
clasp deploy --description "v1.1.0 - Add Excel export"
```

### Release Workflow

```bash
# 1. Update version di code
# Edit src/code.gs: const VERSION = "1.1.0";

# 2. Update CHANGELOG.md
code CHANGELOG.md

# 3. Commit
git add .
git commit -m "Release v1.1.0"

# 4. Tag release
git tag -a v1.1.0 -m "Release v1.1.0: Excel export feature"
git push origin v1.1.0

# 5. Deploy
cd src
clasp push
clasp deploy --description "v1.1.0 - Excel export"

# 6. Create GitHub Release
# GitHub → Releases → Draft new release
# Tag: v1.1.0
# Title: v1.1.0 - Excel Export Feature
# Description: [Copy dari CHANGELOG.md]
```

---

## Troubleshooting

### ❌ Error: "User has not enabled the Apps Script API"

**Solution:**
```bash
# Enable API di:
# https://script.google.com/home/usersettings

# Scroll ke "Google Apps Script API"
# Toggle ON
```

### ❌ Error: "Could not read API credentials"

**Solution:**
```bash
# Re-login
rm ~/.clasprc.json
clasp login
```

### ❌ Error: "Manifest file has been updated"

**Solution:**
```bash
# Pull manifest dulu
clasp pull --only appsscript.json

# Lalu push
clasp push
```

### ❌ Error: "Script file must be inside .clasp.json root dir"

**Solution:**
```bash
# Pastikan di folder src/ saat push
cd src
clasp push

# Atau update .clasp.json rootDir:
{
  "scriptId": "...",
  "rootDir": "/full/path/to/RMS/src"
}
```

### ❌ Error: "Exceeded maximum execution time"

**Cause:** Function run >6 minutes (Apps Script limit)

**Solution:**
```javascript
// Split long operations
function processLargeData() {
  const data = getSheet_('Data_Sewa').getDataRange().getValues();
  const batchSize = 100;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    processBatch(batch);
    
    // Avoid timeout
    Utilities.sleep(100);
  }
}
```

### ❌ Error: "Service Spreadsheets failed while accessing document"

**Cause:** Script tidak punya permission ke spreadsheet

**Solution:**
```bash
# Re-deploy dan re-authorize
cd src
clasp push
clasp open --webapp

# Klik "Test deployment"
# Akan minta permission → Allow
```

### ❌ GitHub Pages 404 Not Found

**Solution:**
```bash
# 1. Pastikan docs/index.html ada
ls docs/index.html

# 2. Pastikan settings GitHub Pages benar:
#    Settings → Pages → Source: main branch / docs folder

# 3. Wait 1-2 minutes, clear cache
# Ctrl+Shift+R (hard refresh)

# 4. Check deployment status
# Settings → Pages → Visit site
```

---

## Best Practices

### 🔐 Security

1. **Jangan commit credentials:**
   ```bash
   # .gitignore sudah include:
   .clasp.json
   .clasprc.json
   credentials.json
   ```

2. **Ganti password default:**
   ```javascript
   // Di sheet Konfigurasi, bukan di code!
   PASSWORD_ADMIN: "secure-password-123"
   ```

3. **Protect sheets:**
   ```bash
   # Di Google Sheets:
   # Data → Protect sheets and ranges
   # Warning only: Show warning when editing
   # Atau: Only you and domain admins
   ```

4. **Use DEMO_MODE untuk public demo:**
   ```javascript
   // src/code.gs
   const DEMO_MODE = true; // Write operations disabled
   ```

### 📦 Versioning

1. **Semantic versioning:**
   ```
   v1.0.0 - Major.Minor.Patch
   v1.1.0 - New feature (minor)
   v1.1.1 - Bug fix (patch)
   v2.0.0 - Breaking change (major)
   ```

2. **Git tags untuk releases:**
   ```bash
   git tag -a v1.0.0 -m "Initial release"
   git push origin v1.0.0
   ```

3. **Changelog update:**
   ```markdown
   ## v1.1.0 (2026-11-10)
   **Added:**
   - Export to Excel feature
   
   **Fixed:**
   - Audit log navigation bug
   ```

### 🧪 Testing

1. **Test sebelum deploy:**
   ```bash
   # Push ke dev deployment
   clasp push
   clasp open --webapp
   # Test semua role: Admin, Financial, Management
   ```

2. **User acceptance testing:**
   ```bash
   # Share test deployment dengan team
   # "Test deployment" URL berbeda dari production
   ```

3. **Regression testing:**
   ```bash
   # Check TESTING_CHECKLIST.md
   cat docs/TESTING_CHECKLIST.md
   # Test 150+ scenarios
   ```

### 🔄 Backup

1. **Regular spreadsheet backup:**
   ```bash
   # File → Make a copy
   # Rename: "RMS - Backup 2026-11-09"
   # (Google Sheets auto-versioning: File → Version history)
   ```

2. **Git backup:**
   ```bash
   # Push ke GitHub secara regular
   git push origin main
   
   # Create release untuk milestone
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Export code backup:**
   ```bash
   # Pull dari Apps Script
   cd src
   clasp pull
   
   # Commit ke Git
   git add .
   git commit -m "Backup: $(date +%Y-%m-%d)"
   git push
   ```

### 📊 Monitoring

1. **Check logs:**
   ```bash
   # Real-time logs
   clasp logs --watch
   
   # Filter errors
   clasp logs | grep "Error"
   ```

2. **Audit log di spreadsheet:**
   ```sql
   -- Query audit log sheet
   SELECT User, Action, Timestamp 
   FROM Audit_Log 
   WHERE Action LIKE '%delete%'
   ORDER BY Timestamp DESC
   ```

3. **Usage metrics:**
   - Apps Script dashboard: https://script.google.com/home
   - Executions tab → View stats

---

## Advanced: CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Apps Script

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install clasp
        run: npm install -g @google/clasp
      
      - name: Create .clasprc.json
        run: |
          echo '${{ secrets.CLASPRC_JSON }}' > ~/.clasprc.json
      
      - name: Deploy
        run: |
          cd src
          echo '${{ secrets.CLASP_JSON }}' > .clasp.json
          clasp push
          clasp deploy --description "Auto-deploy from GitHub Actions"
```

**Setup secrets:**
1. GitHub repo → Settings → Secrets → New repository secret
2. Add `CLASPRC_JSON`: Content dari `~/.clasprc.json`
3. Add `CLASP_JSON`: Content dari `src/.clasp.json`

---

## Cheat Sheet

```bash
# === SETUP ===
clasp login                           # Login pertama kali
clasp create --type sheets --title "RMS"  # Buat project baru
clasp clone <SCRIPT_ID>               # Clone existing project

# === DEVELOPMENT ===
clasp push                            # Push code ke Apps Script
clasp push --watch                    # Auto-push on save
clasp pull                            # Pull dari Apps Script
clasp open                            # Open Apps Script Editor
clasp open --webapp                   # Open Web App
clasp logs                            # View logs

# === DEPLOYMENT ===
clasp deploy --description "v1.0"     # Deploy baru
clasp deployments                     # List deployments
clasp undeploy <ID>                   # Undeploy

# === GIT ===
git clone <URL>                       # Clone repo
git checkout -b feature/new           # Buat branch
git add . && git commit -m "msg"      # Commit
git push origin feature/new           # Push branch
git tag v1.0.0 && git push origin v1.0.0  # Release

# === TROUBLESHOOTING ===
rm ~/.clasprc.json && clasp login     # Reset login
clasp pull --force                    # Force pull
clasp push --force                    # Force push
```

---

<a name="english-version"></a>
## 🇬🇧 English Version

### Quick Start

```bash
# 1. Install clasp
npm install -g @google/clasp

# 2. Login
clasp login

# 3. Clone project
git clone https://github.com/your-username/RMS.git
cd RMS/src

# 4. Link to your Apps Script
clasp create --type sheets --title "RMS"

# 5. Push code
clasp push

# 6. Deploy
clasp deploy --description "v1.0.0"

# 7. Open webapp
clasp open --webapp
```

For detailed English documentation, see comments in README.en.md.

---

## 📞 Support

**Issues:** [GitHub Issues](https://github.com/your-username/RMS/issues)

**Discussions:** [GitHub Discussions](https://github.com/your-username/RMS/discussions)

**Documentation:** [README.md](./README.md)

---

**Happy Deploying! 🚀**
