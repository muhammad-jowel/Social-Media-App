import React, { useState, useEffect } from 'react';
import { IoSearchSharp, IoSettings, IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
// import profile from '../../assets/images/profile.png';
import PostStore from '../../store/PostStore';
import { toast } from 'react-toastify';
import UserStore from '../../store/UserStore';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'
import PostSubmitButton from '../../utility/PostSubmitButton';

const TopHeader = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const { PostCreateRequest, AllPostDetailsRequest, MyPostDetailsRequest } = PostStore();

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const {
        ProfileDetails,
        ProfileDetailsRequest,
      } = UserStore();
    
      useEffect(() => {
        (async () => {
          await ProfileDetailsRequest();
        })();
      }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isDropdownOpen && !e.target.closest('.dropdown')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isDropdownOpen]);

    const handlePostCreate = (e) => {
        e.preventDefault();

        if (!content && !image) {
            toast.error("Please enter some content or upload an image.");
            return;
        }

        if (image && !['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
            toast.error("Only JPEG, PNG, or GIF images are allowed.");
            return;
        }

        if (image && image.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Image size should not exceed 5MB.");
            return;
        }

        const formData = new FormData();
        if (content) formData.append('content', content);
        if (image) formData.append('postImg', image);

        PostCreateRequest(formData)
            .then(() => {
                setIsModalOpen(false);
                setContent('');
                setImage(null);
                toast.success("Post created successfully!");
                AllPostDetailsRequest()
                MyPostDetailsRequest();
            })
            .catch((err) => {
                console.error("Error creating post:", err.response || err.message || err);
                toast.error("There was an error creating the post. Please try again.");
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setContent('');
        setImage(null);
    };

    const { LogoutRequest } = UserStore();
  
  const onLogout = async () => {
    let res = await LogoutRequest();
    if (res) {
        toast.success("Logged Out Successfully!");
        Cookies.remove('token')
        sessionStorage.clear();
        localStorage.clear(); 
        window.location.href="/login";
    }
      
  }

    return (
        <div className="bg-white shadow-md py-3">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="font-bold text-purple-500 text-2xl">Social App</h1>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hidden sm:block">
                        <IoSearchSharp />
                    </span>
                    <input
                        type="text"
                        placeholder="Search friends"
                        className="hidden sm:block pl-10 pr-4 py-1 border rounded-full w-60 md:w-80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        aria-label="Search friends"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        className="bg-purple-500 text-white py-1 px-4 rounded-lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Post
                    </button>
                    <div className="relative dropdown">
                        <img 
                            src={ProfileDetails?.profileImg || "/default-profile.jpg"}  
                            alt="Profile" 
                            className="h-10 w-10 rounded-full border cursor-pointer"
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-40 bg-white shadow-lg rounded-lg py-2 animate-fade-in">
                                <Link to="/profile" className="flex items-center px-4 py-2">
                                    <CgProfile className="mr-2" /> Profile
                                </Link>
                                <a href="/settings" className="flex items-center px-4 py-2">
                                    <IoSettings className="mr-2" /> Settings
                                </a>
                                <button onClick={onLogout} className="flex items-center px-4 py-2">
                                    <IoLogOut className="mr-2" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-purple-500">Create a Post</h2>
                        <form onSubmit={handlePostCreate}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                aria-label="Post content"
                            />
                            <div className="mb-4">
                                <label className="block">Upload an image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                    className="mt-2 w-full"
                                    aria-label="Upload an image"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="py-1 px-4 bg-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <PostSubmitButton
                                    text='Post'
                                    type="submit"
                                    className="py-1 px-4 bg-purple-500 text-white rounded-lg"
                                >
                                    Post
                                </PostSubmitButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopHeader;
