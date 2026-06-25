const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");

const router = express.Router();

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a digit";
  return null;
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  let password_hash;
  try {
    password_hash = await bcrypt.hash(password, 10);
  } catch (err) {
    console.error("bcrypt error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password_hash }]);

  if (error) {
    console.error("DB error:", error);
    return res.status(400).json({ error: "Registration failed" });
  }

  const token = jwt.sign(
    { username, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "User created", token });
});

module.exports = router;