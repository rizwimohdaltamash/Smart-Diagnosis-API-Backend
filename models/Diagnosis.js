const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
  symptoms: {
    type: String,
    required: true,
    trim: true,
  },
  result: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Diagnosis", diagnosisSchema);
