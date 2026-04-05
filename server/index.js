const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config({ path: './.env' });

const app = express();

// Connect to database
console.log('Starting server...');
console.log('Environment Check:');
console.log('- PORT:', process.env.PORT || '5000 (default)');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'MISSING');
console.log('- FIREBASE_SERVICE_ACCOUNT_BASE64:', process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ? 'Set' : 'MISSING');

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const transactions = require('./routes/transactions');
const auth = require('./routes/auth');
const reminders = require('./routes/reminders');

app.use('/api/transactions', transactions);
app.use('/api/auth', auth);
app.use('/api/reminders', reminders);

// Serve frontend appropriately for any unmatched routes 
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
