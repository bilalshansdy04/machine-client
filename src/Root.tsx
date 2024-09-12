import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";

const Root = () => {
  const location = useLocation();

  useEffect(() => {
    // Ganti title berdasarkan path
    switch (location.pathname) {
      case "/":
        document.title = "Dashboard | Home";
        break;
      case "/maps":
        document.title = "Dashboard | Maps";
        break;
      default:
        document.title = "Dashboard";
        break;
    }
  }, [location.pathname]);

  return (
    <div>
      {location.pathname !== '/maps' && <Navbar />}
      <div className="px-36 pt-10 pb-20 bg-[#eff3f8]">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;