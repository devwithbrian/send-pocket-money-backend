# 💸 Send Pocket Money – Backend (Node, Express and MongoDB)

This is the **Node.js + Express backend** of the **Send Pocket Money** application.  
It exposes REST APIs for sending money, fetching exchange rates, and managing transactions.

---

## 🚀 Features
- Manage transactions stored in MongoDB.
- Calculate and apply transfer fees.
- Provide live or mock exchange rates.
- JWT-based authentication & cookie sessions.
- API endpoints with validation & error handling.

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication
- CORS + dotenv
- Optional: Axios (if using external FX APIs)

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devwithbrian/send-pocket-money-backend.git
   cd send-pocket-money-backend
2. Install dependencies:
   npm install
3. Create a .env file in the project root:
   # Server
   PORT=4000
   
   # Database
    MONGODB_URI=mongodb://localhost:27017/send_pocket_money
    
   # Security
   JWT_SECRET=your_jwt_secret_key_here
   COOKIE_SECRET=your_cookie_secret_key_here

   ### Notes on the above
   PORT: Port for the backend server (default 4000).

   MONGODB_URI: Connection string for MongoDB.

   JWT_SECRET: Secret used to sign JWTs for authentication.

   COOKIE_SECRET: Secret used to sign and secure cookies.
4. Start the server:
   npm run dev
The backend runs on http://localhost:4000.

📂 API Endpoints
🔹 Rates

GET /api/rates
Returns exchange rates for GBP and ZAR.

Example response:
{
  "GBP": 0.79,
  "ZAR": 18.25
}

🔹 Transactions

POST /api/transactions
Create a new transaction.
Request:
{
  "recipientName": "John Doe",
  "note": "Happy Birthday",
  "currency": "GBP",
  "amountUSD_cents": 10000
}

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
npm test

