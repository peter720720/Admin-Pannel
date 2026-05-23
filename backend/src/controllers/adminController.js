import bcrypt from 'bcryptjs';
import User from '../models/User.js';


export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    
    // Hash the password for secure login
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword, // Secured version
      plainPassword: password,  // Admin-viewable version
      role: 'user'
    });

    await newUser.save();
    
    res.status(201).json({ 
      message: "User created successfully!", 
      user: {
        email: newUser.email,
        username: newUser.username,
        plainPassword: newUser.plainPassword // Send back to admin dashboard
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Get All Users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    // This finds all users and includes the plainPassword field
    const users = await User.find({ role: 'user' }); 
    
    res.json({
      message: "Users retrieved successfully",
      count: users.length,
      users // This now includes firstName, lastName, email, username, and plainPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update User (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin can update a user's balance
export const updateUserBalance = async (req, res) => {
  try {
    const { userId, newBalance } = req.body;

    // Find the user and update their balance
    const user = await User.findByIdAndUpdate(
      userId,
      { balance: newBalance },
      { new: true } // This returns the updated user data
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: `Balance updated for ${user.firstName}`,
      currentBalance: user.balance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateReference = (type) => {
  const prefix = type === 'add' ? 'DEP' : 'WDR';
  return `${prefix}-${Date.now().toString().slice(-10)}`;
};

// Admin can adjust a user's balance by adding or deducting an amount
export const adjustBalance = async (req, res) => {
  try {
    const { userId, amount, type, description } = req.body; // type is 'add' or 'deduct'
    
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const adjustment = type === 'add' ? numericAmount : -numericAmount;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transaction = {
      date: new Date(),
      type: type === 'add' ? 'Deposit' : 'Withdrawal',
      amount: type === 'add' ? numericAmount : -numericAmount,
      description: description || (type === 'add' ? 'Admin deposit' : 'Admin withdrawal'),
      reference: generateReference(type),
      account: user.accountNumber || user.email || 'MyBank Account'
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: adjustment }, $push: { transactions: transaction } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ 
      message: `Successfully ${type === 'add' ? 'deposited' : 'withdrew'} money`, 
      userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      newBalance: updatedUser.balance,
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
