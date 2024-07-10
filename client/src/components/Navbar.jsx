import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useFlowAuth } from "../context/FlowProvider";
import { CustomButton } from "./";
import { menu, search, thirdweb } from "../assets";
import { customerNavlinks, companyNavlinks } from "../constants";
import Logo from "../assets/logo.png";
import { useLocation } from "react-router-dom";
import { useStateAuth } from "../context/StateProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const { userData, logout } = useStateAuth();

  const location = useLocation();
  const isCompany = location.pathname === "/company";
  const isHome = location.pathname === "/home";

  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          type="text"
          placeholder="Search for products..."
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div className="px-3 h-full rounded-full bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      <div className="sm:flex hidden flex-row items-center justify-end gap-4">
        <CustomButton
          btnType="button"
          title={
            userData != null
              ? userData.walletAddress?.substring(0, 5)
              : "Connect"
          }
          styles={userData != null ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            if (userData != null && userData.type === "user")
              navigate("/profile");
            else if (userData != null && userData.type === "company")
              navigate("/company/profile");
            else navigate("/login");
          }}
        />
        {userData != null ? (
          <CustomButton
            btnType="button"
            title="Logout"
            styles="bg-[#8c6dfd]"
            handleClick={logout}
          />
        ) : null}
        {/* <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link> */}
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex w-full justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={Logo}
            alt="user"
            className="w-[90%] h-[90%] object-contain"
          />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {(userData.type === "user"
              ? customerNavlinks
              : companyNavlinks
            ).map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4 gap-4">
            {isCompany ? (
              <CustomButton
                btnType="button"
                title={
                  userData != null && userData.type === "company"
                    ? userData.walletAddress?.substring(0, 5)
                    : "Connect"
                }
                styles={userData != null ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                handleClick={() => {
                  if (userData != null && userData.type === "user")
                    navigate("/customer/profile");
                  else if (userData != null && userData.type === "company")
                    navigate("/company");
                  else navigate("/company/login");
                }}
              />
            ) : isHome ? (
              <CustomButton
                btnType="button"
                title={
                  userData != null && userData.type === "user"
                    ? userData.walletAddress.substring(0, 5)
                    : "Connect"
                }
                styles={userData != null ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                handleClick={() => {
                  if (userData != null) navigate("/profile");
                  else navigate("/login");
                }}
              />
            ) : null}
            {userData != null ? (
              <CustomButton
                btnType="button"
                title="Logout"
                styles="bg-[#8c6dfd]"
                handleClick={logout}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
