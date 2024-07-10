import { tagType, thirdweb } from "../assets";

const ProductCard = ({
  company_name,
  name,
  owner,
  typ,
  nextAmount,
  amt,
  reviewCount,
  min_review_count,
  prodimg,
  status,
  prod_Details,
  handleClick,
}) => {
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
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
            Education
          </p>
        </div>

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
              Next Reward:{(Number(nextAmount)/Math.pow(10,18)).toFixed(4)}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Min reviews {min_review_count}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              ({reviewCount}) Reviews
            </p>
          </div>
          <div className="font-epilogue font-normal text-[12px]  text-[#808191] sm:max-w-[120px] ">
            <p>Trackable : {typ ? "Yes" : "No"}</p>
            <p>Status : {status}</p>
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
      </div>
    </div>
  );
};

export default ProductCard;
