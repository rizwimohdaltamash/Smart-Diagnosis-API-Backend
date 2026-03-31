const mongoose = require("mongoose");

const diagnosisItemSchema = new mongoose.Schema(
  {
    condition: { type: String, required: true, trim: true },
    probability: { type: String, required: true, trim: true },
    next_steps: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const diagnosisHistorySchema = new mongoose.Schema(
  {
    symptoms: { type: String, required: true, trim: true },
    diagnosis: { type: [diagnosisItemSchema], required: true },
    aiResponse: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DiagnosisHistory", diagnosisHistorySchema);
