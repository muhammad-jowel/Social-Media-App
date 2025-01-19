import React, { useEffect } from "react";
import profile from "../../assets/images/profile.png";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { BiAnalyse } from "react-icons/bi";
import { IoSettings, IoLogOut } from "react-icons/io5";
import { Link } from "react-router-dom";
import UserStore from "../../store/UserStore";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const LeftNavbar = () => {
  const { LogoutRequest } = UserStore();

  const onLogout = async () => {
    let res = await LogoutRequest();
    if (res) {
      toast.success("Logged Out Successfully!");
      Cookies.remove("token");
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const { ProfileDetails, ProfileDetailsRequest } = UserStore();

  useEffect(() => {
    (async () => {
      await ProfileDetailsRequest();
    })();
  }, []);

  return (
    <>
      {/* Left Navbar for larger screens */}
      <div className="md:w-64 bg-white shadow-lg rounded-lg p-3 md:p-4 z-10 hidden md:block md:sticky top-0">
        {/* Profile Section */}
        <Link to="/profile" className="flex items-center space-x-4 mb-6">
          <img
            src={ProfileDetails?.profileImg || "/default-profile.jpg"}
            alt="Profile Picture"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
              {ProfileDetails?.fullName || "Full Name"}
            </h2>
            <p className="text-sm text-gray-500 hidden sm:block">
              {ProfileDetails?.userName || "Username"}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-4">
          <Link
            to="/"
            className="font-serif flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <IoMdHome className="text-2xl" />
            <span className="hidden sm:block">Home</span>
          </Link>
          <Link
            to="/profile"
            className="font-serif flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <CgProfile className="text-2xl" />
            <span className="hidden sm:block">Profile</span>
          </Link>
          <Link
            to="/notifications"
            className="font-serif flex items-center space-x-2 text-gray-700 relative hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <IoIosNotifications className="text-2xl" />
            <span className="hidden sm:block">Notifications</span>
          </Link>
          <Link
            to="/messages"
            className="font-serif flex items-center space-x-2 text-gray-700 relative hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <MdMessage className="text-2xl" />
            <span className="hidden sm:block">Messages</span>
          </Link>
          <Link
            to="/all-friends"
            className="font-serif flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <FaUserFriends className="text-2xl" />
            <span className="hidden sm:block">All Friends</span>
          </Link>
          <Link
            to="/friends-request"
            className="font-serif flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <BiAnalyse className="text-2xl" />
            <span className="hidden sm:block">Friend Request</span>
          </Link>
          <Link
            to="/settings"
            className="font-serif flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <IoSettings className="text-2xl" />
            <span className="hidden sm:block">Settings</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full font-serif flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
          >
            <IoLogOut className="text-2xl" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </nav>

        {/* Create Post Button */}
        {/* <button onClick={onLogout} className="hidden sm:block w-full mt-6 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition duration-200">
          <IoLogOut className="text-2xl" />
          Logout
        </button> */}
      </div>

      {/* Left Navbar for small screens: Fixed at the bottom, only icons */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg p-3 z-10 flex justify-between items-center border-t border-gray-200">
        {/* Navigation Icons */}
        <Link
          to="/"
          className="font-serif flex items-center justify-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
        >
          <IoMdHome className="text-2xl" />
        </Link>
        <Link
          to="/profile"
          className="font-serif flex items-center justify-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
        >
          <CgProfile className="text-2xl" />
        </Link>
        <Link
          to="/notifications"
          className="font-serif flex items-center justify-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
        >
          <IoIosNotifications className="text-2xl" />
        </Link>
        <Link
          to="/messages"
          className="font-serif flex items-center justify-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
        >
          <MdMessage className="text-2xl" />
        </Link>
        <Link
          to="/settings"
          className="font-serif flex items-center justify-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
        >
          <IoSettings className="text-2xl" />
          <span className="hidden sm:block">Settings</span>
        </Link>
        {/* <button
          onClick={onLogout}
          className="font-serif flex items-center justify-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-lg transition duration-200"
        >
          <IoLogOut className="text-2xl" />
        </button> */}
      </div>
    </>
  );
};

export default LeftNavbar;
