require("dotenv").config();

const express = require("express");

const cors = require("cors");



const authRoutes = require("./routes/auth");



const app = express();

const PORT = 5000;



app.use(cors());

app.use(express.json()); 



app.use("/auth", authRoutes);



app.get("/health", (req, res) => {

  res.json({ status: "ok" });

});



app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);});
