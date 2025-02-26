const express = require("express");
const router = express.Router();
const userController = require("../Controller/user");
const { uploadImage } = require('../Middileware/multer');
const  authMiddleware  = require('../Middileware/authMiddileWare');
// ✅ Routes
router.post('/signup', uploadImage, userController.validateSignup, userController.signup);

router.post("/login", userController.validateLogin, userController.login);
router.post("/refresh-token", userController.refreshToken);
router.post("/logout", userController.logout);
router.put("/update-profile",authMiddleware, userController.updateProfile);
 router.get("/getById/:id",  authMiddleware ,userController.getUserById);
module.exports = router;
