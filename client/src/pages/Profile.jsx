import React from "react";
import { useStateAuth } from "../context/StateProvider";
import axios from "axios";
import Mastercard from "../components/Mastercard";
import './Profile.css'
const Profile = () => {
  const { userData,fetchProfit } = useStateAuth();
 // console.log(userData);
  const [diam,setdiam]=React.useState(0);
  const [profit,setprofit]=React.useState(0);
  React.useEffect(() => {
    const getDiam=async()=>{
      const res=await axios.get("https://critiqall-backend.onrender.com/getbalance",{params:{pkey:userData.pkey}})
      console.log(res);
      setdiam(((Number)(res.data.balance)).toFixed(1));
      var d=await fetchProfit();
      console.log("block fetch",d);
      setprofit((Number(d)/Math.pow(10,18)).toFixed(4));
    }
    getDiam();

  },[]);
  return (
    <div className="text-white outprof">
      <div className="leftprof">
      <h1>Profile</h1>
      <p>UserName: {userData.name}</p>
      <p>Email : {userData.email}</p>
      <p>Wallet Address : {userData.walletAddress.substring(0,6)}.... </p>
      </div>
      <div className="rightprof">
        <Mastercard name={userData.name} pkey={userData.pkey} skey={userData.skey} diam={diam} avax={profit}/>
      </div>
    </div>
  );
};

export default Profile;
