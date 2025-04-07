# PayTM Clone - Digital Wallet Application

A full-stack digital wallet application inspired by PayTM, built with React, Node.js, and MongoDB.

## Features

- User Authentication (Register/Login)
- Wallet Management
- Send Money to Other Users
- Transaction History
- Real-time Balance Updates
- Responsive Design

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Router
- Axios
- Context API for State Management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/paytm-clone.git
cd paytm-clone
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start MongoDB service

4. Start the development servers:
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paytm-clone
JWT_SECRET=your_jwt_secret
```

## Project Structure

```
paytm-clone/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       └── App.js          # Main App component
│
└── server/                 # Node.js backend
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    └── index.js           # Server entry point
```

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/wallet/balance - Get wallet balance
- POST /api/wallet/add-money - Add money to wallet
- POST /api/wallet/send-money - Send money to another user
- GET /api/wallet/transactions - Get transaction history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React for the frontend framework 
