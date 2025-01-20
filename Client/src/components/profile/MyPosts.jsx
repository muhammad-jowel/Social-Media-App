import React, { useEffect, useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { FaComment, FaShare } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import usePostStore from "../../store/PostStore";

const MyPostSection = () => {
  const { MyPostDetails, MyPostDetailsRequest } = usePostStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await MyPostDetailsRequest();
      setLoading(false);
    })();
  }, [MyPostDetailsRequest]);

  if (loading) {
    return <p className="text-gray-500 text-center">Loading posts...</p>;
  }

  return (
    <div>
      {MyPostDetails && MyPostDetails.length > 0 ? (
        MyPostDetails.map((post, index) => {
          const createdAt = new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          // Use optional chaining and fallback for empty userDetails
          const userDetails = post.userDetails?.[0] || {
            fullName: "Unknown User",
            profileImg: "default-profile.jpg",
          };

          return (
            <div key={post._id || index} className="bg-white p-4 rounded-lg shadow mb-4">
              {/* Header Section */}
              <div className="flex items-center mb-4">
                <img
                  src={userDetails.profileImg || 'default-profile.jpg'}
                  alt="Profile"
                  onError={(e) => (e.target.src = "default-profile.jpg")}
                  className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                  <h2 className="font-semibold text-lg">{userDetails.fullName}</h2>
                  <p className="text-gray-500 text-sm">{createdAt}</p>
                </div>
                <div className="ml-auto">
                  <HiDotsHorizontal
                    className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer"
                    aria-label="More options"
                  />
                </div>
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
                <ActionButton icon={BiLike} text="Like" hoverColor="text-blue-500" />
                <ActionButton icon={BiDislike} text="Dislike" hoverColor="text-red-500" />
                <ActionButton icon={FaComment} text="Comment" hoverColor="text-green-500" />
                <ActionButton icon={FaShare} text="Share" hoverColor="text-purple-500" />
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
