/**
 * @swagger
 * /limitAccess:
 *   get:
 *     summary: Allows only authenticated users.
 *     description: Limit access to a secure zone. Access to this endpoint may be restricted based on user permissions.
 *     responses:
 *       200:
 *         description: Successfully accessed the secure zone.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hola!! you've made it to secure zone.
 *       500:
 *         description: Internal server error.
 */

async function limitAccess(req, res) {
  try {
    res.status(200).json({ messsage: "Hola!! you've made it to secure zone." });
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { limitAccess };
