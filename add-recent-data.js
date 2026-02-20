const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./complaints.db');

const recentComplaints = [
    {
        date: '2026-02-20',
        resident_name: 'Resident - A-101',
        flat_number: 'A-101',
        contact_number: '03001234567',
        trade_type: 'Plumber',
        complaint_description: 'Tap leak ho raha hai',
        status: 'Pending',
        assigned_to: null,
        remarks: null
    },
    {
        date: '2026-02-20',
        resident_name: 'Resident - B-205',
        flat_number: 'B-205',
        contact_number: '03019876543',
        trade_type: 'Electrician',
        complaint_description: 'Light nahi chal rahi',
        status: 'In Progress',
        assigned_to: 'Ali Electrician',
        remarks: 'Kaam jari hai'
    },
    {
        date: '2026-02-20',
        resident_name: 'Resident - C-302',
        flat_number: 'C-302',
        contact_number: '03123456789',
        trade_type: 'Carpenter',
        complaint_description: 'Darwaza repair karna hai',
        status: 'Pending',
        assigned_to: null,
        remarks: null
    },
    {
        date: '2026-02-19',
        resident_name: 'Resident - D-105',
        flat_number: 'D-105',
        contact_number: '03331234567',
        trade_type: 'Painter',
        complaint_description: 'Wall paint karwana hai',
        status: 'Completed',
        assigned_to: 'Nadeem Painter',
        remarks: 'Kaam mukammal'
    },
    {
        date: '2026-02-18',
        resident_name: 'Resident - E-203',
        flat_number: 'E-203',
        contact_number: '03441234567',
        trade_type: 'Sweeper',
        complaint_description: 'Safai karwani hai',
        status: 'Completed',
        assigned_to: 'Cleaning Staff',
        remarks: 'Done'
    },
    {
        date: '2026-02-17',
        resident_name: 'Resident - A-304',
        flat_number: 'A-304',
        contact_number: '03551234567',
        trade_type: 'Mason',
        complaint_description: 'Tiles repair',
        status: 'In Progress',
        assigned_to: 'Iqbal Mason',
        remarks: 'Kaam chal raha hai'
    },
    {
        date: '2026-02-16',
        resident_name: 'Resident - B-401',
        flat_number: 'B-401',
        contact_number: '03661234567',
        trade_type: 'Gardener',
        complaint_description: 'Garden trimming',
        status: 'Completed',
        assigned_to: 'Garden Staff',
        remarks: 'Complete'
    },
    {
        date: '2026-02-15',
        resident_name: 'Resident - C-501',
        flat_number: 'C-501',
        contact_number: '03771234567',
        trade_type: 'Plumber',
        complaint_description: 'Pipe burst',
        status: 'Completed',
        assigned_to: 'Ustaad Ahmad',
        remarks: 'Fixed'
    }
];

console.log('Adding recent complaints for this week...');

const stmt = db.prepare(`INSERT INTO complaints (date, resident_name, flat_number, contact_number, trade_type, complaint_description, status, assigned_to, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

let count = 0;
recentComplaints.forEach((c, i) => {
    stmt.run(c.date, c.resident_name, c.flat_number, c.contact_number, c.trade_type, c.complaint_description, c.status, c.assigned_to, c.remarks, (err) => {
        if (err) {
            console.error('Error adding complaint', i+1, ':', err.message);
        } else {
            count++;
            console.log('Complaint', i+1, 'added -', c.date);
        }
    });
});

stmt.finalize(() => {
    console.log(`\nTotal ${count} recent complaints added!`);
    console.log('Today (2026-02-20): 3 complaints');
    console.log('This week: 8 complaints');
    db.close();
});
