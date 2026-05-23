import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js'

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middleware
const clientOrigins = ((process.env.CLIENT_URL || process.env.CLIENT_URLS || "") + "")
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

const allowedLocalOrigins = [
  ...clientOrigins,
  "http://localhost:5173",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5175"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedLocalOrigins.includes(origin) || /^https?:\/\/localhost:\d+$/.test(origin) || /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); 

app.use(express.json());

// --- ROUTES ---
// We use '/api/auth' as the auth base.
// If auth.js has router.post('/login'), the URL is http://localhost:5000/api/auth/login
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: "Server is running", status: "ok" });
});

// DATABASE CONNECTION
const dbUrl = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb+srv://oyinloyepeter273_db_user:MRWRi3C4xA5wzHaJ@cluster0.kp6khjh.mongodb.net/dashboard_db?appName=Cluster0';

mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 5000;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
})
  .then(() => {
    console.log("✅ DB Connected Successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});
