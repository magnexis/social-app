const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const supabase = require("../supabase");



const router = express.Router();



router.post("/register", async (req, res) => {

  const { username, email, password } = req.body;



  if (!username || !email || !password) {

    return res.status(400).json({ error: "Missing fields" });

  }



  const password_hash = await bcrypt.hash(password, 10);



  const { data, error } = await supabase

    .from("users")

    .insert([{ username, email, password_hash }]);



  if (error) {

    return res.status(400).json({ error: error.message });

  }



  const token = jwt.sign(

    { username, email },

    process.env.JWT_SECRET,

    { expiresIn: "7d" }

  );



  res.json({ message: "User created", token });

});



module.exports = router;

