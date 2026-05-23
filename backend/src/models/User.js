import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  accountNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: () => Math.floor(1000000000 + Math.random() * 9000000000).toString()
  },
  password: { 
    type: String, 
    required: true 
  }, // Hashed version for secure login
  plainPassword: { 
    type: String 
  }, // Plain version for Admin to see/give to user
  balance: { 
    type: Number, 
    default: 0 
  }, // The user's account balance
  transactions: [
    {
      date: { type: Date, default: Date.now },
      type: { type: String, enum: ['Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Refund'], default: 'Deposit' },
      amount: { type: Number, required: true },
      description: { type: String, default: '' },
      reference: { type: String, default: '' },
      account: { type: String, default: '' }
    }
  ],
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, { timestamps: true });

// Exporting the model as 'User'
export default mongoose.model('User', userSchema);



// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   username: { type: String, unique: true, sparse: true },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ['user', 'admin'], 
//     default: 'user' 
//   }
// }, { timestamps: true });