const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const LostpetRoutes = require('./Router/LostPet'); // Import pet routes
const FoundpetRoutes = require('./Router/FoundPets'); // Import pet routes
const usersRoutes = require('./Router/user');
const rewardRoutes = require('./Router/Reward');
const cookieParser = require("cookie-parser");
 // Import pet routes
dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cookieParser());//
app.use(express.json()); // JSON body parsing
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Rate Limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max requests per IP
    message: { error: "Too many requests, please try again later." },
});

app.use(limiter); // Apply rate limiter

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/Lostpets', LostpetRoutes); // Use pet routes
app.use('/api/Foundpets', FoundpetRoutes ); // Use pet routes
app.use('/api/users', usersRoutes); // Use pet routes
app.use('/api/', rewardRoutes ); // Use pet routes

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to PetsFinder API 🚀');
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
