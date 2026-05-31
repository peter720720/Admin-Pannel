import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import LoginLog from '../models/LoginLog.js'; // Ensure you created this model!

// User Login
export const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    // Search for user by email OR username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) return res.status(400).json({ message: "Account not found" });
    if (user.role === 'admin') return res.status(403).json({ message: "Please use admin login" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // --- SAVE LOGIN ACTIVITY TO DATABASE ---
    const loginActivity = new LoginLog({
      userId: user._id,
      email: user.email,
      loginTime: new Date(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    await loginActivity.save(); 
    // ---------------------------------------

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: "Login successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        accountNumber: user.accountNumber,
        balance: user.balance,
        role: user.role,
        transactions: user.transactions || []
      },
      redirect: '/user-dashboard'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (user) {
      console.log("User found in DB:", user.email, "Role:", user.role);
    } else {
      console.log("No user found in DB with identifier:", identifier);
    }

    if (!user) return res.status(400).json({ message: "Admin not found" });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Not an admin account. Current role: " + user.role });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: "Admin login successful", token, user });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // This will now include the balance because it's in your Model
    const user = await User.findById(req.user.id).select('-password'); 
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "User data retrieved",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        accountNumber: user.accountNumber,
        balance: user.balance,
        role: user.role,
        transactions: user.transactions || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

