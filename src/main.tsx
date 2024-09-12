import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Maps from "./pages/Maps";
import Root from "./Root"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,  
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/maps",
        element: <Maps />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);