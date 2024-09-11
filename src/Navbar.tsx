import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Navbar() {
  return (
    <div>
      <nav className="bg-[#bdd2eb] dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 py-1">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
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
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
          </div>
        </div>
      </nav>
    </div>
  );
}
