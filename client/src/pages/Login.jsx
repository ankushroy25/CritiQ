import "./UserLogin.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import { useStateAuth } from "../context/StateProvider";
const Login = () => {
  const navigate = useNavigate();
  const { walletAddress, walletConnected, connectWallet, companyLogin } =
    useStateAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await companyLogin();
    navigate("/company");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col parent_login_cont">
        <div className="login-container1">
          <div>
            <h2 className="form-title1">Welcome Back</h2>
            <p>Please sign in to your account</p>
          </div>
          <form className="login-form1" onSubmit={handleSubmit}>
            <div className="form-group1">
              {!walletConnected ? (
                <>
                  <button
                    type="button"
                    className="wallet-button1"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </button>
                  <div></div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2.5vh",
                  }}
                >
                  <button className="wallet-button1">Connect Wallet</button>
                  <p className="text-green-500">{walletAddress}</p>
                </div>
              )}
            </div>
            <div className="form-group1">
              <label htmlFor="walletAddress">
                Don&apos;t have an account yet?{" "}
                <Link to="/company/register">
                  <u className="text-white-600"> Sign Up</u>
                </Link>
              </label>
            </div>
            <div className="form-group1">
              <button
                type="submit"
                className={`login-button1 ${
                  walletConnected ? "" : "disabled1"
                }`}
                disabled={!walletConnected}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
