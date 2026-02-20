const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./complaints.db');

console.log('Deleting all sample complaints...');

db.run('DELETE FROM complaints', function(err) {
    if (err) {
        console.error('Error deleting complaints:', err.message);
    } else {
        console.log(`Successfully deleted ${this.changes} complaints`);

        // Reset auto-increment counter
        db.run('DELETE FROM sqlite_sequence WHERE name="complaints"', (err) => {
            if (err) {
                console.error('Error resetting counter:', err.message);
            } else {
                console.log('ID counter reset to 1');
            }
            db.close();
        });
    }
});
