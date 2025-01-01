const Ads = require("../models/ads.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc Get all ads
// @route GET /api/v1/ads
// @access Public
exports.getAds = asyncHandler(async (req, res, next) => {

    const ads = await Ads.find();

    if (!ads) {
        return next(new ErrorResponse("Ads not found", 404));
    }

    res.status(200).json({
        success: true,
        count: ads.length,
        data: ads,
    });
});

// @desc Get single ads
// @route GET /api/v1/ads/:id
// @access Public
exports.getAdsById = asyncHandler(async (req, res, next) => {

    const ads = await Ads.findById(req.params.id);

    if (!ads) {
        return next(new ErrorResponse("Ads not found", 404));
    }

    res.status(200).json({
        success: true,
        data: ads,
    });
});

// @desc Create ads
// @route POST /api/v1/ads/create
// @access Public
exports.createAds = asyncHandler(async (req, res, next) => {

    const { title, description, location, category, price } = req.body;

    if (!title || !description || !location || !category || !price) {
        return next(new ErrorResponse("Please enter all fields", 400));
    }

    if(!req.file){
        return next(new ErrorResponse("Please upload an image", 400));
    }
    const ads = await Ads.create({
        title,
        description,
        location,
        category,
        price,
        image: `/uploads/${req.file.filename}`,
        user: req.user.id
    });

    res.status(201).json({
        success: true,
        data: ads,
    });
});

// @desc Update ads
// @route PUT /api/v1/ads/:id
// @access Public
exports.updateAds = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const { title, description, location, category, price } = req.body;

    const ads = await Ads.findByIdAndUpdate(id,{
        title,
        description,
        location,
        category,
        price,
        image: `/uploads/${req.file.filename}`,
    }, {
        new: true,
        runValidators: true,
    });

    if (!ads) {
        return next(new ErrorResponse("Ads not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Ads updated successfully",
        data: ads,
    });
});

// @desc Delete ads
// @route DELETE /api/v1/ads/:id
// @access Public
exports.deleteAds = asyncHandler(async (req, res, next) => {
    const ads = await Ads.findByIdAndDelete(req.params.id);

    if (!ads) {
        return next(new ErrorResponse("Ads not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Ads deleted successfully",
    });
});

// @desc Get user's ads
// @route GET /api/v1/ads/my
// @access Private
exports.getMyAds = asyncHandler(async (req, res, next) => {
    const ads = await Ads.find({ user: req.user.id });

    if (!ads || ads.length === 0) {
        return next(new ErrorResponse("You have not created any ads", 404));
    }

    res.status(200).json({
        success: true,
        count: ads.length,
        data: ads,
    });
});