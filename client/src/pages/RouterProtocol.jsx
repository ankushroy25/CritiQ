import { useState } from "react";
import ABI from "../routerNitro/abi.json";
import ABI2 from "../routerNitro/abi2.json";
import { ethers } from "ethers";
import axios from "axios";
import tokens from "../routerNitro/data.json";
import { toast } from "react-toastify";
import { ArrowBigRightDashIcon } from "lucide-react";
import { FcSimCardChip } from "react-icons/fc";
import { loader, logo } from "../assets";

function CheckIcon(props) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
const RouterProtocol = () => {
  const from = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; //hoelski
  const to = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; //AVAX
  const [amount, setAmount] = useState(0);

  const [quoteData, setQuoteData] = useState("");
  const [holskyBalance, setholskyBalance] = useState(0);
  const [avalancheBalance, setAvalancheBalance] = useState(0);
  const [account, setAccount] = useState("Connect Wallet");
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // to token
  const [selectedToken1, setSelectedToken1] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const handleSelect1 = (token) => {
    setSelectedToken1(token);
    setIsOpen1(false);
    setWc(false);
  };

  // from token
  const [selectedToken, setSelectedToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [wc, setWc] = useState(false);
  const handleSelect = (token) => {
    setSelectedToken(token);
    setIsOpen(false);
    setWc(false);
  };

  const walletConnect = async () => {
    if (selectedToken1 == null || selectedToken1 == null) {
      toast.error("Please select token");
    } else setIsLoading(true);

    console.log(selectedToken1.name, selectedToken.name);
    if (selectedToken1.name === "AFTT" && selectedToken.name === "AFTT") {
      if (window.ethereum) {
        console.log("detected");

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          setAccount(accounts[0]);

          console.log(accounts[0]);

          const provider1 = new ethers.providers.JsonRpcProvider(
            selectedToken.rpc_url,
            Number(selectedToken.chainId)
          );

          const provider2 = new ethers.providers.JsonRpcProvider(
            selectedToken1.rpc_url,
            Number(selectedToken1.chainId)
          );
          let to1 = selectedToken.address;
          let from1 = selectedToken1.address;
          const contract1 = new ethers.Contract(to1, ABI, provider1);
          const contract2 = new ethers.Contract(from1, ABI, provider2);
          let hb = await contract1.balanceOf(accounts[0]);
          let ab = await contract2.balanceOf(accounts[0]);
          hb = ethers.utils.formatEther(hb);
          ab = ethers.utils.formatEther(ab);
          setholskyBalance(hb);
          setAvalancheBalance(ab);
          setWc(true);
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      if (window.ethereum) {
        console.log("detected");

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          setAccount(accounts[0]);

          console.log(accounts[0]);
          console.log(selectedToken1.rpc_url, selectedToken1.chainId);
          console.log(selectedToken.rpc_url, selectedToken.chainId);
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          const provider1 = new ethers.providers.JsonRpcProvider(
            selectedToken.rpc_url,
            Number(selectedToken.chainId)
          );

          // alert(provider1);
          toast.success("Wallet connected successfully!");
          const provider2 = new ethers.providers.JsonRpcProvider(
            selectedToken1.rpc_url,
            Number(selectedToken1.chainId)
          );
          const signer = provider.getSigner();

          const contract = new ethers.Contract(to, ABI, provider1);

          //   let balance = await contract.balanceOf(accounts[0])
          let balance = await provider1.getBalance(accounts[0]);

          console.log(ethers.utils.formatEther(balance) * Math.pow(10, 18));
          setholskyBalance(ethers.utils.formatEther(balance));
          const contract2 = new ethers.Contract(from, ABI, provider2);
          // balance = await contract2.balanceOf(accounts[0])
          balance = await provider2.getBalance(accounts[0]);
          console.log(ethers.utils.formatEther(balance) * Math.pow(10, 12));
          setAvalancheBalance(ethers.utils.formatEther(balance));
          setWc(true);
        } catch (err) {
          console.log(err);
        }
      }
    }
    setIsLoading(false);
  };

  const execute = async () => {
    setStep1("");
    setStep2("");
    setStep3("");
    if (selectedToken1.name === "AFTT" && selectedToken.name === "AFTT") {
      if (window.ethereum) {
        console.log("detected");

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          let from1 = selectedToken.address;
          let to1 = selectedToken1.address;
          const params = {
            fromTokenAddress: from1,
            toTokenAddress: to1,
            amount: amount,
            fromTokenChainId: "17000",
            toTokenChainId: "43113", // Fuji
            partnerId: "0",
            // 'widgetId': 0, // get your unique wdiget id by contacting us on Telegram
          };

          const quoteData = await getQuote(params);
          console.log(quoteData);
          setQuoteData(quoteData);
          setStep1("✅");
          alert(quoteData.allowanceTo);

          console.log(quoteData);

          console.log(accounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          console.log(quoteData);
          await checkAndSetAllowance(
            signer,
            from1, // fromTokenAddress (USDT on Mumbai)
            quoteData.allowanceTo, // quote.allowanceTo in getQuote(params) response from step 1
            ethers.constants.MaxUint256 // amount to approve (infinite approval)
          );
          setStep2("✅");

          const txResponse = await getTransaction(
            {
              fromTokenAddress: from1,
              toTokenAddress: to1,
              fromTokenChainId: "17000",
              toTokenChainId: "43113", // Fuji

              widgetId: 0, // get your unique wdiget id by contacting us on Telegram
            },
            quoteData
          ); // params have been defined in step 1 and quoteData has also been fetched in step 1

          // sending the transaction using the data given by the pathfinder
          const tx = await signer.sendTransaction(txResponse.txn);
          try {
            await tx.wait();
            console.log(`Transaction mined successfully: ${tx.hash}`);
            alert(`Transaction mined successfully: ${tx.hash}`);
            setStep3("✅");
          } catch (error) {
            console.log(`Transaction failed with error: ${error}`);
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      const params = {
        fromTokenAddress: selectedToken.address,
        toTokenAddress: selectedToken1.address,
        amount: amount,
        fromTokenChainId: selectedToken.chainId, //800
        toTokenChainId: selectedToken1.chainId, // avax
        partnerId: "0",
        // 'widgetId': 0, // get your unique wdiget id by contacting us on Telegram
      };

      const quoteData = await getQuote(params);
      setQuoteData(quoteData);
      setStep1("✅");
      // alert(quoteData.allowanceTo);
      console.log("response");
      console.log(quoteData);
      if (window.ethereum) {
        console.log("detected");

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          console.log(accounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log("response");
          const txResponse = await getTransaction(
            {
              fromTokenAddress: selectedToken.address,
              toTokenAddress: selectedToken1.address,
              fromTokenChainId: Number(selectedToken.chainId),
              toTokenChainId: Number(selectedToken1.chainId), // Fuji

              widgetId: 0, // get your unique wdiget id by contacting us on Telegram
            },
            quoteData
          ); // params have been defined in step 1 and quoteData has also been fetched in step 1
          console.log("response");
          setStep2("✅");
          console.log(quoteData);
          console.log(txResponse);
          // sending the transaction using the data given by the pathfinder
          const tx = await signer.sendTransaction(txResponse.txn);
          try {
            await tx.wait();
            console.log(`Transaction mined successfully: ${tx.hash}`);
            alert(`Transaction mined successfully: ${tx.hash}`);
            setStep3("✅");
          } catch (error) {
            console.log(`Transaction failed with error: ${error}`);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api";
  // Makes an HTTP GET Request to the Nitro Pathfinder API
  // quote data, which typically includes details about the token transfer,
  // such as source and destination chains, token amount, fees, and other relevant information.
  const getQuote = async (params) => {
    const endpoint = "v2/quote";
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    console.log(quoteUrl);

    try {
      const res = await axios.get(quoteUrl, { params });
      return res.data;
    } catch (e) {
      console.error(`Fetching quote data from pathfinder: ${e}`);
    }
  };
  // Fetch the current allowance and update and, if necessary, sets a new allowance
  const checkAndSetAllowance = async (
    wallet,
    tokenAddress,
    approvalAddress,
    amount
  ) => {
    // Transactions with the native token don't need approval
    if (tokenAddress === ethers.constants.AddressZero) {
      return;
    }

    // Using the provided token address and the ERC20 ABI, we create an instance of the ERC20 contract.
    const erc20 = new ethers.Contract(tokenAddress, ABI, wallet);
    const allowance = await erc20.allowance(
      await wallet.getAddress(),
      approvalAddress
    );
    if (allowance.lt(amount)) {
      const approveTx = await erc20.approve(approvalAddress, amount, {
        gasPrice: await wallet.provider.getGasPrice(),
      });
      try {
        await approveTx.wait();
        console.log(`Transaction mined succesfully: ${approveTx.hash}`);
      } catch (error) {
        console.log(`Transaction failed with error: ${error}`);
      }
    } else {
      console.log("enough allowance");
      alert("enough allowance");
    }
  };
  // This function is responsible for actually executing the transaction. It takes in the following parameters
  const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction";
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    console.log(txDataUrl);

    try {
      const res = await axios.post(txDataUrl, {
        ...quoteData,
        // fromTokenAddress: params.fromTokenAddress,
        // toTokenAddress: params.toTokenAddress,
        slippageTolerance: 0.5,
        senderAddress: account,
        receiverAddress: account,
        // widgetId: params.widgetId
      });
      return res.data;
    } catch (e) {
      console.error(`Fetching tx data from pathfinder: ${e}`);
    }
  };
  // This function is responsible for executing the transaction. It takes in the following parameters

  return (
    <div className="flex md:h-screen items-center justify-center bg-[#13131a] text-white">
      <div className="bg-[#1c1c24] p-8 rounded-lg shadow-lg w-full max-w-5xl h-[83vh] heightdex flex flex-col justify-around mt-[-16vh]">
        <div className="mb-3">
          <h3 className="text-2xl mb-2 font-semibold text-center">Exchange </h3>
          <span className="flex mx-auto justify-center text-center text-gray-400">
            Powered by{" "}
            <img
              src="https://framerusercontent.com/images/sZZo0uYSblaJ96GtafiQ923d2k.png"
              alt="Router nitro"
              className="h-6 w-14 ml-4 my-1"
            />
          </span>
          <p className="flex flex-col sm:flex-row justify-center font-semibold mr-12 text-gray-400 text-center">
            <span>&emsp; Select tokens &emsp;→ </span>
            <span> &emsp; Connect your wallet &emsp; </span>
            <span> →&emsp; Swap</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between my-4">
          {/* card 1 */}
          <div className="relative shadow-slate-400 shadow-md m-auto h-48 w-64 md:w-90 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 text-white transition-transform sm:h-56 sm:w-96 sm:hover:scale-105">
            <div className="absolute top-4 w-full px-4 md:px-8 sm:top-8">
              <div className="flex justify-between">
                <div className="flex text-xs items-center">
                  <img src={logo} className="h-10 w-10" alt="" />
                  CritiQ <br /> Exchange
                </div>
                <div className="flex flex-col sm:flex-row relative gap-2 items-center">
                  <h3 className="text-xs sm:text-base">From</h3>
                  {/* <CustomSelectTokenComponent /> */}
                  <div
                    className="p-2 rounded-lg bg-[#a4a4bf4c] text-white appearance-none cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedToken ? (
                      <div className="flex items-center">
                        <img
                          src={selectedToken.img_url}
                          alt="token_image"
                          className="w-6 h-6 mr-2"
                        />
                        <span className="text-xs md:text-base">
                          {selectedToken.name}
                        </span>
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="pointer-events-none text-xs sm:text-sm inset-y-0 right-0 flex items-center px-2 text-white">
                        Select token
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {isOpen && (
                    <div className="absolute z-10 w-full mt-10 bg-[#2c2c34] rounded-md max-h-[360px] overflow-y-auto">
                      {tokens.testTokens.map((token, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 cursor-pointer hover:bg-[#3c3c44]"
                          onClick={() => handleSelect(token)}
                        >
                          <img
                            src={token.img_url}
                            alt="token_image"
                            className="w-6 h-6 mr-2"
                          />
                          <span>{token.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between">
                <p className="text-yellow-400 font-semibold mr-2"> Balance</p>
                {wc === true && (
                  <p className="text-xs md:text-base">
                    {selectedToken.name} on {selectedToken.src}:{" "}
                    {Number(holskyBalance).toFixed(2)}
                  </p>
                )}
                &nbsp;
                <FcSimCardChip size={36} />
              </div>
              <div className="flex-1 mt-2 sm:mt-4">
                <input
                  type="text"
                  placeholder="Enter amount"
                  className="w-full outline-slate-300 p-3 rounded bg-[#63639f4d] text-white placeholder:text-gray-300"
                  onChange={(e) => {
                    setAmount(e.target.value * Math.pow(10, 18));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="items-center my-4 md:my-auto mx-auto">
            <ArrowBigRightDashIcon size={30} />{" "}
          </div>
          {/* card 2 */}
          <div className="relative m-auto h-48 w-64 md:w-90 rounded-xl bg-gradient-to-r from-green-700 to-teal-600 text-white shadow-md shadow-slate-400 transition-transform sm:h-56 sm:w-96 sm:hover:scale-110">
            <div className="absolute top-4 w-full px-4 sm:px-8 sm:top-8">
              <div className="flex justify-between">
                <div className="flex text-xs items-center">
                  <img src={logo} className="h-10 w-10" alt="" />
                  CritiQ <br /> Exchange
                </div>
                <div className="flex flex-col sm:flex-row relative gap-2 items-center">
                  <h3 className="text-xs sm:text-base">To</h3>

                  {/* <CustomSelectTokenComponent /> */}
                  <div
                    className="p-2 rounded-lg bg-[#a4a4bf4c] text-white appearance-none cursor-pointer"
                    onClick={() => setIsOpen1(!isOpen1)}
                  >
                    {selectedToken1 ? (
                      <div className="flex items-center">
                        <img
                          src={selectedToken1.img_url}
                          alt="token_image"
                          className="w-6 h-6 mr-2"
                        />
                        <span className="text-xs sm:text-base">
                          {selectedToken1.name}
                        </span>
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="pointer-events-none text-xs sm:text-sm inset-y-0 right-0 flex items-center px-2 text-white">
                        Select token
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {isOpen1 && (
                    <div className="absolute z-10 w-full mt-10 bg-[#2c2c34] rounded-md max-h-[360px] overflow-y-auto">
                      {tokens.testTokens.map((token, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 cursor-pointer hover:bg-[#3c3c44]"
                          onClick={() => handleSelect1(token)}
                        >
                          <img
                            src={token.img_url}
                            alt="token_image"
                            className="w-6 h-6 mr-2"
                          />
                          <span>{token.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between">
                <p className="text-yellow-400 font-semibold mr-2">Balance </p>
                {wc === true && (
                  <p className="text-xs md:text-base">
                    {selectedToken1.name} on {selectedToken1.src}:{" "}
                    {Number(avalancheBalance).toFixed(2)}
                  </p>
                )}
                &nbsp;
                <FcSimCardChip size={36} />
              </div>
              <div className="flex-1 mt-2 sm:mt-4">
                <p className="w-full outline-slate-300 p-3 h-12 rounded bg-[#8080a74d] text-white placeholder:text-gray-300">
                  Translated amount : xxx
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <span className="absolute bg-slate-800 bg-opacity-50 p-2 rounded-lg  left-[45%] items-center z-10 flex justify-center">
            <img
              src={loader}
              alt="loader"
              className="w-[50px] h-[50px] object-contain"
            />
            Fetching account data
          </span>
        )}
        <button
          className="w-1/2 mx-auto py-2 mt-8 bg-yellow-200 text-black text-lg rounded hover:bg-yellow-500 md:font-semibold"
          onClick={walletConnect}
        >
          Connect Wallet
        </button>

        <div className="flex gap-6 mt-3">
          <button
            className="w-1/2 py-2 mx-auto bg-yellow-200 text-black  text-lg rounded hover:bg-yellow-500 md:font-semibold"
            onClick={execute}
          >
            Swap
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-center gap-4 flexcolll">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center ${
                  step1 == "✅" ? "bg-green-500 text-white" : "bg-gray-500"
                }`}
              >
                <CheckIcon
                  className={`w-5 h-5 ${
                    step1 == "✅" ? "text-white" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span className="text-primary font-medium">Got Quote</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center ${
                  step2 == "✅" ? "bg-green-500 text-white" : "bg-gray-500"
                }`}
              >
                <CheckIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground font-medium">
                Got Allowance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center ${
                  step3 == "✅" ? "bg-green-500 text-white" : "bg-gray-500"
                }`}
              >
                <CheckIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground font-medium">
                Executed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterProtocol;
