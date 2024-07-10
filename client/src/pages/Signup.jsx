import { useEffect, useState } from "react";
import axios from "axios";
// import { create } from "@web3-storage/w3up-client";
import "./Signup.css"; // Import your CSS file
import Navbar from "../Landing/Navbar";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useStateAuth } from "../context/StateProvider";

const Signup = () => {
  const { userData } = useStateAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyLogo: null,
    companyDescription: "",
    walletAddress: "",
  });
  // useEffect(() => {
  //   console.log("comsg", userData);
  //   if (userData !== null) {
  //     toast.success("Logged in");
  //     localStorage.removeItem("token");
  //   //  window.location.href = "/company";
  //   }
  // }, [userData]);

  // const [client, setClient] = useState(null);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      companyLogo: e.target.files[0],
    });
  };

  const handleConnectWallet = async () => {
    // Implement wallet connection logic here (e.g., Metamask integration)
    // alert('Connect your blockchain wallet here');
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setFormData({ ...formData, walletAddress: accounts[0] });
        toast.success("Wallet connected successfully");
      } catch (error) {
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.warning("Please install Metamask");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyName, companyEmail, companyDescription, walletAddress } =
      formData;

    // try {
    //   if (!client) {
    //     const clientInstance = await create({ apiKey: process.env.REACT_APP_WEB3_STORAGE_API_KEY });
    //     setClient(clientInstance);
    //   }

    //   const file = new File([companyLogo], companyLogo.name);
    //   const cid = await client.put([file]);
    //   const companyLogoUrl = `https://w3s.link/ipfs/${cid}/${companyLogo.name}`;
    try {
      const companyLogoUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png";
      const dataToSend = {
        companyName,
        companyEmail,
        companyLogoUrl,
        companyDescription,
        walletAddress,
      };

      // Example POST request using axios
      const response = await axios.post(
        "https://critiqall-backend.onrender.com/api/users/signup",
        dataToSend
      );
      console.log(response); // Handle response as needed
      if (response.data.message == "Signup successful!") {
        toast.success(response.data.message);
        window.location.href = "/company";
      } else {
        toast.error("Something went wrong. Please try again.");
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
        <h2 className="form-title">Register as a Company</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName" className="text-gray-300">
              Company Name:
            </label>
            <input
              type="text"
              id="companyName"
              className="form-input"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyEmail" className="text-gray-300">
              Company Email:
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
            <label htmlFor="companyLogo" className="text-gray-300">
              Company Logo:
            </label>
            <input
              type="file"
              id="companyLogo"
              className="form-input"
              onChange={handleFileChange}
              accept=".png, .jpg, .jpeg"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyDescription" className="text-gray-300">
              Company Description:
            </label>
            <textarea
              id="companyDescription"
              className="form-input"
              value={formData.companyDescription}
              onChange={(e) =>
                setFormData({ ...formData, companyDescription: e.target.value })
              }
              rows="4"
              required
            />
          </div>

          {formData.walletAddress != "" ? (
            <span className="form-group text-gray-300">
              Wallet Address:
              <p className="text-green-300">{formData.walletAddress}</p>
            </span>
          ) : (
            <div className="form-group">
              <button
                type="button"
                className="wallet-button"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </button>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="walletAddress" className="flex items-center gap-2">
              <p>Already have an account? </p>
              <Link to="/company/login">
                <p className="underline underline-offset-2 text-green-600">
                  Click here
                </p>
              </Link>
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
