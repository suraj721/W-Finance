const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @desc    Import transactions
// @route   POST /api/transactions/import
// @access  Private
router.post('/import', protect, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const transactions = req.body;

        if (!Array.isArray(transactions)) {
            return res.status(400).json({
                success: false,
                error: 'Data must be an array of transactions'
            });
        }

        const userTransactions = transactions.map((transaction) => ({
            text: transaction.text,
            amount: transaction.amount,
            user: req.user.id
        }));

        const createdTransactions = await Transaction.insertMany(userTransactions);

        return res.status(201).json({
            success: true,
            count: createdTransactions.length,
            data: createdTransactions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const { text, amount } = req.body;
        const transaction = await Transaction.create({
            text,
            amount,
            user: req.user.id
        });

        return res.status(201).json({
            success: true,
            data: transaction
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

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        await transaction.deleteOne();

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
