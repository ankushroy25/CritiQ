import { useState } from "react";
import "./navbar.css";
import logo from "../assets/logo.png";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useStateAuth } from "../context/StateProvider";
const Menu = () => {
  return (
    <div className="flex gap-8">
      <Link to="/home" className="navlink">
        Home
      </Link>
      <Link to="/company" className="navlink">
        Company
      </Link>
      <Link to="/about" className="navlink">
        About Us
      </Link>
      <Link to="/faq" className="navlink">
        FAQ
      </Link>
    </div>
  );
};

const Navbar = () => {
  const { userData } = useStateAuth();
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="flex items-center gpt3__navbar-links_logo">
          <Link
            to={
              userData != null && userData.type === "user"
                ? "/home"
                : userData != null && userData.type === "company"
                ? "/company"
                : "/"
            }
            className="flex items-center"
          >
            <img src={logo} alt="GPT3 Logo" />{" "}
            <h1>
              <span className="picc">Criti-Q</span>{" "}
            </h1>
          </Link>
        </div>
        <div className="gpt3__navbar-links_container">
          <Menu />
        </div>
        <div className="gpt3__navbar-wrapper">
          {/* Responsive part for mobiles devices */}
          {/* hamburger menu */}
          <div className="gpt3__navbar-menu">
            {toggleMenu ? (
              <RiCloseLine
                color="black"
                size={27}
                onClick={() => setToggleMenu(false)}
              />
            ) : (
              <RiMenu3Line
                color="black"
                size={27}
                onClick={() => setToggleMenu(true)}
              />
            )}
            {toggleMenu && (
              <div className="gpt3__navbar-menu_container scale-up-center">
                <div className="gpt3__navbar-menu_container-links">
                  <Menu />
                </div>
                <div className="gpt3__navbar-menu_container-links-sign">
                  <Link to="/login">Login</Link>
                </div>
                <div className="gpt3__navbar-menu_container-links-sign">
                  <Link to="/signup">Sign Up</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
