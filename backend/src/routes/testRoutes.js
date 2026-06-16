const express = require("express");
const { getTestResponse } = require("../controllers/testController");

const router = express.Router();

router.get("/connection", getTestResponse);

module.exports = router;
