import React from "react";
import profile from "../../assets/images/profile.png";

const RightNavbar = () => {
  return (
    <div className="md:w-64 bg-white shadow-lg rounded-lg p-4 z-10 hidden lg:block animate-fade-in">
      {/* Messages Section */}
      <div className="mb-6">
        <h1 className="font-bold text-lg mb-2">Messages</h1>
        <div className="space-y-4">
          {/* Example Messages */}
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <img
                src={profile}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">Hey! How are you?</p>
              </div>
            </div>
          ))}
          {/* Show More Button */}
          <button className="mt-1 py-2 text-sm text-blue-500 underline">
            Show More Messages
          </button>
        </div>
      </div>

      {/* Friend Requests Section */}
      <div>
        <h1 className="font-bold text-lg mb-2">Friend Requests</h1>
        <div className="space-y-4">
          {/* Example Friend Requests */}
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <img
                src={profile}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Jane Smith</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm text-white bg-purple-500 rounded-lg hover:bg-purple-600">
                    Accept
                  </button>
                  <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Show More Button */}
          <button className="mt-1 py-2 text-sm text-blue-500 underline">
            Show More Friend Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
