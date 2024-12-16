import dotenv from "dotenv";
import express from "express";
import api from "./routes/api";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", api);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
