const Diagnosis = require("../models/Diagnosis");
const mongoose = require("mongoose");
const { getAIDiagnosis } = require("../services/groqService");

const diagnoseSymptoms = async (req, res) => {
  try {
    const symptoms = String(req.body.symptoms || "").trim();

    if (!symptoms) {
      return res.status(400).json({
        message: "symptoms is required",
      });
    }

    const result = await getAIDiagnosis(symptoms);

    const savedDiagnosis = await Diagnosis.create({
      symptoms,
      result,
    });

    return res.status(200).json({
      diagnosis: savedDiagnosis.result.diagnosis,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate diagnosis",
      error: error.message,
    });
  }
};

const getHistory = async (_req, res) => {
  try {
    const history = await Diagnosis.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch diagnosis history",
      error: error.message,
    });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid history ID",
      });
    }

    const deletedItem = await Diagnosis.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "History record not found",
      });
    }

    return res.status(200).json({
      message: "History record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete history record",
      error: error.message,
    });
  }
};

module.exports = {
  diagnoseSymptoms,
  getHistory,
  deleteHistory,
};
