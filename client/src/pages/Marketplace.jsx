import React, { useEffect, useState } from "react";
import MarketCard from "../components/MarketCard";
import { loader } from "../assets";
import MoneyDistribution from "../abi/MoneyDistribution.json";
import Web3 from "web3";
import { useStateAuth } from "../context/StateProvider";

const MarketPlace = () => {
  const {userData}=useStateAuth();
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { ethereum } = window;
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  // useEffect(()=>{

  // },)
  useEffect(() => {
    async function template() {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MoneyDistribution.networks[networkId];
      const contract = new web3.eth.Contract(
        MoneyDistribution.abi,
        deployedNetwork.address
      );
      console.log(contract);
      setState({ web3: web3, contract: contract });
    }
    template();
  }, []);
  const [download, setDownload] = React.useState(false);

  useEffect(() => {
    if (ethereum) {
      setDownload(true);
    }
  }, [ethereum]);

  useEffect(() => {
    async function f11() {
      const { contract } = state;
      const accountss = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const res = await contract.methods
        .getProducts()
        .call({ from: accountss[0] });
      console.log(res);
      setProducts(res);
      setLoading(false);
    }
    if (download && (products.length == 0 || products == null)) {
      f11();
    }
  }, [ethereum, state, download, products]);
  return (
    <div>
      {!download && (
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
          Please install metamask
        </h1>
      )}
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        Marketplace of products ({products.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && (products.length === 0 || products == null) && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No products to display
          </p>
        )}

        {!isLoading &&
          products.length > 0 &&
          products.map((product) => (
            (userData.walletAddress==product.owner)?<></>:
            <MarketCard key={product.id} {...product} />
          ))}
      </div>
    </div>
  );
};

export default MarketPlace;
