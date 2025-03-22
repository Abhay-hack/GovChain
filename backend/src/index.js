// backend/src/index.js
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db');
const config = require('./config');

// Routes
const vendorRoutes = require('./routes/vendorRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notiRoutes = require('./routes/notificationRoutes');
const rateRoutes = require('./routes/ratingRoutes');
const milRoutes = require('./routes/milestoneRoutes');
const bidRoutes = require('./routes/bidRoutes');
const disRoutes = require('./routes/disputeRoutes');

const app = express();
const server = http.createServer(app);

// CORS configuration for Express
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Explicitly allow credentials
  optionsSuccessStatus: 200, // Handle preflight OPTIONS requests
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Explicitly handle OPTIONS requests (for preflight)
app.options('*', cors(corsOptions));

// Socket.io with matching CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Database Connection
connectDB()
  .then(() => console.log('Database connected.'))
  .catch((err) => console.error('Database connection failure:', err));

// Routes (Adjusted for frontend consistency)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/tender', tenderRoutes);
app.use('/api/milestone', milRoutes);
app.use('/api/bid', bidRoutes);
app.use('/api/dispute', disRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ratings', rateRoutes);
app.use('/api/notification', notiRoutes);

// Socket.io with Debugging
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.emit('newAlert', 'Welcome to GovChain!');
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  socket.on('error', (err) => console.error('Socket.io error:', err));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.url}:`, err.stack);
  res.status(500).send('Something broke!');
});

const port = config.port || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});