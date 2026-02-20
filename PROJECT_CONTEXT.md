# Colony Complaints - Project Context

## Current Status
**Last Updated:** 2026-02-18
**Current Version:** 1.1.0
**Build Status:** ✅ Successfully built and running

## App Launch

### Desktop Shortcut
- **Created:** Yes - "Colony Complaints" on Desktop
- **Target:** `D:\Work\claude\colony-complaints\dist\win-unpacked\Colony Complaints.exe`
- **Working:** App launches successfully

### Manual Launch
```cmd
"D:\Work\claude\colony-complaints\dist\win-unpacked\Colony Complaints.exe"
```
Or open http://localhost:3000 in browser when running.

## Build Configuration

### Current Targets (package.json)
- **portable** - Standalone executable
- **zip** - Compressed archive
- Removed: **nsis** (requires code signing, admin privileges)

### Build Notes
- Code signing fails without admin privileges (safe to ignore)
- App works fine without code signing
- SQLite database included in build (`resources/complaints.db`)

## Recent Changes Made

### 1. Version Updated
- package.json: 1.0.0 → 1.1.0
- preload.js: 1.0.0 → 1.1.0

### 2. Reports Section Simplified
**Before:** Print, PDF, CSV, Excel buttons
**After:** Print, Export CSV buttons only

**Removed:**
- PDF export button (and Excel button that was added temporarily)
- Kept only: Print and CSV export

**Files Modified:**
- `public/index.html` - Removed PDF and Excel buttons
- `public/app.js` - Removed exportExcel() and exportReportPDF() functions
- `server.js` - Kept PDF backend (not hurting), removed Excel backend code and xlsx dependency
- `package.json` - Removed xlsx dependency, updated version, removed nsis target

### 3. Build Completed ✅
**Previous Issue:** File locks prevented rebuild
**Resolution:** Build succeeded, app running
**Output:** `dist/win-unpacked/Colony Complaints.exe`

## Features Summary (Current v1.1.0)
- Dashboard with stats
- Add/edit/delete complaints
- Filter by date/trade/status
- Daily and monthly reports
- Export to CSV (opens in Excel)
- Print reports
- Desktop shortcut for easy launch

## Trade Types
Plumber, Electrician, Carpenter, Painter, Sweeper, Mason, Gardener, Sewerage

## File Structure
```
D:\Work\claude\colony-complaints\
├── dist\win-unpacked\          # Portable app
│   └── Colony Complaints.exe   # Main executable
├── public\                     # Frontend files
├── server.js                   # Express server
├── electron-main.js            # Electron entry
├── preload.js                  # Electron preload
├── complaints.db               # SQLite database
└── package.json                # Dependencies & build config
```

---
**Quick Commands:**
- Rebuild: `npm run build-win`
- Dev mode: `npm start` + `npm run electron`
- Create shortcut: `powershell -File create-shortcut.ps1`
