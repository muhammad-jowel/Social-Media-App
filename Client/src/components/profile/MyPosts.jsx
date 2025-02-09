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
    CommentPostRequest,
    AllCommentsByPostID,
    AllCommentsByPostIDRequest,
    DeleteCommentRequest,
  } = usePostStore();
  const [loading, setLoading] = useState(true);
  const [dropdownPostId, setDropdownPostId] = useState(null);
  const [editMode, setEditMode] = useState(null); // Tracks the post being edited
  const [editContent, setEditContent] = useState(""); // Tracks the new content

  const [commentInput, setCommentInput] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [disLikedPosts, setDisLikedPosts] = useState({});

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
      const success = await LikePostRequest(id);
      if (success) {
        setLikedPosts((prev) => ({ ...prev, [id]: true }));
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
        setDisLikedPosts((prev) => ({ ...prev, [id]: true }));
        await MyPostDetailsRequest();
      } else {
        toast.error("Already Like!");
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const toggleCommentInput = (postID) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [postID]: !prev[postID],
    }));
  };

  const handleCommentChange = (postID, value) => {
    setCommentInput((prev) => ({ ...prev, [postID]: value }));
  };

  const handleCommentSubmit = async (postID) => {
    if (!commentInput[postID]?.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    const commentBody = {
      postID,
      comment: commentInput[postID],
    };

    try {
      toast.loading("Adding comment...");
      const success = await CommentPostRequest(commentBody);

      if (success) {
        toast.dismiss(); // Dismiss loading state
        toast.success("Comment added successfully!");
        setCommentInput((prev) => ({ ...prev, [postID]: "" }));

        await MyPostDetailsRequest();
      } else {
        toast.dismiss();
        toast.error("Failed to add comment!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error adding comment:", error);
      toast.error("Something went wrong! Please try again later.");
    }
  };

  const handleShowAllComments = async (id) => {
    try {
      await AllCommentsByPostIDRequest(id);
      setShowComments((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to load comments. Please try again later.");
    }
  };

  const handleDeleteComment = async (id) => {
    const confirmDelete = await DeleteAlert();
    if (!confirmDelete) return;

    try {
      const success = await DeleteCommentRequest(id);
      if (success) {
        await Swal.fire(
          "Deleted!",
          "Your comment has been deleted.",
          "success"
        );
        await MyPostDetailsRequest();
      } else {
        await Swal.fire("Failed!", "Failed to delete the comment.", "error");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      await Swal.fire(
        "Error!",
        "An error occurred while deleting the comment.",
        "error"
      );
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
              className="bg-white p-4 rounded-lg shadow mb-4 relative animate-fade-in"
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
                  <div className="absolute right-5 mt-28 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fade-in">
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
                    className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-lg"
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
                  text="Like"
                  count={`(${post.likes || 0})`}
                  hoverColor="text-green-500"
                  customColor={
                    likedPosts[post._id] ? "text-green-500" : "text-gray-500"
                  }
                  onClick={() => handleLike(post._id)}
                />
                <ActionButton
                  icon={BiDislike}
                  text="Dislike"
                  count={`(${post.dislikes || 0})`}
                  hoverColor="text-red-500"
                  customColor={
                    disLikedPosts[post._id] ? "text-red-500" : "text-gray-500"
                  }
                  onClick={() => handleDisLike(post._id)}
                />
                <ActionButton
                  icon={FaComment}
                  text="Comment"
                  count={`(${post.commentCount || 0})`}
                  hoverColor="text-blue-500"
                  onClick={() => toggleCommentInput(post._id)}
                />
                <ActionButton
                  icon={FaShare}
                  text="Share"
                  hoverColor="text-purple-500"
                />
              </div>
              {/* Comment Section */}
              {showCommentInput[post._id] && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput[post._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Comment
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={() => handleShowAllComments(post._id)}
                      className="text-blue-500 hover:underline"
                    >
                      {showComments[post._id]
                        ? "Hide Comments"
                        : "Show All Comments"}
                    </button>
                    {showComments[post._id] && (
                      <div className="mt-4">
                        {AllCommentsByPostID &&
                        AllCommentsByPostID.length > 0 ? (
                          AllCommentsByPostID.map((comment) => {
                            const formattedDate = new Date(
                              comment.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });

                            return (
                              <div
                                key={comment._id}
                                className="flex items-center mb-2"
                              >
                                <img
                                  src={
                                    comment.userDetails.profileImg ||
                                    "default-profile.jpg"
                                  }
                                  alt="Profile"
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div>
                                  <div className="flex items-center w-full space-x-2">
                                    <p className="font-semibold text-sm">
                                      {comment.userDetails.fullName}
                                    </p>
                                    <p className="text-sm justify-end ml-auto text-gray-500">
                                      {formattedDate}
                                    </p>
                                    <div className="me-auto">
                                      <HiDotsHorizontal
                                        className="text-lg text-gray-500 hover:text-red-500 cursor-pointer"
                                        onClick={() =>
                                          handleDeleteComment(comment._id)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <p className="text-gray-700">
                                    {comment.comment}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-gray-500">No comments yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No posts available.</p>
      )}
    </div>
  );
};

const ActionButton = ({ icon: Icon, text, count, hoverColor, customColor = "", onClick }) => (
  <button
    className={`flex items-center text-gray-500 ${customColor} hover:${hoverColor} transition`}
    aria-label={text}
    onClick={onClick}
  >
    <Icon className="text-xl mr-1" />
    <span className="hidden sm:inline">{text}</span>
    <span>{count}</span>
  </button>
);

export default MyPostSection;
