import React, { useEffect, useRef, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import UserStore from "../../store/UserStore";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

const Profile = () => {
  const {
    ProfileFormValue,
    ProfileFormOnChange,
    ProfileDetails,
    ProfileDetailsRequest,
    ProfileUpdateRequest,
  } = UserStore();

  useEffect(() => {
    (async () => {
      await ProfileDetailsRequest();
    })();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    const PostBody = {
      fullName: ProfileFormValue.fullName,
      bio: ProfileFormValue.bio,
      location: ProfileFormValue.location,
      phone: ProfileFormValue.phone,
      website: ProfileFormValue.website,
    };

    const success = await ProfileUpdateRequest(PostBody);
    if (success) {
      toast.success("Profile updated successfully");
      await ProfileDetailsRequest();
      setIsOpen(false); // Close the modal after saving
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpdate = async (type, file) => {
    const formData = new FormData();
    formData.append(type, file); // 'type' will be 'coverImg' or 'profileImg'

    const success = await ProfileUpdateRequest(formData);
    if (success) {
      toast.success(
        `${
          type === "coverImg" ? "Cover photo" : "Profile photo"
        } updated successfully`
      );
      await ProfileDetailsRequest(); // Refresh profile details
    } else {
      toast.error(
        `Failed to update ${
          type === "coverImg" ? "cover photo" : "profile photo"
        }`
      );
    }
  };

  const coverFileInput = useRef(null);
  const profileFileInput = useRef(null);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Cover Image */}
      <div className="relative w-full h-48 bg-gray-300 group">
        <img
          src={ProfileDetails?.coverImg || "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-full object-cover rounded-lg"
        />
        {/* Cover Change Icon */}
        <button
          onClick={() => coverFileInput.current.click()}
          className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white rounded-full p-2 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110"
        >
          <FaRegEdit />
        </button>
        <input
          type="file"
          ref={coverFileInput}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handlePhotoUpdate("coverImg", e.target.files[0])}
        />
      </div>

      {/* Profile Picture */}
      <div className="relative flex justify-center -mt-16 group">
        <div className="relative">
          <img
            src={ProfileDetails?.profileImg || "/default-profile.jpg"}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
          />
          {/* Profile Change Icon */}
          <button
            onClick={() => profileFileInput.current.click()}
            className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-2 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110"
          >
            <FaRegEdit />
          </button>
          <input
            type="file"
            ref={profileFileInput}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => handlePhotoUpdate("profileImg", e.target.files[0])}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-5 text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {ProfileDetails?.fullName || "Full Name"}
        </h1>
        <p className="text-sm text-gray-500">
          {ProfileDetails?.userName || "Username"}
        </p>
        <p className="mt-2 text-gray-600">
          {ProfileDetails?.bio || "Bio not provided"}
        </p>
        <p className="text-sm text-gray-500">
          {ProfileDetails?.location || "Location not provided"}
        </p>
        <p className="text-sm text-gray-500">
          {ProfileDetails?.phone || "Phone not provided"}
        </p>
        <p className="text-sm text-gray-500">
          {ProfileDetails?.website || "Website not provided"}
        </p>
      </div>

      {/* Additional Details */}
      <div className="mt-4 flex space-x-4 text-center mb-8">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {ProfileDetails?.followers || 0}
          </p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {ProfileDetails?.following || 0}
          </p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {ProfileDetails?.posts || 0}
          </p>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="mb-5 text-base text-blue-500 underline"
        >
          Edit Your Profile
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold text-blue-500">
                Edit Your Profile
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <RxCrossCircled />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4">
              {[
                { label: "Full Name", key: "fullName", type: "text" },
                { label: "Bio", key: "bio", type: "textarea" },
                { label: "Location", key: "location", type: "textarea" },
                { label: "Phone", key: "phone", type: "text" },
                { label: "Website", key: "website", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      rows="2"
                      value={ProfileFormValue[key]}
                      onChange={(e) => ProfileFormOnChange(key, e.target.value)}
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Write your ${label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={ProfileFormValue[key]}
                      onChange={(e) => ProfileFormOnChange(key, e.target.value)}
                      className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Write your ${label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
