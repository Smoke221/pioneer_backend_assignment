const { Web3 } = require("web3");
require("dotenv").config()

// Initialize web3 instance with provider (Infura)
const web3 = new Web3(
  `https://mainnet.infura.io/v3/${process.env.infura_key}`
);
/**
 * @swagger
 * /retrieveBal:
 *   get:
 *     summary: Retrieve Ethereum balance for a given address.
 *     description: Retrieve the Ethereum balance for a given address from the Ethereum blockchain.
 *     parameters:
 *       - in: query
 *         name: address
 *         description: Ethereum address for which to retrieve the balance.
 *         schema:
 *           type: string
 *           format: ethereum-address
 *     responses:
 *       200:
 *         description: Retrieved Ethereum balance successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *                   description: Balance in Wei.
 *                 balanceInEther:
 *                   type: number
 *                   format: float
 *                   description: Balance in Ether.
 *       400:
 *         description: Invalid Ethereum address provided.
 *       500:
 *         description: Internal server error.
 */
async function retrieveBal(req, res) {
  try {
    const { address } = req.query;

    // Validate Ethereum address format
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ message: "Invalid Ethereum address" });
    }

    // Fetch account balance from Ethereum blockchain
    const balance = await web3.eth.getBalance(address);

    // Convert balance from Wei to Ether
    const balanceInEther = parseFloat(web3.utils.fromWei(balance, "ether"));

    // Send balance as response
    res.json({ balance, balanceInEther});
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
module.exports = { retrieveBal };
