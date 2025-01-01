const express = require('express');
const router = express.Router();
const { 
    getAds, 
    getAdsById, 
    createAds, 
    updateAds, 
    deleteAds, 
    getMyAds 
} = require('../controllers/ads.controller');
const { protect } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Advertisement management operations
 */

/**
 * @swagger
 * /api/v1/ads:
 *   get:
 *     summary: Get all ads
 *     tags: [Ads]
 *     responses:
 *       200:
 *         description: List of ads
 *       404:
 *         description: Ads not found
 */
router.get('/', getAds);

/**
 * @swagger
 * /api/v1/ads/{id}:
 *   get:
 *     summary: Get a single ad by ID
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the ad to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad details
 *       404:
 *         description: Ad not found
 */
router.get('/:id', getAdsById);

/**
 * @swagger
 * /api/v1/ads/create:
 *   post:
 *     summary: Create a new ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ad created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', protect, createAds);

/**
 * @swagger
 * /api/v1/ads/update/{id}:
 *   put:
 *     summary: Update an ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the ad to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ad updated successfully
 *       404:
 *         description: Ad not found
 */
router.put('/update/:id', protect, updateAds);

/**
 * @swagger
 * /api/v1/ads/delete/{id}:
 *   delete:
 *     summary: Delete an ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the ad to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad deleted successfully
 *       404:
 *         description: Ad not found
 */
router.delete('/delete/:id', protect, deleteAds);

/**
 * @swagger
 * /api/v1/ads/my:
 *   get:
 *     summary: Get all ads created by the logged-in user
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's ads
 *       404:
 *         description: No ads found
 */
router.get('/my', protect, getMyAds);

module.exports = router;