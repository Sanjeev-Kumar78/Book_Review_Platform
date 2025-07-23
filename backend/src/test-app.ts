import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Simple test server" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
