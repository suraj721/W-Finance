const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    amount: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        required: [true, 'Please add a date or timeframe']
    },
    type: {
        type: String,
        enum: ['bill', 'rent', 'insight', 'subscription', 'other'],
        default: 'bill'
    },
    color: {
        type: String,
        enum: ['primary', 'secondary', 'accent'],
        default: 'accent'
    },
    text: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
