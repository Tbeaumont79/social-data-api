import dotenv from "dotenv";
import express from "express";
import apiRoutes from "./routes/api";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", apiRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
