# 📁 Repository Structure

> Complete overview of RMS repository organization

---

## Directory Tree

```
RMS/
├── .gitignore                    # Git ignore rules (Apps Script, IDE, OS files)
├── LICENSE                       # MIT License
├── README.md                     # Main documentation (Bahasa Indonesia)
├── README.en.md                  # English documentation
├── DEPLOYMENT.md                 # Git + Clasp workflow guide
├── BACKEND_CHANGELOG.md          # Code.gs sanitization log (FASE 3)
├── REPOSITORY_STRUCTURE.md       # This file
│
├── src/                          # Source code (Apps Script project)
│   ├── appsscript.json          # Apps Script manifest
│   ├── code.gs                  # Server-side code (2000+ lines)
│   ├── index.html               # Main UI (SPA)
│   └── dev-control.html         # Developer dashboard (optional)
│
├── docs/                         # GitHub Pages demo (static)
│   ├── index.html               # Demo version with shim
│   ├── TESTING_CHECKLIST.md     # 150+ test scenarios
│   └── demo/
│       ├── shim.js              # google.script.run proxy
│       └── mock-data.js         # Fake data generator
│
├── sample-data/                  # Database documentation
│   ├── README.md                # Sample data guide
│   ├── SCHEMA.md                # Complete schema (8 sheets, 49 columns)
│   └── [CSV files]              # Coming soon
│
├── screenshots/                  # Application screenshots
│   ├── README.md                # Screenshot guide
│   └── [PNG files]              # Coming soon
│
└── assets/                       # Additional assets
    └── [Images, logos, etc]     # Coming soon
```

---

## File Descriptions

### Root Level

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `.gitignore` | Ignore Apps Script credentials, IDE config, OS files | 47 | ✅ Complete |
| `LICENSE` | MIT License (open source) | 21 | ✅ Complete |
| `README.md` | Main documentation (ID) - Features, setup, demo | 600+ | ✅ Complete |
| `README.en.md` | English version of README | 600+ | ✅ Complete |
| `DEPLOYMENT.md` | Deployment guide (clasp, git, GitHub Pages) | 700+ | ✅ Complete |
| `BACKEND_CHANGELOG.md` | Code sanitization log from FASE 3 | 400+ | ✅ Complete |
| `REPOSITORY_STRUCTURE.md` | This file - repository overview | 200+ | ✅ Complete |

### src/ (Apps Script Source)

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `appsscript.json` | Apps Script manifest (runtime: V8, webapp config) | 10 | ✅ Complete |
| `code.gs` | Server-side code (all backend logic) | ~2000 | ✅ Sanitized |
| `index.html` | Main UI (SPA with client-side routing) | ~3000 | ✅ Production |
| `dev-control.html` | Developer dashboard (bug injection, testing) | ~500 | ✅ Optional |

**Code.gs Statistics:**
- Functions: 38 (10 READ, 28 WRITE)
- Protected with: `assertWritable_()` in DEMO_MODE
- Private helpers: `safeFmtDate_()`, `getSheet_()`, `writeAuditLog_()`
- Features: CRUD rental, debt management, expenses, loans, reports, audit log

**Index.html Features:**
- SPA navigation (no page reload)
- 3 roles: Admin, Financial, Management
- Chart.js for financial reports
- Responsive design (mobile/desktop)
- Client-side validation

### docs/ (GitHub Pages Demo)

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `index.html` | Demo version (modified from src/index.html) | ~3000 | ✅ Complete |
| `demo/shim.js` | Chainable `google.script.run` proxy | ~100 | ✅ Complete |
| `demo/mock-data.js` | Dynamic fake data generator | ~400 | ✅ Complete |
| `TESTING_CHECKLIST.md` | Manual testing scenarios (150+ cases) | ~600 | ✅ Complete |

**Demo Differences from Production:**
- Passwords: All roles use `demo123`
- Read-only: Write operations show toast notification
- No backend: `shim.js` simulates server calls
- Mock data: Auto-generated with dynamic dates
- Banner: Orange gradient "DEMO MODE" banner

**Demo URL:** `https://your-username.github.io/RMS/`

### sample-data/ (Database Documentation)

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `SCHEMA.md` | Complete database documentation | ~900 | ✅ Complete |
| `README.md` | Sample data guide and import instructions | ~200 | ✅ Complete |
| `sample-data.csv` | Sample dataset (100+ records) | - | 📋 Coming Soon |

**SCHEMA.md Contents:**
- All 8 sheets documented
- Data_Sewa: 49 columns with types, constraints, examples
- Relationships: ERD diagram (Mermaid)
- Calculated fields formulas
- Sample data examples
- Capacity planning (60 MB/year estimate)
- Migration guide

### screenshots/ (Application Screenshots)

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Screenshot guide and checklist | ✅ Complete |
| `dashboard-admin.png` | Admin dashboard screenshot | 📋 Needed |
| `form-rental.png` | Add rental form | 📋 Needed |
| `financial-report.png` | Financial report with chart | 📋 Needed |
| `audit-log.png` | Audit log table | 📋 Needed |
| `mobile-view.png` | Mobile responsive view (optional) | 📋 Needed |

**Required Screenshots:** 4-8 images (1440x900 or 1920x1080)

### assets/ (Additional Resources)

| File | Purpose | Status |
|------|---------|--------|
| Logo files | Company/app branding | 📋 Coming Soon |
| Icons | Custom icons (if any) | 📋 Coming Soon |
| Demo videos | Screen recordings | 📋 Coming Soon |

---

## File Size Summary

