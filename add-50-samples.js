const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./complaints.db');

const trades = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Sweeper', 'Mason', 'Gardener', 'Sewerage'];
const statuses = ['Pending', 'In Progress', 'Completed'];
const workers = {
    'Plumber': ['Ustaad Ahmad', 'Rashid Plumber', 'Saleem'],
    'Electrician': ['Ali Electrician', 'Kamran', 'Bilal'],
    'Carpenter': ['Nawaz Carpenter', 'Akram', 'Farooq'],
    'Painter': ['Nadeem Painter', 'Asif', 'Zahid'],
    'Sweeper': ['Cleaning Staff', 'Jameel', 'Nasir'],
    'Mason': ['Ghulam Hussain', 'Iqbal Mason', 'Rafiq'],
    'Gardener': ['Garden Staff', 'Bashir', 'Munir'],
    'Sewerage': ['Municipal Staff', 'Sanitation Team', 'Drainage Staff']
};

const complaints = {
    'Plumber': [
        'Tanki leak ho rahi hai, bathroom mein pani tapak raha hai',
        'Pipe burst ho gaya hai, pani waste ho raha hai',
        'Tap se pani nahi aa raha, pressure kam hai',
        'Washroom ka flush kharab hai',
        'Kitchen sink block hai, pani nahi ja raha',
        'Geyser leak kar raha hai',
        'Bathroom ka drain slow hai'
    ],
    'Electrician': [
        'Fan chal nahi raha, light bhi flicker ho rahi hai',
        'Main switch trip ho raha hai bar bar',
        'AC kharab hai, cooling nahi ho rahi',
        'Geyser ka switch kharab hai',
        'Bedroom ki light nahi chal rahi',
        'Doorbell kaam nahi kar rahi',
        'Socket loose hai, khatre ka khatra hai'
    ],
    'Carpenter': [
        'Darwaza band nahi ho raha, handle bhi toot gaya hai',
        'Almari ka darwaza gir gaya hai',
        'Kitchen cabinet ka hinge toot gaya',
        'Window properly band nahi ho rahi',
        'Bed ki patti toot gayi hai',
        'Shoe rack repair karwani hai',
        'Darwaze mein awaaz aa rahi hai'
    ],
    'Painter': [
        'Dewar ka paint utar raha hai, dobara paint karna hai',
        'Ceiling pe damp spots hain',
        'Bathroom ki walls pe fungus lag gaya',
        'Balcony ki railing ka paint utar gaya',
        'Main door paint karwana hai',
        'Bedroom walls touch up chahiye',
        'Kitchen tiles ke beech paint karna hai'
    ],
    'Sweeper': [
        'Ghar ke bahar safai nahi hui',
        'Stairs pe kachra para hai',
        'Parking area ganda hai',
        'Lift mein safai ki zarurat hai',
        'Common area mein cobwebs hain',
        'Balcony safai karwani hai',
        'Terrace pe leaves jama hain'
    ],
    'Mason': [
        'Bathroom ki tiles toot gayi hain',
        'Kitchen counter repair karna hai',
        'Balcony mein seepage aa rahi hai',
        'Wall mein crack aa gayi hai',
        'Floor tiles loose ho gayi hain',
        'Ceiling se plaster gir raha hai',
        'Bathroom waterproofing karwani hai'
    ],
    'Gardener': [
        'Garden mein grass bahut barh gayi hai',
        'Plants ko pani nahi mil raha',
        'Lawn mein weeds bahut hain',
        'Hedge trimming karwani hai',
        'Flower beds clean karne hain',
        'Trees ki pruning chahiye',
        'Garden path pe leaves hain'
    ],
    'Sewerage': [
        'Sewerage line block hai, gandagi wapas aa rahi hai',
        'Manhole overflow ho raha hai',
        'Bathroom se bad smell aa rahi hai',
        'Drainage system slow hai',
        'Gutter clean karwana hai',
        'Septic tank full ho gaya hai',
        'Sewerage pipe leak kar raha hai'
    ]
};

const flats = [];
for (let block of ['A', 'B', 'C', 'D', 'E']) {
    for (let floor = 1; floor <= 5; floor++) {
        for (let unit = 1; unit <= 4; unit++) {
            flats.push(`${block}-${floor}0${unit}`);
        }
    }
}

function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const sampleComplaints = [];
const startDate = new Date('2025-02-01');
const endDate = new Date('2026-02-19');

for (let i = 0; i < 50; i++) {
    const trade = getRandomItem(trades);
    const status = getRandomItem(statuses);
    const flat = getRandomItem(flats);
    const contact = '0300' + Math.floor(1000000 + Math.random() * 9000000);

    sampleComplaints.push({
        date: getRandomDate(startDate, endDate),
        resident_name: `Resident - ${flat}`,
        flat_number: flat,
        contact_number: contact,
        trade_type: trade,
        complaint_description: getRandomItem(complaints[trade]),
        status: status,
        assigned_to: status === 'Pending' ? null : getRandomItem(workers[trade]),
        remarks: status === 'Completed' ? 'Kaam mukammal ho gaya' : (status === 'In Progress' ? 'Kaam jari hai' : null)
    });
}

console.log('Adding 50 sample complaints...');

const stmt = db.prepare(`INSERT INTO complaints (date, resident_name, flat_number, contact_number, trade_type, complaint_description, status, assigned_to, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

let count = 0;
sampleComplaints.forEach((c, i) => {
    stmt.run(c.date, c.resident_name, c.flat_number, c.contact_number, c.trade_type, c.complaint_description, c.status, c.assigned_to, c.remarks, (err) => {
        if (err) {
            console.error('Error adding complaint', i+1, ':', err.message);
        } else {
            count++;
            console.log('Complaint', i+1, 'added successfully');
        }
    });
});

stmt.finalize(() => {
    console.log(`\nTotal ${count} sample complaints added successfully!`);
    db.close();
});
