import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`transition-all duration-300 top-0 left-1/2 transform -translate-x-1/2 py-2 z-20 ${
          isScrolled
            ? "fixed bg-Secondary dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 rounded-full w-3/4 shadow-lg mt-5 backdrop-blur-sm bg-opacity-80"
            : "relative bg-Secondary dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 w-full drop-shadow-lg"
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 px-12">
          {location.pathname === "/guide" ? (
            <div className="flex items-center">
              <h1 className="text-4xl font-bold text-Tertiary drop-shadow-xl">
                Dash<span className="text-Quaternary">board</span>
              </h1>
              {/* <div className="w-24">
                <DotLottieReact
                  src="https://lottie.host/b13a4b33-c45c-49a0-9eda-e5026e48418d/oRSXnTjKMV.json"
                  backgroundColor="transparent"
                  loop
                  autoplay
                />
              </div> */}
            </div>
          ) : (
            <a href="/" className="flex items-center">
              <h1 className="text-4xl font-bold text-Tertiary drop-shadow-xl">
                Dash<span className="text-Quaternary">board</span>
              </h1>
              {/* <div className="w-24">
                <DotLottieReact
                  src="https://lottie.host/b13a4b33-c45c-49a0-9eda-e5026e48418d/oRSXnTjKMV.json"
                  backgroundColor="transparent"
                  loop
                  autoplay
                />
              </div> */}
            </a>
          )}
          {location.pathname !== "/guide" && (
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium bg-opacity-80 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
                <li className="bg-opacity-80">
                  <a href="#chart">
                    <h1>Chart</h1>
                  </a>
                </li>
                <li className="bg-opacity-80">
                  <a href="#productivity">
                    <h1>Productivity</h1>
                  </a>
                </li>
                <li className="bg-opacity-80">
                  <a href="#record">
                    <h1>Record</h1>
                  </a>
                </li>
                <li className="bg-opacity-80">
                  <a href="#maps">
                    <h1>Maps</h1>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
