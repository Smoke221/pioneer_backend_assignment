const express = require("express");
const { retrieveBal } = require("../controllers/ethereumController");

const ethereumRouter = express.Router();

ethereumRouter.post("/balance", retrieveBal)

module.exports = { ethereumRouter };
