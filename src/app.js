require("dotenv").config();
const express = require("express");
const cors = require("cors");

const healthRouter = require("./routes/health");
const { connectMongo } = require("./db/mongo");

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});