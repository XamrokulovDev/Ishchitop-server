const User = require("../models/user.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const MailService = require("../service/mail.service");
const uuid = require("uuid");

// @desc register user
// @route POST /api/v1/auth/register
// @access Private
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(new ErrorResponse("Please enter all fields", 400));
    }

    if (await User.findOne({ username })) {
        return next(new ErrorResponse("Username already exists", 400));
    }

    if (await User.findOne({ email })) {
        return next(new ErrorResponse("Email already exists", 400));
    }

    let role = "employee";
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        role = "admin";
    }

    const apiKey = uuid.v4();
    const user = await User.create({ username, email, password, apiKey, role });

    const mailService = new MailService();
    const otp = await mailService.sendOtp(email);
    user.otp = otp;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        data: user,
        token,
    });
});

// @desc login user
// @route POST /api/v1/auth/login
// @access Private
exports.login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorResponse("Please enter all fields", 400));
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    if (!(await user.matchPassword(password))) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({ 
        success: true, 
        data: user,
        token,
    });
});

// @desc logout user
// @route POST /api/v1/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.token = null;
    await user.save();

    res.status(200).json({ 
        success: true,
        message: "Logout successful"
    });
});

// @desc users
// @route GET /api/v1/auth/users
// @access Public
exports.users = asyncHandler(async (req, res, next) => {
    const user = await User.find();
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({ 
        success: true,
        count: user.length,
        data: user,
    });
});

// @desc update username
// @route PATCH /api/v1/auth/username/:id
// @access Private
exports.updateUsername = asyncHandler(async (req, res, next) => {
    const { username } = req.body;

    if (!username) {
        return next(new ErrorResponse("Please enter the new username", 400));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.username = username;
    await user.save();

    res.status(200).json({ 
        success: true,
        data: user,
    });
});

// @desc update password
// @route PATCH /api/v1/auth/password/:id
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;

    if (!password) {
        return next(new ErrorResponse("Please enter the new password", 400));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.password = password;
    await user.save();

    res.status(200).json({ 
        success: true,
        data: user,
    });
});

// @desc update avatar
// @route PATCH /api/v1/auth/avatar
// @access Private
exports.updateAvatar = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    if (!req.file) {
        return next(new ErrorResponse("Please upload an avatar image", 400));
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc delete avatar
// @route DELETE /api/v1/auth/avatar
// @access Private
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    if (!user.avatar) {
        return next(new ErrorResponse("User has no avatar", 400));
    }

    user.avatar = false;
    await user.save();

    res.status(200).json({
        success: true,
        data: user,
    });
});