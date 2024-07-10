import { useEffect, useState } from "react";
import axios from "axios";
// import { create } from "@web3-storage/w3up-client";
import "./Signup.css"; // Import your CSS file
import { Link } from "react-router-dom";
import Navbar from "../Landing/Navbar";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name:"",
    companyEmail: "",
    walletAddress: "",
  });
  const [otp, setOtp] = useState("");
  const [real, setReal] = useState();
  const [ver, setVer] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("sg",token)
    if (token != null) {
      alert("You are already logged in");
      window.location.href = "/home";
    }
  }, []);
  const sendOTP = async () => {
    try {
      const { companyEmail } = formData;
      const generateOTP = Math.floor(1000 + Math.random() * 9000);
      setReal(generateOTP);
      const response = await axios.post("https://critiqall-backend.onrender.com/sendOTP", {
        otp: generateOTP,
        email: companyEmail,
      });
      console.log(response.data);

      setVer(false);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const verify = async () => {
    try {
      if (otp != real) {
        alert("OTP is incorrect");
        return;
      } else {
        setVer(true);
        alert("OTP is correct");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    setVer(false);
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setFormData({ ...formData, walletAddress: accounts[0] });
        alert("Wallet connected successfully");
      } catch (error) {
        alert("Failed to connect wallet");
      }
    } else {
      alert("Please install Metamask");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ver) {
      alert("Please connect your wallet first., and verify OTP");
      return;
    }
    const { name, companyEmail, walletAddress } = formData;
    try {
      const dataToSend = {
        name,
        companyEmail,
        walletAddress,
      };

      // Example POST request using axios
      const response = await axios.post(
        "https://critiqall-backend.onrender.com/customer/create",
        dataToSend
      );
      console.log(response.data); // Handle response as needed

      if (response.data.message == "Signup successful!") {
        alert(response.data.message);
        window.location.href = "/userlogin";
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // Handle error state or display an error message
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="signup-form-container">
        <h2 className="form-title">Signup</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">
              Name:
              </label>
            <input
              type="text"
              id="companyName"
              className="form-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyEmail" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="companyEmail"
              className="form-input"
              value={formData.companyEmail}
              onChange={(e) =>
                setFormData({ ...formData, companyEmail: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="wallet-button"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          </div>
          {formData.walletAddress != "" ? (
            <div className="form-group">
              Wallet Address: {formData.walletAddress}{" "}
            </div>
          ) : null}
          <div className="form-group">
            <label htmlFor="walletAddress" className="form-label">
              OTP
            </label>
            <input
              className="form-input"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              style={{ marginTop: "5vh" }}
              className="submit-button"
              onClick={sendOTP}
            >
              Send OTP
            </button>{" "}
            &nbsp;
            <button className="submit-button" onClick={verify}>
              Verify
            </button>
          </div>
          {ver ? (
            <div className="form-group" style={{ color: "lime" }}>
              You are verified
            </div>
          ) : (
            <div className="form-group" style={{ color: "red" }}>
              You are not verified
            </div>
          )}

          <div className="form-group">
            <label htmlFor="walletAddress">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "green" }}>
                Click here
              </Link>
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserSignup;
