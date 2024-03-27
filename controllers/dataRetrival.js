/**
 * @swagger
 * /retrieveData:
 *   get:
 *     summary: Retrieve data from a public API.
 *     description: Retrieve data from a public API and optionally filter it by category.
 *     parameters:
 *       - in: query
 *         name: category
 *         description: Optional category filter.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Optional limit for the number of results.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Retrieved data successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PublicApiEntry'
 *       400:
 *         description: Invalid limit parameter.
 *       404:
 *         description: No entries found for the specified category.
 *       500:
 *         description: Internal server error.
 */
async function retrieveData(req, res) {
  try {
    // Fetch data from the public API
    const response = await fetch("https://api.publicapis.org/entries");
    const data = await response.json();

    // Extract filtering options from query parameters
    const { category, limit } = req.query;

    // Filter data based on category if provided
    let filteredData = data.entries;
    if (category) {
      const lowercaseCategory = category.toLowerCase();
      filteredData = filteredData.filter(
        (entry) => entry.Category.toLowerCase() === lowercaseCategory
      );
      if (filteredData.length === 0) {
        return res
          .status(404)
          .json({ message: `No entries found for category '${category}'` });
      }
    }

    // Set default limit if not provided
    const parsedLimit = limit ? parseInt(limit) : filteredData.length;

    // Validate limit parameter
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({ message: "Invalid limit parameter" });
    }

    // Limit the number of results
    filteredData = filteredData.slice(0, parsedLimit);

    // Send the filtered data as response
    res.json(filteredData);
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { retrieveData };
