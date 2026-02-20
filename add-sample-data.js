const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./complaints.db');

const sampleComplaints = [
    {
        date: '2025-02-15',
        resident_name: 'Resident - A-101',
        flat_number: 'A-101',
        contact_number: '03001234567',
        trade_type: 'Plumber',
        complaint_description: 'Tanki leak ho rahi hai, bathroom mein pani tapak raha hai',
        status: 'Pending',
        assigned_to: 'Ustaad Ahmad',
        remarks: 'Kal visit karenge'
    },
    {
        date: '2025-02-16',
        resident_name: 'Resident - B-205',
        flat_number: 'B-205',
        contact_number: '03019876543',
        trade_type: 'Electrician',
        complaint_description: 'Fan chal nahi raha, light bhi flicker ho rahi hai',
        status: 'In Progress',
        assigned_to: 'Ali Electrician',
        remarks: 'Parts ki zarurat hai'
    },
    {
        date: '2025-02-14',
        resident_name: 'Resident - C-302',
        flat_number: 'C-302',
        contact_number: '03123456789',
        trade_type: 'Painter',
        complaint_description: 'Dewar ka paint utar raha hai, dobara paint karna hai',
        status: 'Completed',
        assigned_to: 'Nadeem Painter',
        remarks: 'Kaam mukammal ho gaya'
    },
    {
        date: '2025-02-17',
        resident_name: 'Resident - A-205',
        flat_number: 'A-205',
        contact_number: '03211234567',
        trade_type: 'Carpenter',
        complaint_description: 'Darwaza band nahi ho raha, handle bhi toot gaya hai',
        status: 'Pending',
        assigned_to: 'Nawaz Carpenter',
        remarks: null
    },
    {
        date: '2025-02-13',
        resident_name: 'Resident - D-105',
        flat_number: 'D-105',
        contact_number: '03331234567',
        trade_type: 'Sewerage',
        complaint_description: 'Sewerage line block hai, gandagi wapas aa rahi hai',
        status: 'In Progress',
        assigned_to: 'Municipal Staff',
        remarks: 'Tanker bheja jayega'
    }
];

console.log('Adding sample complaints...');

const stmt = db.prepare(`INSERT INTO complaints (date, resident_name, flat_number, contact_number, trade_type, complaint_description, status, assigned_to, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

sampleComplaints.forEach((c, i) => {
    stmt.run(c.date, c.resident_name, c.flat_number, c.contact_number, c.trade_type, c.complaint_description, c.status, c.assigned_to, c.remarks, (err) => {
        if (err) {
            console.error('Error adding complaint', i+1, err.message);
        } else {
            console.log('Complaint', i+1, 'added successfully');
        }
    });
});

stmt.finalize(() => {
    console.log('All sample complaints added!');
    db.close();
});
