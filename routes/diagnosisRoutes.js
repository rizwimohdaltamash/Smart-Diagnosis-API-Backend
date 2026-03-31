const express = require("express");
const {
  diagnoseSymptoms,
  getHistory,
  deleteHistory,
} = require("../controllers/diagnosisController");

const router = express.Router();

router.post("/diagnose", diagnoseSymptoms);
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistory);

module.exports = router;
