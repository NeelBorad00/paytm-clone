const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/paytm-clone')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  walletBalance: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Routes
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Verify Token
app.get('/api/auth/verify', auth, (req, res) => {
  res.json({ user: req.user });
});

// Get Wallet Balance
app.get('/api/wallet/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance' });
  }
});

// Add Money
app.post('/api/wallet/add-money', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);
    
    user.walletBalance += amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      receiver: user._id,
      amount,
      type: 'credit',
      description: 'Added money to wallet'
    });
    await transaction.save();

    res.json({ message: 'Money added successfully', balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error adding money' });
  }
});

// Send Money
app.post('/api/wallet/send-money', auth, async (req, res) => {
  try {
    const { receiverPhone, amount, description } = req.body;
    
    // Find receiver
    const receiver = await User.findOne({ phoneNumber: receiverPhone });
    if (!receiver) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    // Check sender's balance
    const sender = await User.findById(req.user._id);
    if (sender.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update balances
    sender.walletBalance -= amount;
    receiver.walletBalance += amount;
    await sender.save();
    await receiver.save();

    // Create transaction records
    const senderTransaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'debit',
      description
    });

    const receiverTransaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'credit',
      description
    });

    await senderTransaction.save();
    await receiverTransaction.save();

    res.json({ message: 'Money sent successfully', balance: sender.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error sending money' });
  }
});

// Get Transactions
app.get('/api/wallet/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { sender: req.user._id, type: 'debit' },
        { receiver: req.user._id, type: 'credit' }
      ]
    }).sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 