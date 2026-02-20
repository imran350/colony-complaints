const pngToIco = require('png-to-ico');
const fs = require('fs');

console.log('Creating new icon from icon-256.png...');

(async () => {
    try {
        const buf = await pngToIco('icon-256.png');
        fs.writeFileSync('icon-new.ico', buf);
        console.log('New icon created: icon-new.ico');
        console.log('Now replacing old icon...');

        // Backup old icon
        if (fs.existsSync('icon.ico')) {
            fs.renameSync('icon.ico', 'icon-old.ico');
            console.log('Old icon backed up as icon-old.ico');
        }

        // Replace with new icon
        fs.renameSync('icon-new.ico', 'icon.ico');
        console.log('Icon replaced successfully!');
        console.log('Please rebuild the Electron app: npm run build-win-portable');
    } catch (err) {
        console.error('Error creating icon:', err);
    }
})();
