const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin
let serviceAccount;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        console.log('Attempting to load Firebase credentials from FIREBASE_SERVICE_ACCOUNT_BASE64...');
        // Production: Decode base64 string
        const buffer = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64');
        serviceAccount = JSON.parse(buffer.toString('utf-8'));
        console.log('Successfully loaded Firebase credentials from environment variable.');
    } else {
        // Development: Load from file
        console.log('Attempting to load Firebase credentials from serviceAccountKey.json...');
        serviceAccount = require('../serviceAccountKey.json');
        console.log('Successfully loaded Firebase credentials from file.');
    }
} catch (error) {
    console.error('CRITICAL ERROR: Failed to load Firebase credentials.');
    console.error('Error details:', error.message);
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        console.error('Hint: Check if FIREBASE_SERVICE_ACCOUNT_BASE64 is a valid Base64 encoded JSON string.');
    } else {
        console.error('Hint: Ensure serviceAccountKey.json exists in the server directory or FIREBASE_SERVICE_ACCOUNT_BASE64 is set.');
    }
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify Firebase token
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Find user by email (since we are syncing)
            // Or ideally, we should store firebase UID in our DB.
            // For migration, let's look up by email first, if found, update UID?
            // Or just look up by email.

            let user = await User.findOne({ email: decodedToken.email });

            if (!user) {
                // If user doesn't exist in our DB but has valid firebase token,
                // it might be a new user or a sync issue.
                // We can create a basic user record here if needed, or fail.
                // But for 'protect', we usually expect the user to exist.
                // However, with the new flow, 'me' might be called to create the user.
                // Let's attach the decoded token info to req.user_firebase for the route handler to use if needed.
                req.firebaseUser = decodedToken;
            } else {
                req.user = user;
            }

            req.firebaseUser = decodedToken; // Always attach firebase info

            next();
        } catch (err) {
            console.error('Auth Error:', err);
            res.status(401).json({ success: false, error: 'Not authorized, token failed', details: err.message });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

module.exports = { protect };
