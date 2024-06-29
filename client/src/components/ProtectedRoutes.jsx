import { Navigate, Outlet } from "react-router-dom";
import { useStateAuth } from "../context/StateProvider";

const ProtectedRoutes = ({ user }) => {
  const { userData } = useStateAuth();
  if (userData.type) {
    return <Outlet />;
  } else {
    return (
      <div className="min-h-screen">
        <div className="w-20 h-20 border-4 border-t-[4px] border-[#2c2f32] rounded-full animate-spin"></div>

        {user === "customer" ? (
          <Navigate to="/login" />
        ) : (
          <Navigate to="/company/login" />
        )}
      </div>
    );
  }
};

export default ProtectedRoutes;
