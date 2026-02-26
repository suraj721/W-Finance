const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');

try {
    if (!fs.existsSync(keyPath)) {
        console.error('Error: serviceAccountKey.json not found in server directory!');
        process.exit(1);
    }

    const keyContent = fs.readFileSync(keyPath, 'utf8');
    const base64Key = Buffer.from(keyContent).toString('base64');

    console.log('\n=== COPY THE STRING BELOW FOR RENDER ENVIRONMENT VARIABLE ===\n');
    console.log(base64Key);
    console.log('\n===========================================================\n');
    console.log('Variable Name: FIREBASE_SERVICE_ACCOUNT_BASE64');
    console.log('Value: (The long string printed above)');
} catch (error) {
    console.error('Error generating base64 key:', error);
}
