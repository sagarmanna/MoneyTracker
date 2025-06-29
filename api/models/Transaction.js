const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  datetime: { type: Date, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
