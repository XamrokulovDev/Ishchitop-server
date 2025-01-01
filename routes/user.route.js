const { Router } = require("express");
const router = Router();
const {
  register,
  login,
  users,
  logout,
  updateUsername,
  updatePassword,
  updateAvatar,
  deleteAvatar,
} = require("../controllers/user.controller");
const { protect, admin } = require("../middlewares/auth");
const upload = require("../utils/fileUpload");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication operations
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the user
 *             email:
 *               type: string
 *               description: The email address of the user
 *             password:
 *               type: string
 *               description: The password of the user
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 */
router.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: Login credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email of the user
 *             password:
 *               type: string
 *               description: The password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid login credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       403:
 *         description: Forbidden, admin access required
 */
router.get("/users", protect, admin, users);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized, invalid token
 */
router.post("/logout", protect, logout);

/**
 * @swagger
 * /api/v1/auth/username/{id}:
 *   patch:
 *     summary: Update a user's username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: body
 *         name: username
 *         required: true
 *         description: New username
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       400:
 *         description: Invalid data
 */
router.patch("/username/:id", protect, updateUsername);

/**
 * @swagger
 * /api/v1/auth/password/{id}:
 *   patch:
 *     summary: Update a user's password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: body
 *         name: password
 *         required: true
 *         description: New password
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid data
 */
router.patch("/password/:id", protect, updatePassword);

/**
 * @swagger
 * /api/v1/auth/create/avatar/{id}:
 *   patch:
 *     summary: Update a user's avatar
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: avatar
 *         required: true
 *         description: New avatar file
 *         type: file
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid data
 */
router.patch("/create/avatar/:id", protect, upload.single("avatar"), updateAvatar);

/**
 * @swagger
 * /api/v1/auth/delete/avatar/{id}:
 *   delete:
 *     summary: Delete a user's avatar
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *       400:
 *         description: Invalid data
 */
router.delete("/delete/avatar/:id", protect, deleteAvatar);

module.exports = router;