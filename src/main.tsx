import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Root from "./Root"; 
import DataTable from "./pages/DataTable";
import Guide from "./pages/Guide";

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
        path: "/guide",
        element: <Guide />,
      },
      {
        path: "/data",
        element: <DataTable />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);