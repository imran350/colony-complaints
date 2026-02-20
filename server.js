const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow database path to be overridden (for Electron)
let dbPath = process.env.COMPLAINTS_DB_PATH || path.join(__dirname, 'complaints.db');
const backupDir = 'C:\\Users\\CityServices\\AppData\\Roaming\\colony-complaints';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create tables
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS complaints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        resident_name TEXT NOT NULL,
        flat_number TEXT NOT NULL,
        contact_number TEXT,
        trade_type TEXT NOT NULL,
        complaint_description TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        assigned_to TEXT,
        completed_date TEXT,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        is_active INTEGER DEFAULT 1
    )`, (err) => {
        if (!err) {
            // Insert default trades
            const defaultTrades = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Sweeper', 'Mason', 'Gardener', 'Sewerage'];
            defaultTrades.forEach(trade => {
                db.run('INSERT OR IGNORE INTO trades (name) VALUES (?)', [trade]);
            });
        }
    });
}

// ============ API ROUTES ============

// Get all trades
app.get('/api/trades', (req, res) => {
    db.all('SELECT * FROM trades WHERE is_active = 1 ORDER BY name', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add new trade
app.post('/api/trades', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO trades (name) VALUES (?)', [name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name });
    });
});

// Get all complaints with filters
app.get('/api/complaints', (req, res) => {
    const { startDate, endDate, trade, status, search } = req.query;
    let sql = 'SELECT * FROM complaints WHERE 1=1';
    const params = [];

    if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
    }
    if (trade && trade !== 'All') {
        sql += ' AND trade_type = ?';
        params.push(trade);
    }
    if (status && status !== 'All') {
        sql += ' AND status = ?';
        params.push(status);
    }
    if (search) {
        sql += ' AND (resident_name LIKE ? OR flat_number LIKE ? OR complaint_description LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get single complaint
app.get('/api/complaints/:id', (req, res) => {
    db.get('SELECT * FROM complaints WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Complaint not found' });
        res.json(row);
    });
});

// Add new complaint
app.post('/api/complaints', (req, res) => {
    const { date, resident_name, flat_number, contact_number, trade_type, complaint_description, assigned_to, remarks } = req.body;

    const sql = `INSERT INTO complaints (date, resident_name, flat_number, contact_number, trade_type,
                 complaint_description, assigned_to, remarks)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [date, resident_name, flat_number, contact_number, trade_type,
                 complaint_description, assigned_to, remarks], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Complaint added successfully' });
    });
});

// Update complaint
app.put('/api/complaints/:id', (req, res) => {
    const { status, assigned_to, completed_date, remarks } = req.body;

    let sql = 'UPDATE complaints SET ';
    const updates = [];
    const params = [];

    if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
        if (status === 'Completed' && !completed_date) {
            updates.push('completed_date = ?');
            params.push(new Date().toISOString().split('T')[0]);
        }
    }
    if (assigned_to !== undefined) {
        updates.push('assigned_to = ?');
        params.push(assigned_to);
    }
    if (remarks !== undefined) {
        updates.push('remarks = ?');
        params.push(remarks);
    }
    if (completed_date !== undefined) {
        updates.push('completed_date = ?');
        params.push(completed_date);
    }

    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(req.params.id);

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Complaint updated successfully' });
    });
});

// Delete complaint
app.delete('/api/complaints/:id', (req, res) => {
    db.run('DELETE FROM complaints WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Complaint deleted successfully' });
    });
});

// Get dashboard stats
app.get('/api/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = today.substring(0, 7) + '-01';

    db.get(`SELECT
        COUNT(*) as total_complaints,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN date = ? THEN 1 ELSE 0 END) as today_count,
        SUM(CASE WHEN date >= ? THEN 1 ELSE 0 END) as month_count
    FROM complaints`, [today, firstDayOfMonth], (err, stats) => {
        if (err) return res.status(500).json({ error: err.message });

        // Get trade-wise stats
        db.all(`SELECT trade_type, COUNT(*) as count,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
                FROM complaints
                WHERE date >= ?
                GROUP BY trade_type`, [firstDayOfMonth], (err, tradeStats) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...stats, trade_breakdown: tradeStats });
        });
    });
});

// Get monthly report data
app.get('/api/reports/monthly', (req, res) => {
    const { year, month } = req.query;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    db.all(`SELECT * FROM complaints
            WHERE date >= ? AND date <= ?
            ORDER BY date DESC`, [startDate, endDate], (err, complaints) => {
        if (err) return res.status(500).json({ error: err.message });

        // Summary by trade
        db.all(`SELECT trade_type, status, COUNT(*) as count
                FROM complaints
                WHERE date >= ? AND date <= ?
                GROUP BY trade_type, status`, [startDate, endDate], (err, summary) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ complaints, summary });
        });
    });
});

