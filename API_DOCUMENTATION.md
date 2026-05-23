# Dashboard Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. User Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "redirect": "/user-dashboard"
}
```

**Errors:**
- 400: `{ "message": "User not found" }`
- 400: `{ "message": "Invalid credentials" }`
- 403: `{ "message": "Use admin login instead" }`

---

### 2. Admin Login
**POST** `/auth/admin-login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin_id_here",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "redirect": "/admin-dashboard"
}
```

**Errors:**
- 400: `{ "message": "Admin not found" }`
- 400: `{ "message": "Invalid credentials" }`
- 403: `{ "message": "Not an admin account" }`

---

### 3. Get Current User Info
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "_id": "user_id_here",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2026-04-22T10:00:00.000Z",
  "updatedAt": "2026-04-22T10:00:00.000Z"
}
```

**Errors:**
- 401: `{ "message": "No token provided" }`
- 401: `{ "message": "Invalid or expired token" }`

---

## 👨‍💼 Admin Endpoints

### 1. Create User (Admin Only)
**POST** `/admin/create-user`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 201):**
```json
{
  "message": "User created successfully!",
  "user": {
    "id": "new_user_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

**Errors:**
- 400: `{ "message": "User already exists with this email" }`
- 400: `{ "message": "First name must be at least 2 characters" }`
- 400: `{ "message": "Password must be at least 8 characters with uppercase, lowercase, and number" }`
- 401: `{ "message": "No token provided" }`
- 403: `{ "message": "Access denied. Admin privileges required." }`

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### 2. Get All Users (Admin Only)
**GET** `/admin/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (Success - 200):**
```json
{
  "message": "Users retrieved successfully",
  "count": 5,
  "users": [
    {
      "_id": "user_id_1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-04-22T10:00:00.000Z"
    },
    {
      "_id": "user_id_2",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2026-04-22T10:05:00.000Z"
    }
  ]
}
```

**Errors:**
- 401: `{ "message": "No token provided" }`
- 403: `{ "message": "Access denied. Admin privileges required." }`

---

### 3. Update User (Admin Only)
**PUT** `/admin/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Updated",
  "email": "john.updated@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Updated",
    "email": "john.updated@example.com",
    "role": "user"
  }
}
```

**Errors:**
- 404: `{ "message": "User not found" }`
- 401/403: Authentication/Authorization errors

---

### 4. Delete User (Admin Only)
**DELETE** `/admin/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (Success - 200):**
```json
{
  "message": "User deleted successfully"
}
```

**Errors:**
- 404: `{ "message": "User not found" }`
- 401/403: Authentication/Authorization errors

---

## 🏥 Health Check

### Server Status
**GET** `/health`

**Response (Success - 200):**
```json
{
  "message": "Server is running",
  "status": "ok"
}
```

---

## 📋 How to Use Token

After login, store the token in localStorage or sessionStorage:

```javascript
// After successful login
const { token } = response.data;
localStorage.setItem('authToken', token);

// For subsequent requests
const headers = {
  Authorization: `Bearer ${token}`
};

// Example: Get current user
fetch('http://localhost:5000/api/auth/me', {
  headers
})
```

---

## 🔄 Flow Diagram

```
1. User opens app
   ├─ If not logged in → Show Login/Admin-Login page
   └─ If logged in → Check role from token

2. User Login:
   POST /api/auth/login → Get token + redirect to /user-dashboard

3. Admin Login:
   POST /api/auth/admin-login → Get token + redirect to /admin-dashboard

4. Admin Dashboard:
   - GET /api/admin/users → List all users
   - POST /api/admin/create-user → Create new user
   - PUT /api/admin/users/:id → Update user
   - DELETE /api/admin/users/:id → Delete user

5. User Dashboard:
   - GET /api/auth/me → Get user profile
```

---

## ⚠️ Important Notes

- **Token Expiration:** Tokens expire in 7 days
- **Password Policy:** Passwords are hashed with bcrypt (salt rounds: 10)
- **Email Validation:** Must be valid email format
- **Role-Based Access:** Admin endpoints reject non-admin tokens
- **CORS:** Enabled (adjust in `server.js` if needed)

---

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test endpoints using Postman/Insomnia**

3. **Setup first admin user:**
   - Add directly to MongoDB with `role: "admin"`
   - Or ask backend developer to help

4. **Connect frontend:**
   - Store tokens securely
   - Include Authorization header for protected routes
   - Handle token expiration

---
