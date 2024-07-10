import { useState } from "react";
import { thirdweb } from "../assets";
import { useStateAuth } from "../context/StateProvider";
import * as XLSX from "xlsx";
import { GiCrossMark } from "react-icons/gi";

const CompanyCard = ({
  id,
  company_name,
  name,
  prod_Details,
  amt,
  min_review_count,
  reviewCount,
  owner,
  amountCollected,
  prodimg,
  handleClick,
  status,
}) => {
  const { userData, state } = useStateAuth();
  const { ethereum } = window;
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BgetReview = async () => {
    const { contract } = state;
    const accountss = await ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      const res = await contract.methods
        .getReview(id)
        .call({ from: accountss[0] });

      const parsedReviews = res
        .map((review) => {
          try {
            return JSON.parse(review);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
          }
        })
        .filter((review) => review !== null);
      console.log("Parsed reviews:", parsedReviews);
      setReviews(parsedReviews);
      setIsModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };
  const BgetRefund = async () => {
    const { contract } = state;
    const accountss = await ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      const res = await contract.methods
        .Refund(id)
        .send({ from: accountss[0] });

      console.log(res);

      alert(res.events.event1.returnValues[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const flattenReviews = (reviews) => {
    return reviews.map((review) => {
      const flattenedReview = {
        name: review.name,
        orderId: review.orderId,
        description: review.description,
      };

      review.questionAnswers.forEach((qa, index) => {
        flattenedReview[`question${index + 1}`] = qa.question;
        flattenedReview[`answer${index + 1}`] = qa.answer;
      });

      return flattenedReview;
    });
  };

  const downloadExcel = () => {
    const flattenedData = flattenReviews(reviews);
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");

    XLSX.writeFile(workbook, `${name}-reviews.xlsx`);
  };

  async function review() {
    await BgetReview();
  }
  async function refund() {
    await BgetRefund();
  }

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-slate-900 max-h-[80%] p-4 rounded shadow-lg w-11/12 sm:w-1/2 relative">
          <button
            className="absolute top-2 right-2 m-2 text-gray-500 hover:text-red-700"
            onClick={onClose}
          >
            <GiCrossMark size={24} />
          </button>
          {children}
        </div>
      </div>
    );
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
        <div>Status: {status}</div>
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
          {userData != null &&
            userData.walletAddress.toLowerCase() === owner.toLowerCase() &&
            userData.type === "company" && (
              <div
                className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white px-4 rounded-lg bg-green-500 py-2 my-4`}
              >
                <button className="submit-btn" onClick={refund}>
                  Refund
                </button>
              </div>
            )}
          <div
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white px-4 rounded-lg bg-green-500 py-2 my-4`}
          >
            <button className="submit-btn" onClick={review}>
              See Reviews
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-center text-2xl mb-8 font-semibold">
          Reviews for {name}
        </h2>
        {reviews.length > 0 ? (
          <>
            <div className="border p-0.5 mx-2 rounded-lg">
              <table>
                <thead>
                  <tr className="border-y">
                    <th className="border-x">Name</th>
                    <th>Description</th>
                    <th className="border-x">Question Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-400 border-x">
                        {review.name}
                      </td>
                      <td className="px-6 py-4 text-wrap text-sm text-gray-400">
                        {review.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-x">
                        {review.questionAnswers.map((qnaset, qnaIndex) => (
                          <div key={qnaIndex}>
                            <p>Q: {qnaset.question}</p>
                            <p>A: {qnaset.answer}</p>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="flex mx-auto bg-green-800 border  rounded-lg py-2 px-3 mt-4 hover:bg-green-600 "
              onClick={() => downloadExcel(reviews)}
            >
              Download Excel
            </button>
          </>
        ) : (
          <p className="text-center mb-8">No reviews yet</p>
        )}
      </Modal>
    </div>
  );
};

export default CompanyCard;
