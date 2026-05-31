// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Min 8 chars, 1 uppercase, 1 lowercase, 1 number

// export const validateSignup = (req, res, next) => {
//   const { firstName, lastName, email, password } = req.body;

//   if (!firstName || firstName.trim().length < 2) {
//     return res.status(400).json({ message: "First name must be at least 2 characters" });
//   }

//   if (!lastName || lastName.trim().length < 2) {
//     return res.status(400).json({ message: "Last name must be at least 2 characters" });
//   }

//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ message: "Invalid email format" });
//   }

//   if (!passwordRegex.test(password)) {
//     return res.status(400).json({ 
//       message: "Password must be at least 8 characters with uppercase, lowercase, and number" 
//     });
//   }

//   next();
// };

export const validateSignup = (req, res, next) => {
  let { firstName, lastName, name, email, password } = req.body;

  // Handle case where frontend sends a single 'name' field instead of split names
  if (name && typeof name === 'string' && !firstName && !lastName) {
    const parts = name.trim().split(/\s+/); // Split by spaces
    firstName = parts[0];
    lastName = parts.slice(1).join(' '); // Recombine the rest as the last name
  }

  // Fallback to empty strings to guarantee .trim() never throws a TypeError
  firstName = firstName || '';
  lastName = lastName || '';
  email = email || '';
  password = password || '';

  // Validation checks
  if (firstName.trim().length < 2) {
    return res.status(400).json({ message: "First name must be at least 2 characters" });
  }

  if (lastName.trim().length < 2) {
    return res.status(400).json({ message: "Last name must be at least 2 characters" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: "Password must be at least 8 characters with uppercase, lowercase, and number" 
    });
  }

  next();
};


export const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Identifier and password are required" });
  }

  // if (!emailRegex.test(identifier)) {
  //   return res.status(400).json({ message: "Invalid email format" });
  // }

  next();
};
