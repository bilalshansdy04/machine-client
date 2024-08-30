import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Navbar from "./Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MachineType from "./pages/MachineType";
import MachineGroup from "./pages/MachineGroup";
import MachineId from "./pages/MachineId";
import MachineDetail from "./pages/MachineDetail";
import MachineProfile from "./pages/MachineProfile";
import MachineProductivity from "./pages/MachineProductivity";
import MachineRecords from "./pages/MachineRecords";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/type",
    element: <MachineType />,
  },
  {
    path: "/group",
    element: <MachineGroup />,
  },
  {
    path: "/id",
    element: <MachineId />,
  },
  {
    path: "/detail",
    element: <MachineDetail />,
  },
  {
    path: "/machine-profile",
    element: <MachineProfile />,
  },
  {
    path: "/productivity",
    element: <MachineProductivity />,
  },
  {
    path: "/records",
    element: <MachineRecords />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>
        <Navbar />
        <div className="px-36 pt-28">
          <RouterProvider router={router} />
        </div>
    </div>
  </StrictMode>
);
