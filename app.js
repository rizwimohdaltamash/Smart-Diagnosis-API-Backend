const express = require("express");
const cors = require("cors");

const diagnosisRoutes = require("./routes/diagnosisRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Smart Diagnosis API is running",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/", diagnosisRoutes);

module.exports = app;
