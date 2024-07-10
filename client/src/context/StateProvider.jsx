/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  CampaignsApi,
  Configuration,
  SupervisorsApi,
} from "@dynopii/callchimp";
import MoneyDistribution from "../abi/MoneyDistribution.json";
import Web3 from "web3";
import { toast } from "react-toastify";
import axios from "axios";

const config = new Configuration({
  basePath: "https://api.callchimp.ai/v1",
  apiKey: import.meta.env.VITE_CALLCHIMP_API_KEY,
});
const initOverrides = {
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_CALLCHIMP_API_KEY,
  },
};
const campaignsApi = new CampaignsApi(config);
const supervisorsApi = new SupervisorsApi(config);

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("token")) || {}
  );
  const { ethereum } = window;
  const [download, setDownload] = useState(false);
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [supId, setSupId] = useState(null);
  const [subId, setSubId] = useState(null);

  React.useEffect(() => {
    console.log(userData);
  }, [userData]);
  const initializeWeb3 = useCallback(async () => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const networkId = await web3.eth.net.getId();
    if (networkId != 43113) {
      toast.warning("Change network to Fuji");
    }
    const deployedNetwork = MoneyDistribution.networks[networkId];
    const contract = new web3.eth.Contract(
      MoneyDistribution.abi,
      deployedNetwork && deployedNetwork.address
    );
    setState({ web3, contract });

    if (ethereum) {
      setDownload(true);
    }
  }, [ethereum]);

  useEffect(() => {
    initializeWeb3();
  }, [initializeWeb3]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        // toast.success("Wallet connected!");
      } catch (error) {
        setWalletConnected(false);
        toast.error("Failed to connect wallet. Please try again.");
      }
    } else {
      toast.warning("Please install a Web3 wallet, like MetaMask.");
    }
  };

  const companyLogin = async () => {
    if (walletConnected) {
      try {
        const response = await axios.post(
          "https://critiqall-backend.onrender.com/api/users/login",
          {
            walletAddress,
          }
        );
        localStorage.setItem("token", JSON.stringify(response.data.user));
        setUserData((prevUser) => ({ ...prevUser, ...response.data.user }));
        // toast.success("Login successsful!");
      } catch (error) {
        console.log(error);
        toast.warning("Error in login!");
      }
    } else {
      toast.warning("Please connect your wallet first.");
    }
  };

  const userLogin = async () => {
    if (walletConnected) {
      try {
        const response = await axios.post(
          "https://critiqall-backend.onrender.com/customer/login",
          {
            walletAddress,
          }
        );
        localStorage.setItem("token", JSON.stringify(response.data.user));
        setUserData((prevUser) => ({ ...prevUser, ...response.data.user }));
        // toast.success("Logged in successfully!");
      } catch (error) {
        console.log(error);
        toast.warning("Error in login!");
      }
    } else {
      toast.warning("Please connect your wallet first.");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setUserData({});
      window.location.replace("/");
    } catch (error) {
      console.log(error);
    }
  };
  //---------------------BUY REVIEW-----------------------------------------

  //---------------------GET products to show the customers------------------------------
  const fetchProducts = useCallback(async () => {
    const { contract } = state;
    if (!contract) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const res = await contract.methods
      .getProducts()
      .call({ from: accounts[0] });
    return res;
  }, [ethereum, state]);

  //----------------------GET products to show the owner---------------------------------
  const fetchProductsByOwner = useCallback(async () => {
    const { contract } = state;
    if (!contract) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const res = await contract.methods
      .getAllProductbyOwner()
      .call({ from: accounts[0] });
    return res;
  }, [ethereum, state]);
  //--------------------------Customer profit function------------------------------------

  const fetchProfit = useCallback(async () => {
    const { contract } = state;
    if (!contract) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const res = await contract.methods
      .getProfit(accounts[0])
      .call({ from: accounts[0] });
    return res;
  }, [ethereum, state]);

  //--------------------------Callchimp functions-----------------------------------------

  const getPhone = async () => {};

  const createSupervisor = async (number) => {
    // const requestParameters = {
    //   supervisorRequest: {
    //     name: "ABC XYZ",
    //     phone: "+919999999999",
    //     priority: 1,
    //     organization: 108,
    //   },
    // };
    // const res = await supervisorsApi.supervisorsPost(
    //   requestParameters,
    //   initOverrides
    // );
    try {
      const res1 = await axios.get(
        `https://critiqall-backend.onrender.com/getphone?phone=${number}`
      );
      console.log(res1.data);
      if (res1.data.status === 0) {
        // creating supervisor
        const res2 = await axios.post(
          "https://api.callchimp.ai/v1/supervisors",
          {
            name: "ABC XYZ",
            phone: `+91${number}`,
            priority: 1,
            organization: 108,
          },
          initOverrides
        );
        console.log(res2.data);
        const supervisorId = res2.data.id;
        setSupId(supervisorId);
        const res4 = await axios.post(
          "https://api.callchimp.ai/v1/subscribers",
          {
            first_name: "ABC",
            last_name: "XYZ",
            leadlist: 831,
            phone_code: "91",
            phone_number: `${number}`,
          },
          initOverrides
        );
        const subscriberId = res4.data.id;
        setSubId(subscriberId);
        const sendData = await axios.post("https://critiqall-backend.onrender.com/createphone", {
          sid: subscriberId,
          id: supervisorId,
          phone: number.toString(),
        });
        console.log(sendData);
        // sending otp
        const otpsend = await axios.post(
          `https://api.callchimp.ai/v1/supervisors/${supervisorId}/send_otp`,
          {},
          initOverrides
        );
        console.log(otpsend);
      } else if (!res1.data.data.verified) {
        const otpsend = await axios.post(
          `https://api.callchimp.ai/v1/supervisors/${res1.data.data.id}/send_otp`,
          {},
          initOverrides
        );
        console.log(otpsend);

        await verifyOtp();
      } else {
        const sid = res1.data.data.sid;
        console.log(sid);
        const res = await axios.post(
          "https://api.callchimp.ai/v1/calls",
          {
            lead: sid,
          },
          initOverrides
        );
        console.log(res);
      }
    } catch (error) {
      console.error("Error creating supervisor:", error);
    }
  };

  const verifyOtp = async (inputOtp) => {
    try {
      const res = await axios.post(
        `https://api.callchimp.ai/v1/supervisors/${supId}/verify_otp`,
        { otp: inputOtp },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_CALLCHIMP_API_KEY,
          },
        }
      );
      console.log(res.data);

      const call = await axios.post(
        `https://api.callchimp.ai/v1/calls`,
        {
          lead: subId,
        },
        initOverrides
      );
      console.log(call);
    } catch (error) {
      console.error("Error sending otp:", error);
    }
  };

  const listChimpCampaigns = async () => {
    try {
      const campaigns = await campaignsApi.campaignsList();
      console.log(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const listChimpSupervisors = async () => {
    try {
      const supervisors = await supervisorsApi.supervisorsList();
      console.log(supervisors);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  useEffect(() => {
    listChimpSupervisors();
  }, []);

  return (
    <StateContext.Provider
      value={{
        userData,
        state,
        download,
        walletAddress,
        walletConnected,
        fetchProfit,
        userLogin,
        companyLogin,
        logout,
        connectWallet,
        createSupervisor,
        verifyOtp,
        fetchProducts,
        fetchProductsByOwner,
        listChimpCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateAuth = () => useContext(StateContext);

//   const splitName = (name) => {
//     const nameParts = name.split(" ");
//     const firstName = nameParts[0];
//     const lastName = nameParts.slice(1).join(" ");
//     return { firstName, lastName };
//   };

//   const { firstName, lastName } = splitName(res2.data.name);
