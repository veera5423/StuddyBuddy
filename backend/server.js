const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const adminRoutes = require('./routes/admin');

// Initialize Supabase clients
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  console.log('Supabase client initialized with anon key');
} else {
  console.log('Supabase not configured - missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Supabase admin client initialized with service role key');
} else {
  console.log('Supabase admin not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FrontEndURL // Adjust as needed for your frontend
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Please ensure MongoDB is running and MONGODB_URI is correct');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the StudyBuddy API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});