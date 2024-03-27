const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");

// Maintain a blacklist of invalidated tokens
const tokenBlacklist = new Set();
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user with a unique email and hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registration successful.
 *       400:
 *         description: User with the same email already exists.
 *       500:
 *         description: Internal server error.
 */
async function userRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    // Hash the user's password before saving it to the database.
    const hash = await bcrypt.hash(password, 10); // Use a stronger salt factor.

    // Check if a user with the given email already exists in the database.
    const isExisting = await userModel.findOne({ email });

    if (isExisting) {
      // User with the same email already exists, return an error.
      res.status(400).json({ message: "User already exists, please login" });
    } else {
      // Create a new user document with the hashed password.
      const newUser = new userModel({ name, email, password: hash });
      await newUser.save();

      // User registration successful.
      res.status(201).json({ message: "New user registered" });
    }
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login with existing credentials.
 *     description: Login with existing user credentials to obtain a JWT token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials or wrong password.
 *       500:
 *         description: Internal server error.
 */
async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by their email in the database.
    const user = await userModel.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database.
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        // Create a JWT token for the user's successful login.
        const token = jwt.sign(
          { userID: user._id, role: user.role },
          "secret",
          {
            expiresIn: "1h", // Token expiration time (e.g., 1 hour)
          }
        );

        // Successful login, return a token.
        res.json({ message: "Logged in", token: token });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout from the application.
 *     description: Invalidate the user's JWT token to log them out from the application.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized or no token provided.
 *       500:
 *         description: Internal server error.
 */
async function userLogout(req, res) {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Add the token to the blacklist
    tokenBlacklist.add(token);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// Middleware function to check token validity before processing requests
function checkTokenValidity(req, res, next) {
  const token = req.headers.authorization;

  if (!token || tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Token is valid, proceed with the request
  next();
}

module.exports = { userRegister, userLogin, userLogout, checkTokenValidity };
