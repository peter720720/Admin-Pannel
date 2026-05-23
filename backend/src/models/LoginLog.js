import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  loginTime: { type: Date, default: Date.now },
  ipAddress: String
});

export default mongoose.model('users_login', loginLogSchema);
