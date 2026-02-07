const express = require("express");
const { randomUUID } = require("crypto");
const { getDb } = require("../db/mongo");

const router = express.Router();

router.post("/session/start", async (req, res) => {
  try {
    const db = getDb();
    const sessionId = "sess_" + randomUUID();

    await db.collection("sessions").insertOne({
      _id: sessionId,
      done: false,
      answers: {},
      createdAt: new Date()
    });

    return res.json({
      sessionId,
      done: false
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "FAILED_TO_START_SESSION" });
  }
});

module.exports = router;