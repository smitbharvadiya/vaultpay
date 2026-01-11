import SideBar from "../components/sideBar";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboardHeader";

const DashboardLayout = ({ setIsLogin }) => {
  return (
    <div className="flex h-screen overflow-hidden pt-16">
      {/* Sidebar */}
      <SideBar setIsLogin={setIsLogin} />

      <DashboardHeader />

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