// Get daily report data
app.get('/api/reports/daily', (req, res) => {
    const { date } = req.query;

    db.all(`SELECT * FROM complaints WHERE date = ? ORDER BY created_at DESC`, [date], (err, complaints) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(`SELECT trade_type, status, COUNT(*) as count
                FROM complaints
                WHERE date = ?
                GROUP BY trade_type, status`, [date], (err, summary) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ complaints, summary });
        });
    });
});

// ============ PDF EXPORT ============
app.get('/api/export/pdf/:id', async (req, res) => {
    try {
        const complaint = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM complaints WHERE id = ?', [req.params.id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const html = generateComplaintHTML(complaint);
        const pdfBuffer = await generatePDF(html);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="complaint-${complaint.id}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

app.post('/api/export/pdf/batch', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'No complaint IDs provided' });
        }

        const placeholders = ids.map(() => '?').join(',');
        const complaints = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM complaints WHERE id IN (${placeholders})`, ids, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        const html = generateBatchHTML(complaints);
        const pdfBuffer = await generatePDF(html);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="complaints-batch-${Date.now()}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF batch generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

app.post('/api/export/pdf/report', async (req, res) => {
    try {
        const { title, complaints, summary } = req.body;

        const html = generateReportHTML(title, complaints, summary);
        const pdfBuffer = await generatePDF(html);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF report generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});


async function generatePDF(html) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    });
    await browser.close();
    return pdf;
}

function generateComplaintHTML(complaint) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: white; }
        .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #333; padding: 30px; border-radius: 8px; }
        .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #4f46e5; font-size: 24px; margin-bottom: 5px; }
        .header p { color: #666; font-size: 12px; }
        .receipt-id { background: #4f46e5; color: white; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 15px; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #ddd; }
        .info-label { font-weight: 600; color: #555; font-size: 13px; }
        .info-value { color: #333; font-size: 13px; text-align: right; max-width: 60%; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-in-progress { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .description { background: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 3px solid #4f46e5; }
        .description h4 { font-size: 12px; color: #666; margin-bottom: 8px; }
        .description p { font-size: 13px; color: #333; line-height: 1.5; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 11px; color: #999; }
        .logo { font-size: 40px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo">🏘️</div>
            <div class="receipt-id">#${String(complaint.id).padStart(4, '0')}</div>
            <h1>COMPLAINT RECEIPT</h1>
            <p>Colony Complaints Management System</p>
        </div>
        <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${formatDate(complaint.date)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">House/Qtr Number:</span>
            <span class="info-value">${complaint.flat_number}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Contact Number:</span>
            <span class="info-value">${complaint.contact_number || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Trade Type:</span>
            <span class="info-value">${complaint.trade_type}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value"><span class="status status-${complaint.status.toLowerCase().replace(/\s/g, '-')}">${complaint.status}</span></span>
        </div>
        <div class="info-row">
            <span class="info-label">Assigned To:</span>
            <span class="info-value">${complaint.assigned_to || 'Not Assigned'}</span>
        </div>
        <div class="description">
            <h4>Complaint Details:</h4>
            <p>${complaint.complaint_description}</p>
        </div>
        ${complaint.remarks ? `
        <div class="description" style="border-left-color: #10b981; margin-top: 10px;">
            <h4>Remarks:</h4>
            <p>${complaint.remarks}</p>
        </div>
        ` : ''}
        <div class="footer">
            <p>Generated: ${new Date().toLocaleDateString()} | Colony Complaints System</p>
            <p style="margin-top: 5px;">Please keep this receipt for your records</p>
        </div>
    </div>
</body>
</html>`;
}

