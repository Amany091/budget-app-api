const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    title : { type: String, required: true },
    amount : { type: Number, required: true },
    type : { type: String, required: true, enum: ['income', 'expense'] },
    category : { type: String, required: true, enum: ['salary', 'freelance', 'food', 'entertainment', 'investment', 'travel', 'other'] },
    date : { type: Date, required: true }
});

exports.Budget = mongoose.model('Budget', budgetSchema);