const express = require("express");
const { retrieveData } = require("../controllers/dataRetrival");

const apiDataRouter = express.Router();

apiDataRouter.get("/data", retrieveData);

module.exports = { apiDataRouter };
