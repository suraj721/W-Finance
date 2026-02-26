const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/auth');

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id });

        return res.status(200).json({
            success: true,
            count: reminders.length,
            data: reminders
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @desc    Add reminder
// @route   POST /api/reminders
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const reminder = await Reminder.create(req.body);

        return res.status(201).json({
            success: true,
            data: reminder
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
});

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
    try {
        let reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                success: false,
                error: 'No reminder found'
            });
        }

        // Make sure user owns reminder
        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this reminder'
            });
        }

        reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                success: false,
                error: 'No reminder found'
            });
        }

        // Make sure user owns reminder
        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this reminder'
            });
        }

        await reminder.deleteOne();

        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;
