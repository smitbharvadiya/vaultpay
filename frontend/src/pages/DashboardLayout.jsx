import SideBar from "../components/sideBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Page Content */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
