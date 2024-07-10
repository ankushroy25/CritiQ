import { useState } from "react";
import readXlsxFile from "read-excel-file";
// import { create } from "@web3-storage/w3up-client";
import axios from "axios";
import Web3 from "web3";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { toast } from "react-toastify";
import { useStateAuth } from "../context/StateProvider";
import { Loader } from ".";

const FormComponent = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isOrderIdTracking, setIsOrderIdTracking] = useState(false);
  const [reviewDate, setReviewDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "short",
    q: "",
    options: [""],
  });
  const [exceldata, setExcelData] = useState([]); // Add this line
  const [amt, setAmt] = useState(0); // Add this line
  const [noOfReview, setNoOfReview] = useState(0); // Add this line
  const { userData, state } = useStateAuth();
  const { ethereum } = window;
  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ type: "short", q: "", options: [""] });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    if (field === "type" && value === "short") {
      updatedQuestions[index].options = [""];
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].options.length < 4) {
      updatedQuestions[index].options.push("");
      setQuestions(updatedQuestions);
    }
  };

  const handleDeleteOption = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleImageFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
    var data = [];
    readXlsxFile(file).then((rows) => {
      console.log("Order IDs from Excel:");
      rows.slice(1).forEach((row) => {
        data.push(row[0].toString());
        console.log(row[0]); // Assuming the order ID is in the first column
      });
    });
    setExcelData(data);
  };

  // const uploadToWeb3Storage = async (file) => {
  //   const token = "YOUR_W3UP_CLIENT_API_TOKEN"; // Replace with your w3up-client API token
  //   const client = await create({ token });
  //   const cid = await client.put(file);
  //   return `https://${cid}.ipfs.dweb.link/${file.name}`;
  // };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setAiGenerating(true);
    if (productName === "" || productDescription === "") {
      toast.warning("Please fill the product name and description first");
      return;
    }
    console.log(userData.name);
    console.log(userData.description);
    var alldata = {
      cname: userData.name,
      cdetails: userData.description,
      pname: productName,
      pdetails: productDescription,
    };
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8000/generate-questions",
        data: alldata,
      });
      console.log(response.data.questions);
      const { questions: generatedQuestions } = response.data;
      const d = parseQuestions(generatedQuestions);
      setQuestions(d);
      console.log(d);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const parseQuestions = (generatedQuestions) => {
    const lines = generatedQuestions.split("\n");
    const questions = [];
    let currentQuestion = null;

    lines.forEach((line) => {
      line = line.trim();
      if (
        line.startsWith("1.") ||
        line.startsWith("2.") ||
        line.startsWith("3.")
      ) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          type: "mcq",
          q: line
            .replace(/^\d+\.\s*/, "")
            .replace(/^\*\*/, "")
            .replace(/\*\*$/, ""),
          options: [],
        };
      } else if (line.startsWith("4.") || line.startsWith("5.")) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          type: "short",
          q: line
            .replace(/^\d+\.\s*/, "")
            .replace(/^\*\*/, "")
            .replace(/\*\*$/, ""),
          options: [""],
        };
      } else if (
        line.startsWith("a.") ||
        line.startsWith("b.") ||
        line.startsWith("c.") ||
        line.startsWith("d.") ||
        line.startsWith("a)") ||
        line.startsWith("b)") ||
        line.startsWith("c)") ||
        line.startsWith("d)")
      ) {
        if (currentQuestion && currentQuestion.type === "mcq") {
          currentQuestion.options.push(line.replace(/^[a-d]\.\s*/, ""));
        }
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    setAiGenerating(false);
    return questions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    console.log(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    var imageUrl = "";
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );

      imageUrl = response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    var allData = {
      productName: productName,
      productDescription: productDescription,
      productImageUrl: imageUrl,
      isOrderIdTracking: isOrderIdTracking,
      reviewDate: "",
      excelFile: "",
      questions: questions,
    };
    console.log("aa", allData);
    if (isOrderIdTracking) {
      allData.reviewDate = reviewDate;
      allData.excelFile = excelFile;
    }

    try {
      if (!userData) {
        toast.warning("Please login first");
        return;
      }
      console.log(allData);
      const response = await axios({
        method: "post",
        url: "https://critiqall-backend.onrender.com/api/form/question",
        data: allData,
      });
      console.log(response);
      const prodid = response.data.data._id;
      // imgg =
      //   "https://www.jiomart.com/images/product/original/493664931/samsung-galaxy-a23-5g-128-gb-8-gb-ram-silver-mobile-phone-digital-o493664931-p597885912-0-202301260956.jpeg?im=Resize=(420,420)";
      await BcreateProduct(prodid, userData, imageUrl);
      setIsLoading(false);

      // await BcreateProduct(response.data._id);
      if (response.status === 201) {
        toast.success("Form submitted successfully!");
        window.location.reload();
      } else {
        toast.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const BcreateProduct = async (prodID, userdata, imgURL) => {
    const { contract } = state;
    const accountss = await ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      console.log(exceldata);
      const res = await contract.methods
        .NewProduct(
          prodID,
          imgURL,
          productName,
          isOrderIdTracking,
          exceldata,
          noOfReview,
          productDescription,
          userdata.name
        )
        .send({ value: Web3.utils.toWei(amt, "ether"), from: accountss[0] });

      if (res.events.event1.returnValues[0].equals("Review added"))
        toast.success(res.events.event1.returnValues[0]);
      else toast.error("Review already submitted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <form
        onSubmit={handleSubmit}
        className="w-4/5 mt-8 flex flex-col gap-[30px]"
      >
        {/* {!state.contract ? <WrongNetwork /> : <></>} */}
        <FormField
          labelName="Product Name *"
          placeholder="Galaxy S@3, iPhone 15..."
          inputType="text"
          value={productName}
          handleChange={(e) => setProductName(e.target.value)}
        />
        <FormField
          labelName="Product Description..."
          placeholder="Write about the product..."
          inputType="text"
          isTextArea
          value={productDescription}
          handleChange={(e) => setProductDescription(e.target.value)}
        />
        <div className="flex flex-wrap justify-between">
          <label className="mt-4 font-epilogue font-medium text-[#b7b7ea]">
            Product Image:
          </label>
          <input
            type="file"
            name="attachments"
            placeholder="Attach images..."
            className="py-2 my-2 md:w-1/2 px-4 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-[#4b5264] rounded-md"
            // value={}
            onChange={handleImageFileChange}
          />
        </div>
        <FormField
          labelName="Reward amount for reviewers *"
          placeholder="0.2 ETH..."
          inputType="text"
          handleChange={(e) => setAmt(e.target.value)}
        />
        <FormField
          labelName="No. of review *"
          placeholder="No. of review"
          inputType="text"
          value={noOfReview}
          handleChange={(e) => setNoOfReview(e.target.value)}
        />
        <div className="flex gap-4">
          <input
            type="checkbox"
            checked={isOrderIdTracking}
            onChange={(e) => setIsOrderIdTracking(e.target.checked)}
          />
          <label className="font-epilogue font-medium  text-[#b7b7ea]">
            Is Order ID Tracking Available?
          </label>
        </div>
        {isOrderIdTracking ? (
          <>
            <div className="form-section">
              <label className="font-epilogue font-medium text-[#b7b7ea]">
                Upload Excel File:
              </label>
              <input
                type="file"
                className="py-2 my-2 ml-8 px-4 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-[#4b  264] rounded-md"
                onChange={handleExcelFileChange}
              />
            </div>
            <FormField
              labelName="End Date"
              placeholder="Date till which review is valid"
              inputType="date"
              value={reviewDate}
              handleChange={(e) => setReviewDate(e.target.value)}
            />
          </>
        ) : (
          <></>
        )}
        <div className="font-epilogue font-med  text-[#787f90]">
          <div className="px-4 py-4 mb-4 bg-[#3a3a43]  rounded-xl w-2/3 justify-center flex mx-auto">
            <h2 className=" text-purple-200 font-semibold text-xl ">
              Set your questions for reviewers
            </h2>
            <button
              className="flex h-fit bg-green-300 px-2 py-1 rounded-lg text-black ml-4"
              onClick={handleAiSubmit}
            >
              Generate with AI
            </button>
            {aiGenerating && (
              <>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 border-4 border-gray-200 border-dotted rounded-full animate-spin"></div>
                </div>
              </>
            )}
          </div>

          {questions.map((q, index) => (
            <div key={index}>
              <div className="grid grid-cols-3 justify-between items-center">
                <label className="mt-4">Question {index + 1}</label>
                <select
                  value={q.type}
                  onChange={(e) =>
                    handleQuestionChange(index, "type", e.target.value)
                  }
                  className="mt-4 py-3 px-6 outline-none border border-[#3a3a43] bg-transparent placeholder:text-[#4b5264] rounded-lg sm:min-w-[300px]"
                >
                  <option className="text-gray-600 " value="short">
                    Short Answer
                  </option>
                  <option className="text-gray-600" value="mcq">
                    Multiple Choice
                  </option>
                </select>
                <button
                  type="button"
                  className="text-end justify-end flex mt-4"
                  onClick={() => handleDeleteQuestion(index)}
                >
                  <RiDeleteBin6Line size={30} className="text-red-500" />
                </button>
              </div>
              <div>
                <input
                  type="text"
                  value={q.q}
                  onChange={(e) =>
                    handleQuestionChange(index, "q", e.target.value)
                  }
                  className="mt-4 w-full py-3 px-6 outline-none border border-[#3a3a43] bg-transparent text-white placeholder:text-[#4b5264] rounded-lg sm:min-w-[300px]"
                  placeholder="Question"
                />
              </div>
              {q.type === "mcq" && (
                <div>
                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex flex-wrap justify-evenly items-center mt-4"
                    >
                      <label>Option {optIndex + 1}</label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="py-2 px-6 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white  placeholder:text-[#4b5264] rounded-lg sm:min-w-[300px]"
                      />

                      <button
                        type="button"
                        className=""
                        onClick={() => handleDeleteOption(index, optIndex)}
                      >
                        <FiDelete size={24} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                  {q.options.length < 4 && (
                    <button
                      type="button"
                      className="flex mt-4 mx-auto"
                      onClick={() => handleAddOption(index)}
                    >
                      <MdOutlinePlaylistAdd size={32} color="green" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          <CustomButton
            btnType="button"
            title="Add Question"
            handleClick={handleAddQuestion}
            styles="bg-green-500 py-2 my-4"
          />
        </div>
        <CustomButton
          btnType="submit"
          title="Submit"
          styles="w-full bg-cyan-700 py-2 hover:bg-cyan-500"
        />
      </form>
    </>
  );
};

export default FormComponent;
