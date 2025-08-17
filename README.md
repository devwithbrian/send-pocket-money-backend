# 💸 Send Pocket Money – Backend (Node, Express and MongoDB)

This is the **Node.js + Express backend** of the **Send Pocket Money** application.  
It exposes REST APIs for registering and logging in users, sending money, fetching exchange rates, and managing transactions.

---

## 🚀 Features
- Manage transactions stored in MongoDB.
- Calculate and apply transfer fees.
- Provide live exchange rates from the FX rates API.
- JWT-based authentication & cookie sessions.
- API endpoints with validation & error handling.

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication
- CORS + dotenv

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devwithbrian/send-pocket-money-backend.git
   cd send-pocket-money-backend
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the project root:
   # Server
   `PORT=4000`
   
   # Database
    `MONGODB_URI=mongodb://localhost:27017/send_pocket_money`
    
   # Security
   `JWT_SECRET=your_jwt_secret_key_here
   COOKIE_SECRET=your_cookie_secret_key_here`

   ### Notes on the above
   `PORT: Port for the backend server (default 4000).`

   `MONGODB_URI: Connection string for MongoDB.`

   `JWT_SECRET: Secret used to sign JWTs for authentication.`

   `COOKIE_SECRET: Secret used to sign and secure cookies.`
4. Start the server:
   ```bash
   npm run dev 

The backend runs on http://localhost:4000.

📂 API Endpoints

🔹 CSRF Token

GET `/api/auth/csrf`

Generates a random CSRF token, sets it in a cookie, and also returns it in the response body.

The cookie is named csrf.

Token expires after 2 hours.


Example response:

{
  "token": "kf83j9x2b9m1ysr1e1x9"
}

🔹 Current User

GET `/api/auth/me`

Returns the currently logged-in user’s basic info, if a valid access token is found in cookies.

If no token or invalid token → returns { "user": null }.

If valid → returns user’s _id, name, and email.


Example response (logged in):

{
  "user": {
    "_id": "64d1f9a2e5b3f0a123456789",
    "name": "Brian",
    "email": "brian@example.com"
  }
}

Example response (not logged in):

{
  "user": null
}

🔹 Register

POST `/api/auth/register` 

Registers a new user and logs them in immediately.
 
 
- Requires `name`, `email`, and `password` in the request body.
 
- Email must be valid, password must be at least 8 characters.
 
- If registration is successful, sets an authentication cookie and returns the new user’s info.
 

 
Example request:

 `{   "name": "Brian",   "email": "brian@example.com",   "password": "mypassword123" } ` 

Example response (201 Created):

 `{   "user": {     "_id": "64d1f9a2e5b3f0a123456789",     "name": "Brian",     "email": "brian@example.com"   } } ` 

Example error response:

 `{ "message": "Email already registered" } ` 
 
🔹 Login 

POST `/api/auth/login` 

Logs in an existing user.
 
 
- Requires `email` and `password` in the request body.
 
- On success, sets an authentication cookie and returns the user’s info.
 
- On failure (invalid credentials), returns an error.
 

 
Example request:

 `{   "email": "brian@example.com",   "password": "mypassword123" } ` 
**Example response:**
 `{   "user": {     "_id": "64d1f9a2e5b3f0a123456789",     "name": "Brian",     "email": "brian@example.com"   } } ` 

Example error response:

 `{ "message": "Invalid credentials" } `  

🔹 Logout

POST `/api/auth/logout` 

Logs the user out by clearing the authentication cookie.
 
 
- Requires a valid CSRF token (must be sent in the `X-CSRF-Token` header, and match the `csrf` cookie).
 
- On success, returns a confirmation message.
 

 
Example request headers:

 `X-CSRF-Token: abc123csrf ` 

Example response:

 `{ "message": "Logged out successfully" } ` 

Example error response:
 `{ "message": "CSRF token invalid" } ` 

🔹 Rates

GET `/api/rates`

Returns exchange rates for GBP and ZAR.

Example response:
{
  "GBP": 0.79,
  "ZAR": 18.25
}

🔹 Transactions

POST `/api/transactions`

Create a new transaction.

Request:
{
  "recipientName": "John Doe",
  "note": "Happy Birthday",
  "currency": "GBP",
  "amountUSD_cents": 10000
}

Response: 
{
  "status": "success",
  "id": "64a9c1234abcd"
}

GET /api/transactions?page=1&pageSize=5

Fetch paginated transaction history.

Response:

{
  "items": [
    {
      "_id": "64a9c1234abcd",
      "recipientName": "John Doe",
      "currency": "GBP",
      "amountUSD": 100.00,
      "feeUSD": 10.00,
      "fxRate": 0.79,
      "amountRecipientMinor": 7100,
      "status": "completed",
      "createdAt": "2025-08-15T08:00:00Z"
    }
  ],
  "page": 1,
  "total": 25
}

🧪 Testing
```bash
npm test

