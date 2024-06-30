const User = require("../models/User.js");

const createComapny = async (req, res) => {
  const {
    companyName,
    companyEmail,
    companyLogoUrl,
    companyDescription,
    walletAddress,
  } = req.body;
  console.log(req.body);
  try {
    const newUser = new User({
      name: companyName,
      email: companyEmail,
      imageUrl: companyLogoUrl,
      description: companyDescription,
      walletAddress: walletAddress,
      type: "company",
    });

    await newUser.save();
    res.status(200).json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginCompany = async (req, res) => {
  console.log(req.body);
  console.log(req.body.walletAddress);
  const wallet = req.body.walletAddress;
  try {
    const user = await User.findOne({ walletAddress: wallet });
    console.log(user);
    if (user) {
      res.status(200).json({ message: "Login successful!", user });
    } else {
      res
        .status(401)
        .json({ message: "Wallet address not found. Please sign up first." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createComapny, loginCompany };
