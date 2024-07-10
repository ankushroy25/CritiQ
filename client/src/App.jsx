import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Sidebar, Navbar, CallButton } from "./components";
import {
  ProductDetails,
  CreateProduct,
  Home,
  Profile,
  Signup,
  Login,
  CompanyHomepage,
  CompanyProfile,
  UserLogin,
  UserSignup,
  Marketplace,
  Leaderboard,
  Dex,
  About,
  FAQ,
  RouterProtocol,
  CompanyLandingPage,
} from "./pages";
import LandingPage from "./Landing/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Footer from "./Landing/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateAuth } from "./context/StateProvider";
function App() {
  const { userData } = useStateAuth();
  const location = useLocation();
  const hideSidebarAndNavbar =
    /^(\/(company\/)?(login|register|about|faq)?|\/)$/.test(location.pathname);

  return (
    <>
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        {userData != null && !hideSidebarAndNavbar && <Sidebar />}
        <CallButton />
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          {userData != null && !hideSidebarAndNavbar && <Navbar />}

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserSignup />} />
            <Route path="/company/register" element={<Signup />} />
            <Route path="/company/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />

            {/* <Route path="/nitrodex" element={<RouterNitro />} /> */}
            <Route path="/dex" element={<Dex />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/*-------------- Customer protected routes------------------------- */}
            <Route element={<ProtectedRoutes user={"customer"} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/exchange" element={<RouterProtocol />} />
            </Route>

            {/*-------------- Company protected routes------------------------- */}
            <Route path="/abc" element={<CompanyLandingPage />} />
            <Route element={<ProtectedRoutes user={"company"} />}>
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/company" element={<CompanyHomepage />} />
              <Route path="/company/profile" element={<CompanyProfile />} />
              <Route path="/company/exchange" element={<RouterProtocol />} />
              <Route
                path="/company/create-product"
                element={<CreateProduct />}
              />
              <Route path="/company/marketplace" element={<Marketplace />} />
            </Route>
          </Routes>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
