const express = require('express');
const cookieParser = require('cookie-parser');
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
const connectDB = require('./db');
const config = require('./config');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

connectDB()
  .then(() => {
    console.log('Database connected.');
  })
  .catch((err) => {
    console.error('Database connection failure.', err);
  });

// Authentication and User Management
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Contract/Tender Management
app.use('/api/vendor', vendorRoutes);
app.use('/api/tender', tenderRoutes);
app.use('/api/milestone', milRoutes);
app.use('/api/bid', bidRoutes);
app.use('/api/dispute', disRoutes);

// Payment and Rating
app.use('/api/payment', paymentRoutes);
app.use('/api/rating', rateRoutes);

// Notifications
app.use('/api/notification', notiRoutes);

const port = config.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});