function generateBatchHTML(complaints) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const slipsHTML = complaints.map(c => `
        <div class="slip">
            <div class="slip-header">
                <span class="slip-id">#${String(c.id).padStart(4, '0')}</span>
                <span class="slip-title">COMPLAINT RECEIPT</span>
            </div>
            <div class="slip-row"><span>Date:</span><span>${formatDate(c.date)}</span></div>
            <div class="slip-row"><span>Flat:</span><span>${c.flat_number}</span></div>
            <div class="slip-row"><span>Contact:</span><span>${c.contact_number || 'N/A'}</span></div>
            <div class="slip-row"><span>Trade:</span><span>${c.trade_type}</span></div>
            <div class="slip-row"><span>Status:</span><span class="status-${c.status.toLowerCase().replace(/\s/g, '-')}">${c.status}</span></div>
            <div class="slip-desc">${c.complaint_description.substring(0, 50)}${c.complaint_description.length > 50 ? '...' : ''}</div>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 10mm; background: white; }
        .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #333; }
        .header h1 { font-size: 18px; color: #333; }
        .header p { font-size: 12px; color: #666; margin-top: 5px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .slip { border: 1.5px solid #333; padding: 10px; border-radius: 4px; font-size: 10px; }
        .slip-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #4f46e5; padding-bottom: 5px; margin-bottom: 8px; }
        .slip-id { background: #4f46e5; color: white; padding: 2px 8px; border-radius: 10px; font-weight: bold; }
        .slip-title { color: #4f46e5; font-weight: 600; font-size: 11px; }
        .slip-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #ddd; font-size: 9px; }
        .slip-row span:first-child { font-weight: 600; color: #555; }
        .status-pending { color: #92400e; }
        .status-in-progress { color: #1e40af; }
        .status-completed { color: #065f46; }
        .slip-desc { background: #f8fafc; padding: 5px; border-radius: 3px; margin-top: 5px; font-size: 8px; border-left: 2px solid #4f46e5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Colony Complaints - Batch Receipts</h1>
        <p>Total: ${complaints.length} complaints | Generated: ${new Date().toLocaleString()}</p>
    </div>
    <div class="grid">
        ${slipsHTML}
    </div>
</body>
</html>`;
}

function generateReportHTML(title, complaints, summary) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const summaryHTML = summary ? `
        <div class="summary">
            <h3>Summary by Trade & Status</h3>
            <table class="summary-table">
                <thead>
                    <tr><th>Trade</th><th>Status</th><th>Count</th></tr>
                </thead>
                <tbody>
                    ${summary.map(s => `<tr><td>${s.trade_type}</td><td>${s.status}</td><td>${s.count}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
    ` : '';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 15mm; background: white; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #4f46e5; }
        .header h1 { color: #4f46e5; font-size: 22px; margin-bottom: 5px; }
        .header p { color: #666; font-size: 12px; }
        .summary { margin-bottom: 25px; }
        .summary h3 { color: #333; margin-bottom: 10px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8fafc; font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-inprogress { background: #dbeafe; color: #1e40af; }
        .badge-completed { background: #d1fae5; color: #065f46; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏘️ ${title}</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
    ${summaryHTML}
    <div class="details">
        <h3 style="margin-bottom: 10px; font-size: 14px;">Complaint Details</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>House/Qtr No.</th>
                    <th>Trade</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                </tr>
            </thead>
            <tbody>
                ${complaints.map(c => `
                    <tr>
                        <td>#${c.id}</td>
                        <td>${formatDate(c.date)}</td>
                        <td>${c.flat_number}</td>
                        <td>${c.trade_type}</td>
                        <td>${c.complaint_description.substring(0, 40)}${c.complaint_description.length > 40 ? '...' : ''}</td>
                        <td><span class="badge badge-${c.status.toLowerCase().replace(/\s/g, '')}">${c.status}</span></td>
                        <td>${c.assigned_to || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    <div class="footer">
        <p>Colony Complaints Management System | Total: ${complaints.length} complaints</p>
    </div>
</body>
</html>`;
}

// Export for use as module (Electron)
module.exports = { app, db, startServer, createBackup };

// Backup function
function createBackup() {
    try {
        // Ensure backup directory exists
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Create backup with date
        const date = new Date().toISOString().split('T')[0];
        const backupPath = path.join(backupDir, `complaints-backup-${date}.db`);

        // Copy database file
        fs.copyFileSync(dbPath, backupPath);
        console.log(`Backup created: ${backupPath}`);

        // Delete backups older than 7 days
        const files = fs.readdirSync(backupDir);
        const now = Date.now();
        const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

        files.forEach(file => {
            if (file.startsWith('complaints-backup-') && file.endsWith('.db')) {
                const filePath = path.join(backupDir, file);
                const stats = fs.statSync(filePath);
                if (stats.mtimeMs < sevenDaysAgo) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted old backup: ${file}`);
                }
            }
        });
    } catch (error) {
        console.error('Backup failed:', error.message);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down...');
    createBackup();
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('Shutting down...');
    createBackup();
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    });
});

// Start server function (for programmatic use)
function startServer(port = PORT) {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            resolve(server);
        });
    });
}

// Auto-start if run directly (not imported)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
