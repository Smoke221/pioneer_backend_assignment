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
