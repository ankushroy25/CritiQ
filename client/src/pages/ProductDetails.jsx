import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Countbox, CustomButton, Loader } from "../components";
import { thirdweb } from "../assets";
import Web3 from "web3";
import axios from "axios";
import MoneyDistribution from "../abi/MoneyDistribution.json";
import { useStateAuth } from "../context/StateProvider";
import { toast } from "react-toastify";
const ProductDetails = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    orderId: "",
    description: "",
    attachments: [],
    questionAnswers: [],
  });
  const { userData } = useStateAuth();
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [orderid, setorderid] = useState("null");
  const [isOrderIdTracking, setIsOrderIdTracking] = useState(false);

  const fetchReviewsAndQuestions = useCallback(async () => {
    const questionsResponse = await axios.get(
      `https://critiqall-backend.onrender.com/api/form/question/${state.id}`
    );
    console.log(questionsResponse);
    setQuestions(questionsResponse.data.questions);
    setIsOrderIdTracking(questionsResponse.data.isOrderIdTracking);
  }, [state.id]);

  useEffect(() => {
    if (userData) fetchReviewsAndQuestions();
  }, [userData, fetchReviewsAndQuestions]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    var forGemmacheck = [];
    for (let i = 0; i < newReview.questionAnswers.length; i++) {
      for (let j = 0; j < questions.length; j++) {
        if (newReview.questionAnswers[i].question == questions[j].q) {
          if (questions[j].type === "short") {
            forGemmacheck.push({
              question: questions[j].q,
              answer: newReview.questionAnswers[i].answer,
            });
          }
        }
      }
    }
    console.log(forGemmacheck);

    try {
      const res = await axios.post("http://localhost:8000/validate-answer2", {
        qna: forGemmacheck,
      });
      console.log("ACTUAL", res.data);
      console.log(res.data.validation);

      const validationResponses = res.data.validation.split(" ,,,, ");
      let isValid = true;

      for (const response of validationResponses) {
        if (response.trim() === "no") {
          alert("Answer not validated");
          isValid = false;
          break;
        }
      }

      if (isValid) {
        setIsValidating(false);

        // Proceed with further actions if all answers are validated
        setIsLoading(true);

        console.log(JSON.stringify(newReview));
        const rev = JSON.stringify(newReview);
        const res = await axios.post("https://critiqall-backend.onrender.com/sendmoney", {
          key: userData.pkey,
        });
        console.log(res.data);
        if (res.data.status == true) {
          setNewReview({
            name: "",
            orderId: "",
            description: "",
            attachments: [],
            questionAnswers: [],
          });
          await BsubmitReview(orderid, rev);
          setIsLoading(false);
        }
        console.log("All answers validated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during validation");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "orderId") {
      setorderid(value);
    }
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleQuestionAnswerChange = (e, index) => {
    const { value } = e.target;
    setNewReview((prevReview) => {
      const newQuestionAnswers = [...prevReview.questionAnswers];
      newQuestionAnswers[index] = {
        question: questions[index].q,
        answer: value,
      };
      return {
        ...prevReview,
        questionAnswers: newQuestionAnswers,
      };
    });
  };
  /////////////////////////////////////////////////

  const { ethereum } = window;
  const [statee, setState] = useState({
    web3: null,
    contract: null,
  });
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

  const BsubmitReview = async (oid, rev) => {
    console.log("S2");
    console.log(oid, rev);
    console.log(statee);
    const { contract } = statee;
    const accountss = await ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      // NewReview(string memory orderID, string memory prodID, string memory review)
      const pid = state.id;
      console.log(oid, pid, rev);
      const res = await contract.methods
        .NewReview(oid.toString(), pid, rev)
        .send({ from: accountss[0] });

      console.log(res);

      toast.success(res.events.event1.returnValues[0]);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  ////////////////////////////////////////////////
  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.prodimg}
            alt="Product"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            {/* Progress bar implementation */}
          </div>
        </div>

        <div className="flex md:w-1/2 flex-wrap justify-between gap-[20px]">
          <Countbox
            title="Price"
            value={(Number(state.amt) / Math.pow(10, 18)).toFixed(2) + " AVAX"}
          />
          <Countbox title="Reviews" value={state.reviewCount} />
          <Countbox title="Min Review" value={state.min_review_count} />
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white mt-8">
              Product Details
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.name}
                </h4>
                <p className="mt-[4px] font-epilogue font-medium text-[12px] text-[#808191]">
                  {state.company_name}
                </p>
              </div>
            </div>

            <h4 className="font-epilogue font-semibold text-[18px] text-white mt-8">
              Description
            </h4>

            <div className="mt-[20px] font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
              <p>{state.prod_Details}</p>
              <p>Status : {state.status}</p>
              <p>Next Amt : {state.next_Amount}</p>
              <p>Owner : {state.owner}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-1 flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white ">
              Reviews
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {reviews.length > 0 ? (
                reviews.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No reviews yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Feedback
          </h4>

          <div className="mt-8 flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Review the Product
            </p>
            <form onSubmit={handleReviewSubmit} className="mt-4">
              <input
                required
                name="name"
                type="text"
                placeholder="Your name..."
                className="w-full py-2 my-2 sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={newReview.name}
                onChange={handleInputChange}
              />
              {isOrderIdTracking && (
                <>
                  <input
                    required
                    name="orderId"
                    type="text"
                    placeholder="Order ID..."
                    className="w-full py-2 my-2 sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={newReview.orderId}
                    onChange={handleInputChange}
                  />
                  <input
                    type="file"
                    name="attachments"
                    placeholder="Attach images..."
                    className="w-full py-3 my-2 sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#4b5264] leading-[30px]  rounded-[10px]"
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        attachments: e.target.files,
                      })
                    }
                  />
                </>
              )}

              <textarea
                required
                id="description"
                name="description"
                rows={4}
                placeholder="Write a detailed review..."
                className="w-full py-2 my-2 sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={newReview.description}
                onChange={handleInputChange}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-2 font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the product because it speaks to you.
                </p>
              </div>

              {/* Render questions dynamically */}
              {questions.map((question, index) => (
                <div key={index} className="my-4">
                  <label
                    className="font-epilogue font-semibold text-[16px] text-white"
                    htmlFor={`question-${index}`}
                  >
                    {question.q}
                  </label>
                  {question.type === "short" ? (
                    <textarea
                      id={`question-${index}`}
                      name={`question-${index}`}
                      rows={2}
                      placeholder="Your answer..."
                      className="w-full py-2 my-2 sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                      onChange={(e) => handleQuestionAnswerChange(e, index)}
                    />
                  ) : (
                    question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center my-2">
                        <input
                          type="radio"
                          id={`question-${index}-option-${optionIndex}`}
                          name={`question-${index}`}
                          value={option}
                          className="mr-2"
                          onChange={(e) => handleQuestionAnswerChange(e, index)}
                        />
                        <label
                          htmlFor={`question-${index}-option-${optionIndex}`}
                          className="font-epilogue font-normal text-[16px] text-white"
                        >
                          {option}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              ))}

              <CustomButton
                btnType="submit"
                title="Submit"
                styles="w-full bg-[#8c6dfd] hover:bg-[#00cec9] transition duration-500"
              />
              {isValidating && <>Validating Reviews...</>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
