import "./UserLogin.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import { useStateAuth } from "../context/StateProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
//import Link from "next/link"

function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
const UserLogin = () => {
  const navigate = useNavigate();
  const { walletAddress, walletConnected, connectWallet, userLogin } =
    useStateAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await userLogin();
    navigate("/home");
  };

  return (
    <>
     <Navbar />
    <div className="flex flex-col parent_login_cont">
     
      <div className="login-container1">
        <div style={{
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
        }}>
        <h2 className="form-title1">Welcome Back</h2>
        <p>Please sign in to your account</p>
        </div>
        <form className="login-form1" onSubmit={handleSubmit}>
          <div className="form-group1">
            <button
              type="button"
              className="wallet-button1"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
            <div className="wallet-message1">{walletAddress}</div>
          </div>
          <div className="form-group1">
            <label htmlFor="walletAddress">
              Don&apos;t have an account yet?{" "}
              <Link to="/register">
                <u className="text-white-600"> Sign Up</u>
              </Link>
            </label>
          </div>
          <button
              type="submit"
              className={`login-button1 ${walletConnected ? "" : "disabled1"}`}
              disabled={!walletConnected}
            >
              Login
            </button>
        </form>
      </div>
      </div>
    </>

    // <>
    //   <Card className="bg-[#0c1f32] w-full max-w-md mx-auto">
    //   <CardHeader>
    //     <CardTitle className="text-yellow-50">Welcome back!</CardTitle>
    //     <CardDescription>Please sign in to your account.</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <form className="space-y-4">
    //       <Button variant="outline" className="w-full bg-[#3b74b5]" onClick={(e)=>{e.prevent.default();connectWallet();}}>
    //         <WalletIcon className="mr-2 h-4 w-4 " />
    //         Connect Wallet
    //       </Button>
    //       <div className="flex flex-col items-center justify-center text-yellow-50">
    //       <div className="wallet-message">{walletAddress}</div>
    //         <p className="text-sm text-muted-foreground">
    //           Don&apos;t have an account yet?{" "}
    //           <Link href="#" className="font-medium underline" prefetch={false}>
    //             Sign up
    //           </Link>
    //         </p>
    //         <Button type="submit" className="bg-[#215188] ml-auto" onClick={(e)=>{
    //           e.prevent.default();
    //           handleSubmit();}} disabled={!walletConnected}>
    //           Sign in
    //         </Button>
    //       </div>
    //     </form>
    //   </CardContent>
    // </Card> 
    // </>
    // </div>
  );
};

export default UserLogin;
