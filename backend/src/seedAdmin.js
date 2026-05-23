// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import User from './models/User.js'; 
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config(); 
// console.log("Testing URI:", process.env.MONGO_URI);

// const seedAdmin = async () => {
//   try {
//     const mongoUri = process.env.MONGO_URI;
//     if (!mongoUri) throw new Error("MONGO_URI not found in .env file one level up");

//     await mongoose.connect(mongoUri);
//     console.log("Connected to MongoDB...");
    
//     const hashedPassword = await bcrypt.hash('admin123', 10);
    
//     await User.findOneAndUpdate(
//       { email: 'admin@mybank.com' },
//       {
//         firstName: 'Main',
//         lastName: 'Admin',
//         password: hashedPassword,
//         role: 'admin'
//       },
//       { upsert: true, new: true }
//     );

//     console.log('✅ Admin is ready! Email: admin@mybank.com | Pass: admin123');
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     process.exit(1);
//   }
// };

// seedAdmin();


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js'; 
import dotenv from 'dotenv';
import path from 'path';

// Force look for .env in the root folder
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not found!");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB...");
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // We use findOneAndUpdate with upsert: true to FORCE create/update the admin
    const admin = await User.findOneAndUpdate(
      { email: 'admin@mybank.com' },
      {
        firstName: 'Main',
        lastName: 'Admin',
        email: 'admin@mybank.com',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin is ready! Email: admin@mybank.com | Pass: admin123');
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
