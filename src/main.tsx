import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Navbar from "./Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ShowEncrypt from "./pages/ShowEncrypt";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/input",
    element: <ShowEncrypt />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>
      {/* <Navbar /> */}
      <div className="px-36 pt-8">
        <RouterProvider router={router} />
      </div>
    </div>
  </StrictMode>
);
