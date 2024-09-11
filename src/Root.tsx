import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Root = () => {
  const location = useLocation();

  return (
    <div>
      {/* Tampilkan Navbar kecuali di halaman /maps */}
      {location.pathname !== '/maps' && <Navbar />}
      <div className="px-36 pt-20 bg-[#eff3f8]">
        {/* Outlet untuk memuat halaman berdasarkan rute */}
        <Outlet />
      </div>
    </div>
  );
};

export default Root;