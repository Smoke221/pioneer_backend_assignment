const express = require("express");
const { limitAccess } = require("../controllers/secureEndpoint");
const { checkTokenValidity } = require("../controllers/user");

const secureRouter = express.Router();

secureRouter.get("/data", checkTokenValidity, limitAccess);

module.exports = { secureRouter };
