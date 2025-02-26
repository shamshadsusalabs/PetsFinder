require('dotenv').config(); 
const User = require('../Schema/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// ✅ Validation Rules
exports.validateSignup = [
    check("name", "Name is required").notEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("contactNumber", "Contact Number is required").notEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
 
];

exports.validateLogin = [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").notEmpty()
];

// ✅ User Signup
exports.signup = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, email, contactNumber, profilePic, password, type } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, contactNumber, profilePic, password: hashedPassword, type });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ User Login
const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "Strict"
};

// ✅ User Login with Token Cookies
exports.login = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // ✅ Generate Tokens
        const accessToken = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // ✅ Save refreshToken in DB
        user.refreshToken = refreshToken;
        await user.save();

        // ✅ Set Cookies
        const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 min
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

        // ✅ Send response with tokens
        res.status(200).json({ 
            message: "Login successful", 
            id: user._id, 
            accessToken, 
            refreshToken,
            type: user.type
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ Refresh Token using Cookies
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // ✅ Read from cookies
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token Required" });

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Invalid Refresh Token" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

            const newAccessToken = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, { expiresIn: "15m" });

            // ✅ Update access token in cookies
            const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
            res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

            // ✅ Send response with new token
            res.status(200).json({ 
                message: "Access token refreshed", 
                accessToken: newAccessToken 
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ Logout & Clear Cookies
exports.logout = async (req, res) => {
    // ✅ Extract refreshToken from params, query, body, headers, or cookies
    const refreshToken =
        req.params.refreshToken ||
        req.query.refreshToken ||
        req.body.refreshToken ||
        req.headers["x-refresh-token"] ||
        req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "Refresh Token Required" });

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Invalid Refresh Token" });

        await User.findByIdAndUpdate(user._id, { refreshToken: null }); // ✅ Remove from DB

        // ✅ Clear Cookies (if coming from cookies)
        const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        console.log("🔵 Received request at /updateprofile");
        console.log("🟡 Request Body:", req.body);
        console.log("🛡️ Authenticated User ID:", req.user?.id);

        const { name, email, contactNumber, profilePic, password } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            console.error("❌ User ID missing in request");
            return res.status(400).json({ message: "User ID is required" });
        }

        console.log("🔄 Fetching user from database...");
        let user = await User.findById(userId);
        if (!user) {
            console.error("❌ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ **Email Update Handling**
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                console.error("❌ Email already in use");
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
            console.log("📧 Email updated:", email);
        }

        // ✅ **Password Update Handling**
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
            console.log("🔑 Password updated (hashed)");
        }

        // ✅ **Other Fields Update**
        user.name = name || user.name;
        user.contactNumber = contactNumber || user.contactNumber;
        user.profilePic = profilePic || user.profilePic;

        // ✅ **Save the Updated User**
        await user.save();

        console.log("✅ User updated successfully:", user);
        
        // ✅ **Return Updated Data (Without `createdAt`)**
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            contactNumber: user.contactNumber,
            profilePic: user.profilePic,
            type: user.type,
            updatedAt: user.updatedAt
        });

    } catch (error) {
        console.error("❌ Error in updateProfile:", error.message);
        res.status(500).json({ error: error.message });
    }
};




// ✅ Get User by ID
// ✅ Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -refreshToken"); // 🔹 पासवर्ड और टोकन हटाएं
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

