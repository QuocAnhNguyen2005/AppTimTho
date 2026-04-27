const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const workerRoutes = require('./routes/workers');
app.use('/api/workers', workerRoutes);

const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('API Tìm Thợ đang chạy...');
});

app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
