import React, { useEffect, useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { FaComment, FaShare } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import usePostStore from "../../store/PostStore";
import { DeleteAlert } from "../../utility/Utility";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const MyPostSection = () => {
  const {
    MyPostDetails,
    MyPostDetailsRequest,
    DeletePostRequest,
    UpdatePostRequest,
    LikePostRequest,
    DislikePostRequest,
  } = usePostStore();
  const [loading, setLoading] = useState(true);
  const [dropdownPostId, setDropdownPostId] = useState(null);
  const [editMode, setEditMode] = useState(null); // Tracks the post being edited
  const [editContent, setEditContent] = useState(""); // Tracks the new content

  useEffect(() => {
    (async () => {
      await MyPostDetailsRequest();
      setLoading(false);
    })();
  }, [MyPostDetailsRequest]);

  if (loading) {
    return <p className="text-gray-500 text-center">Loading posts...</p>;
  }

  const toggleDropdown = (postId) => {
    setDropdownPostId((prev) => (prev === postId ? null : postId));
  };

  const handleEdit = (post) => {
    setEditMode(post._id); // Set the post ID being edited
    setEditContent(post.content); // Pre-fill the content
    setDropdownPostId(null);
  };

  const handleEditSubmit = async (postId) => {
    try {
      const success = await UpdatePostRequest({
        id: postId,
        content: editContent,
      });
      if (success) {
        await Swal.fire("Updated!", "Your post has been updated.", "success");
        setEditMode(null); // Exit edit mode
        await MyPostDetailsRequest(); // Refresh the posts
      } else {
        await Swal.fire("Failed!", "Failed to update the post.", "error");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      await Swal.fire(
        "Error!",
        "An error occurred while updating the post.",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await DeleteAlert();
    if (!confirmDelete) return;

    try {
      const success = await DeletePostRequest(id);
      if (success) {
        await Swal.fire("Deleted!", "Your post has been deleted.", "success");
        setDropdownPostId(null);
        await MyPostDetailsRequest();
      } else {
        await Swal.fire("Failed!", "Failed to delete the post.", "error");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      await Swal.fire(
        "Error!",
        "An error occurred while deleting the post.",
        "error"
      );
    }
  };

  const handleLike = async (id) => {
    try {
      const success = await LikePostRequest(id); // Send like request to backend
      if (success) {
        await MyPostDetailsRequest();
      } else {
        toast.error("Already DisLike!");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDisLike = async (id) => {
    try {
      const success = await DislikePostRequest(id);
      if (success) {
        await MyPostDetailsRequest();
      } else {
        toast.error("Already Like!");
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  return (
    <div>
      {MyPostDetails && MyPostDetails.length > 0 ? (
        MyPostDetails.map((post, index) => {
          const createdAt = new Date(post.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );

          const userDetails = post.userDetails?.[0] || {
            fullName: "Unknown User",
            profileImg: "default-profile.jpg",
          };

          return (
            <div
              key={post._id || index}
              className="bg-white p-4 rounded-lg shadow mb-4 relative"
            >
              {/* Header Section */}
              <div className="flex items-center mb-4">
                <img
                  src={userDetails.profileImg || "default-profile.jpg"}
                  alt="Profile"
                  onError={(e) => (e.target.src = "default-profile.jpg")}
                  className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {userDetails.fullName}
                  </h2>
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
                  <div className="absolute right-5 mt-28 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEdit(post)}
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
              {editMode === post._id ? (
                <div className="mb-4">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => handleEditSubmit(post._id)}
                  >
                    Save
                  </button>
                  <button
                    className="mt-2 ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
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
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <ActionButton
                  icon={BiLike}
                  text={`Like (${post.likes || 0})`}
                  hoverColor="text-red-500"
                  onClick={() => handleLike(post._id)}
                />
                <ActionButton
                  icon={BiDislike}
                  text={`Dislike (${post.dislikes || 0})`}
                  hoverColor="text-red-500"
                  onClick={() => handleDisLike(post._id)}
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

export default MyPostSection;
