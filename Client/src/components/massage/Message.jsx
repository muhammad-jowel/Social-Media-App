import React from 'react';
import { Link } from 'react-router-dom';

const Message = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 rounded-lg">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <h1 className="mt-6 text-2xl font-semibold text-blue-600">Under Maintenance</h1>
            <p className="mt-2 text-lg text-gray-600 text-center max-w-md">
                We're currently updating the Message page to bring you a better experience. 
                Thank you for your patience!
            </p>
            <Link to='/' className="mt-4 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400">
                Go Back
            </Link>
        </div>
    );
};

export default Message;