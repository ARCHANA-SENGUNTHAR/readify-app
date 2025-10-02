require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const textRoutes = require('./routes/text'); // ✅ import text routes

const app = express();
app.use(express.json());

// allow frontend origin
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/texts', textRoutes); // ✅ register text routes here

// root healthcheck
app.get('/', (req, res) => res.send('Radify backend running'));

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
