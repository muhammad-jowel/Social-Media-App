import React, { useEffect, useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { FaComment, FaShare } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import usePostStore from "../../store/PostStore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PostSection = () => {
  const { AllPostDetails, AllPostDetailsRequest, DeletePostRequest } = usePostStore();
  const [loading, setLoading] = useState(true);
  const [dropdownPostId, setDropdownPostId] = useState(null);

  useEffect(() => {
    (async () => {
      await AllPostDetailsRequest();
      setLoading(false);
    })();
  }, [AllPostDetailsRequest]);

  if (loading) {
    return <p className="text-gray-500 text-center">Loading posts...</p>;
  }


  const toggleDropdown = (postId) => {
    setDropdownPostId((prev) => (prev === postId ? null : postId));
  };

  const handleEdit = (postId) => {
    alert(`Edit clicked for post ${postId}`);
    setDropdownPostId(null);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const success = await DeletePostRequest(postId);
      if (success) {
        alert("Post deleted successfully");
        setDropdownPostId(null);
        await AllPostDetailsRequest(); // Refresh posts
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };


  return (
    <div>
      {AllPostDetails && AllPostDetails.length > 0 ? (
        AllPostDetails.map((post, index) => {
          const createdAt = new Date(post.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );

          // Use optional chaining and fallback for empty userDetails
          const userDetails = post.userDetails?.[0] || {
            fullName: "Unknown User",
            profileImg: "default-profile.jpg",
          };

          return (
            <div
              key={post._id || index}
              className="bg-white p-4 rounded-lg shadow mb-4"
            >
              {/* Header Section */}
              <div className="flex items-center mb-4 relative">
                <img
                  src={userDetails.profileImg || "default-profile.jpg"}
                  alt="Profile"
                  onError={(e) => (e.target.src = "default-profile.jpg")}
                  className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                  <Link to={`/profile`} className="font-semibold text-lg">
                    {userDetails.fullName}
                  </Link>
                  <p className="text-gray-500 text-sm">{createdAt}</p>
                </div>
                <div className="ml-auto">
                  <HiDotsHorizontal
                    className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer"
                    aria-label="More options"
                    onClick={() => toggleDropdown(post._id)}
                  />
                </div>
                {dropdownPostId === post._id && (
                  <div className="absolute right-0 mt-28 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEdit(post._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800">{post.content}</p>
                {post.postImg && (
                  <img
                    src={post.postImg}
                    alt="Post"
                    className="mt-4 rounded-lg w-full object-cover"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <ActionButton
                  icon={BiLike}
                  text="Like"
                  hoverColor="text-blue-500"
                />
                <ActionButton
                  icon={BiDislike}
                  text="Dislike"
                  hoverColor="text-red-500"
                />
                <ActionButton
                  icon={FaComment}
                  text="Comment"
                  hoverColor="text-green-500"
                />
                <ActionButton
                  icon={FaShare}
                  text="Share"
                  hoverColor="text-purple-500"
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No posts available.</p>
      )}
    </div>
  );
};

const ActionButton = ({ icon: Icon, text, hoverColor, onClick }) => (
  <button
    className={`flex items-center text-gray-500 hover:${hoverColor} transition`}
    aria-label={text}
    onClick={onClick}
  >
    <Icon className="text-xl mr-1" />
    <span className="hidden sm:inline">{text}</span>
  </button>
);

export default PostSection;
