import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";

const Root = () => {
  const location = useLocation();

  useEffect(() => {
    // Ganti title berdasarkan path
    switch (location.pathname) {
      case "/":
        document.title = "Dashboard | Home";
        break;
      case "/guide":
        document.title = "Dashboard | Guide";
        break;
      default:
        document.title = "Dashboard";
        break;
    }
  }, [location.pathname]);

  return (
    <div>
      <div className="hidden lg:block">
        <Navbar />
        <div
          className={`${
            location.pathname === "/guide"
              ? "px-0 pt-0 pb-0 bg-white"
              : "px-36 pt-10 pb-20 bg-Primary"
          }`}
        >
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Root;
