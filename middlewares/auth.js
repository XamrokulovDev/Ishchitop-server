const User = require("../models/user.model");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./async");
const jwt = require("jsonwebtoken");

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
});

exports.admin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorResponse("Is not admin", 401));
    }
    next();
});