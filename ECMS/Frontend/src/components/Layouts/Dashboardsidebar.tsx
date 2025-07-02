import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillDashboard, AiOutlineCluster } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { BsFillLightningChargeFill, BsFillGearFill } from "react-icons/bs";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { RiAlertLine } from "react-icons/ri";
import { BiSolidComponent } from "react-icons/bi";

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#050A30] to-[#06186B] text-white p-6 flex flex-col justify-between">
      {/* Top Branding */}
      <div>
        <div className="flex items-center mb-10">
          <BsFillLightningChargeFill size={30} color="#0EA5E9" />
          <h2 className="ml-3 font-bold text-lg">
            Energy<span className="text-indigo-300">Track</span>
          </h2>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-sm text-gray-300 mb-3">Navigation</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <AiFillDashboard size={18} />
              <Link
                to="/dashboard"
                className={`${
                  currentPath === "/dashboard"
                    ? "text-blue-300 font-semibold"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                Dashboard
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <BiSolidComponent size={18} />
              <Link
                to="/machines"
                className={`${
                  currentPath === "/machines"
                    ? "text-blue-300 font-semibold"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                Machines
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <MdOutlineMonitorHeart size={18} />
              <Link
                to="/energy-tracker"
                className={`${
                  currentPath === "/energy-tracker"
                    ? "text-blue-300 font-semibold"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                Energy Tracker
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <AiOutlineCluster size={18} />
               <Link
                to="/clustering"
                className={`${
                  currentPath === "/clustering"
                    ? "text-blue-300 font-semibold"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                AI Clustering
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <RiAlertLine size={18} />
              <Link
                to="/alert"
                className={`${
                  currentPath === "/alert"
                    ? "text-blue-300 font-semibold"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                Alert
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <FaUserAlt size={18} />
              <Link
                to="/user-management"
                className={`${
                  currentPath === "/user-management"
                    ? "text-blue-300 font-semibold"
                    : "text-gray-300 hover:text-blue-300"
                }`}
              >
                User Management
              </Link>
            </li>
          </ul>

          <hr className="my-6 border-blue-900" />

          <p className="text-sm text-gray-300 mb-3">Settings</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <BsFillGearFill size={18} />
              <span className="text-gray-300">Settings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
