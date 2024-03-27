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
