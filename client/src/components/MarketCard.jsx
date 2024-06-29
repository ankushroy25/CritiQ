import { thirdweb } from "../assets";
import Web3 from "web3";
import { useStateAuth } from "../context/StateProvider";
import BigNumber from "bignumber.js";
const MarketCard = ({
  id,
  company_name,
  name,
  prod_Details,
  amt,
  min_review_count,
  reviewCount,
  amountCollected,
  prodimg,
  handleClick,
}) => {
  const { ethereum } = window;

  const { state } = useStateAuth();
  const f11 = async () => {
    const { contract } = state;
    const accountss = await ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      var tosend = ((Number(amt) / Math.pow(10, 18)) * 3).toFixed(4).toString();
      const res = await contract.methods
        .BuyReview(id)
        .send({ value: Web3.utils.toWei(tosend, "ether"), from: accountss[0] });

      console.log(res);

      alert(res.events.event1.returnValues[0]);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={prodimg}
        alt="fund"
        className="w-full h-52 object-cover rounded-xl"
      />

      <div className="flex flex-col p-4">
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
            {name}
          </h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">
            {prod_Details}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Price : {((Number(amt) * 2) / Math.pow(10, 18)).toFixed(4)} AVAX
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              ({reviewCount}/{min_review_count}) Reviews
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            by <span className="text-[#b2b3bd]">{company_name}</span>
          </p>
        </div>
        <div className="flex items-center mt-[20px] gap-[12px]">
          <div
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white px-4 rounded-lg bg-green-500 py-2 my-4`}
          >
            <button className="submit-btn" onClick={f11}>
              Buy product review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;
