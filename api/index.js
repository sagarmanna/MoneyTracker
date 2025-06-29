const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Transaction = require('./models/Transaction'); // Ensure this model exists
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Check if .env is correctly configured
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is missing from .env file");
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000, // fail fast
})
  .then(() => {
    console.log("✅ MongoDB connected");

    // ✅ Start server only after DB is connected
    app.listen(3001, () => {
      console.log("✅ Server running on http://localhost:3001");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ✅ Test Route
app.get('/api/test', (req, res) => {
  res.json({ body: 'API working ✅' });
});

// ✅ Add new transaction
app.post('/api/transaction', async (req, res) => {
  try {
    const { name, description, datetime, price } = req.body;

    console.log("📦 Incoming transaction:", req.body);

    if (!price || typeof price !== 'number' || isNaN(price)) {
      return res.status(400).json({ error: "Invalid price" });
    }

    const transaction = await Transaction.create({
      name,
      description,
      datetime,
      price,
    });

    res.json(transaction);
  } catch (error) {
    console.error("❌ POST error:", error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all transactions
app.get('/api/transaction', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("❌ GET error:", error.message);
    res.status(500).json({ error: 'Server error' });
  }
});
