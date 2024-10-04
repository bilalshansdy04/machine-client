import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import NavbarGuide from "./NavbarGuide";

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
      <Navbar />
      <div
        className={`${
          location.pathname === "/guide"
            ? "px-0 pt-0 pb-0 bg-white"
            : "px-36 pt-10 pb-20 bg-[#eff3f8]"
        }`}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