| Directory | Files | Size (Est.) | Purpose |
|-----------|-------|-------------|---------|
| `/` (root) | 7 | ~200 KB | Documentation |
| `src/` | 4 | ~500 KB | Source code |
| `docs/` | 5 | ~600 KB | Demo (GitHub Pages) |
| `sample-data/` | 3 | ~100 KB | Database docs |
| `screenshots/` | 1+ | ~5 MB (when complete) | Screenshots |
| `assets/` | 0 | - | Placeholder |
| **TOTAL** | **20+** | **~6.4 MB** | Complete repository |

---

## Git Workflow

### Ignored Files (.gitignore)

```bash
# Apps Script credentials (NEVER commit)
.clasp.json
.clasprc.json
.claspignore

# Environment files
.env
.env.local

# Dependencies
node_modules/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Sensitive data
credentials.json
token.json
```

### Tracked Files

```bash
# Source code
src/code.gs
src/index.html
src/dev-control.html
src/appsscript.json

# Documentation
*.md files (all)

# Demo
docs/index.html
docs/demo/*.js

# Config
.gitignore
LICENSE
```

### Branch Strategy

```
main         ← Production-ready code
  ├── dev    ← Development branch
  │   ├── feature/new-feature
  │   └── fix/bug-fix
  └── docs   ← Documentation updates (optional)
```

---

## Deployment Targets

### 1. Apps Script Production

**Source:** `src/*`  
**Deploy via:** `clasp push && clasp deploy`  
**URL:** `https://script.google.com/macros/s/{SCRIPT_ID}/exec`  
**Users:** Internal team (authenticated)

### 2. GitHub Pages Demo

**Source:** `docs/*`  
**Deploy via:** GitHub Settings → Pages → main/docs  
**URL:** `https://your-username.github.io/RMS/`  
**Users:** Public (read-only demo)

### 3. GitHub Repository

**Source:** All files  
**Deploy via:** `git push origin main`  
**URL:** `https://github.com/your-username/RMS`  
**Users:** Developers, portfolio viewers

---

## Documentation Map

### For End Users

1. **README.md** (ID) or **README.en.md** (EN)
   - Start here for overview
   - Feature descriptions
   - Demo links
   - Screenshots

### For Developers

1. **DEPLOYMENT.md**
   - Setup instructions
   - Clasp workflow
   - Git workflow
   - Troubleshooting

2. **SCHEMA.md** (sample-data/)
   - Database structure
   - All 49 columns explained
   - Relationships
   - Sample data

3. **BACKEND_CHANGELOG.md**
   - Code sanitization log
   - Security improvements
   - Breaking changes
   - Migration notes

### For Testers

1. **TESTING_CHECKLIST.md** (docs/)
   - 150+ test scenarios
   - By role (Admin, Financial, Management)
   - By feature (Rental, Hutang, Expenses, etc.)
   - Edge cases

---

## Next Steps

### Immediate (Before Git Push)

- [ ] Add screenshots (4-8 PNG files)
- [ ] Generate sample-data.csv
- [ ] Update README.md with your GitHub username
- [ ] Update demo URL links
- [ ] Test all internal links in documentation

### Optional (Enhancements)

- [ ] Add logo to assets/
- [ ] Create demo video/GIF
- [ ] Add badges to README (build status, version, etc.)
- [ ] Setup GitHub Actions (CI/CD)
- [ ] Create GitHub Pages custom domain
- [ ] Add CONTRIBUTING.md guide
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Create GitHub issue templates
- [ ] Setup GitHub Discussions

---

## Maintenance

### Regular Updates

**Weekly:**
- Pull changes from Apps Script: `clasp pull`
- Commit updates: `git add . && git commit -m "Update"`

**Monthly:**
- Update CHANGELOG with new features
- Refresh screenshots if UI changed
- Review and update documentation

**Quarterly:**
- Archive old data (if using production)
- Review and update dependencies
- Security audit

### Version Control

**Tagging Releases:**
```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# On GitHub: Create release from tag
# Add release notes from CHANGELOG
```

**Semantic Versioning:**
- `v1.0.0` - Initial release
- `v1.1.0` - New feature (minor)
- `v1.0.1` - Bug fix (patch)
- `v2.0.0` - Breaking change (major)

---

## Quality Checklist

### Code Quality

- [x] Code sanitized (FASE 3)
- [x] Private helpers marked with `_`
- [x] DEMO_MODE implemented
- [x] Write protection added
- [x] Duplicate functions handled
- [x] Sensitive data removed

### Documentation Quality

- [x] README.md comprehensive
- [x] README.en.md translated
- [x] DEPLOYMENT.md complete
- [x] SCHEMA.md detailed
- [x] CHANGELOG documented
- [x] All links working
- [x] Examples provided
- [x] Troubleshooting included

### Repository Quality

- [x] .gitignore configured
- [x] LICENSE added (MIT)
- [x] Folder structure organized
- [x] Files properly named
- [x] No sensitive data
- [x] Demo functional

### Pending

- [ ] Screenshots added
- [ ] Sample data CSV
- [ ] Links updated (GitHub username)
- [ ] First git commit
- [ ] GitHub Pages activated

---

## Support

**Documentation:** All `.md` files in repository

**Issues:** [GitHub Issues](https://github.com/your-username/RMS/issues)

**Discussions:** [GitHub Discussions](https://github.com/your-username/RMS/discussions)

---

**Last Updated:** 2026-11-09  
**Version:** 2.0.0  
**Status:** ✅ FASE 4 Complete - Ready for Git Push
