require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Customer = require("./models/customer");
const orderRoutes = require("./routes/orderRoutes"); 
const paymentRoutes = require("./routes/paymentRoutes"); 


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("✅ Connected to MongoDB"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err));

const router = express.Router();

// ✅ Registration Endpoint
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({ name, email, phone, password: hashedPassword });

    await newCustomer.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// ✅ Login Endpoint (Fixed)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Login Attempt:", email);

    const user = await Customer.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET is missing in .env file");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Login successful, token generated");
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});



// ✅ Use router with correct API prefix
app.use("/api/auth", router);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
