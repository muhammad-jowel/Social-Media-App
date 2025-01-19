import React from 'react';
import profile from '../../assets/images/profile.png';

const PostInput = () => {
    return (
        <div className='hidden sm:block'>
        <div className="flex items-center bg-white p-4 rounded-lg shadow mb-4 w-full">
            {/* Profile Image */}
            <img 
                src={profile} 
                alt="Profile" 
                className="rounded-full w-12 h-12 mr-4 hidden md:block"
            />

            {/* Input Field and Post Button */}
            <div className="flex items-center w-full">
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    className="flex-1 border-none outline-none p-2 rounded-lg bg-gray-100 text-lg"
                />
                <button className="hidden sm:block ml-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                    Post
                </button>
            </div>
        </div>
        </div>
    );
};

export default PostInput;
