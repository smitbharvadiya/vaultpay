import SideBar from "../components/sideBar";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboardHeader";

const DashboardLayout = ({ setIsLogin }) => {
  return (
    <div className="h-screen overflow-hidden">
      {/* Fixed Header */}
      <DashboardHeader />

      <div className="flex pt-16 h-full">
        {/* Sidebar */}
        <SideBar setIsLogin={setIsLogin} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
