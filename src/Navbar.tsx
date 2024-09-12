import { useEffect, useState } from 'react';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='w-full flex justify-center'>
      <nav
        className={`transition-all duration-300 top-0 left-1/2 transform -translate-x-1/2 py-2 z-20 ${
          isScrolled
            ? 'fixed bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 rounded-full w-3/4 shadow-lg mt-5 backdrop-blur-sm bg-opacity-80'
            : 'relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 w-full'
        }`}
        style={{ boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none' }}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 pl-12">
          <a href="/" className="flex items-center">
            <h1 className="text-4xl font-bold text-[#f39512] drop-shadow-xl">
              Dash<span className="text-[#385878]">board</span>
            </h1>
            <div className="w-24">
              <DotLottieReact
                src="https://lottie.host/b13a4b33-c45c-49a0-9eda-e5026e48418d/oRSXnTjKMV.json"
                backgroundColor="transparent"
                loop
                autoplay
              />
            </div>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse opacity-0">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get started
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="#chart"><h1>Chart</h1></a>
              </li>
              <li>
                <a href="#productivity">
                  <h1>Productivity</h1>
                </a>
              </li>
              <li>
                <a href="#record">
                  <h1>Record</h1>
                </a>
              </li>
              <li>
                <a href="#maps">
                  <h1>Maps</h1>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
