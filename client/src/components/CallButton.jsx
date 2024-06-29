import { useState } from "react";
import { IoCallOutline } from "react-icons/io5";
import { useStateAuth } from "../context/StateProvider";
import axios from "axios";

const CallButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const { createSupervisor, verifyOtp } = useStateAuth();

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleOtpSend = async () => {
    setOtpSubmitted(true);
    setOtpSent(false);
    await createSupervisor(phoneNumber);
  };

  const handleSubmit = async () => {
    await verifyOtp(otpInput);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="fixed bottom-5 right-10 bg-blue-300 hover:bg-blue-700  font-bold p-4 rounded-full"
      >
        <IoCallOutline size={24} />
      </button>
      {modalOpen && (
        <div className="fixed bottom-24 right-10 bg-white p-4 text-black rounded-lg shadow-lg z-20 transition ease-linear delay-700 min-h-72 min-w-72">
          {/* {!otpSubmitted ? ( */}
          <div>
            <h1 className="text-lg font-semibold">Provide your phone no.</h1>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => {
                e.preventDefault();
                setPhoneNumber(e.target.value);
                setOtpSent(false);
              }}
              className="border px-2 py-1  rounded-md w-full mt-2"
            />
            {/* {!otpSent && ( */}
            <button
              className="bg-blue-400 hover:bg-blue-700   py-1 px-3 rounded-md mt-4"
              onClick={() => {
                // setOtpSent(true);
                handleOtpSend();
              }}
            >
              Send OTP
            </button>
            {/* )} */}
            {/* {otpSent && ( */}
            <div>
              <h2 className="text-sm font-normal mt-4">
                Provide the OTP sent to your number
              </h2>
              <input
                type="text"
                className="border border-gray-300 py-1 px-2 rounded-md w-full mt-2"
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <button
                className="bg-blue-400 hover:bg-blue-700   py-1 px-3 rounded-md mt-4"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            {/* )} */}
          </div>
          {/* ) : ( */}
          <div>
            <p>Verifying details</p>
            <p>Please wait</p>
          </div>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default CallButton;
