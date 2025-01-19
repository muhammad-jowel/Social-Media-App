import React from 'react';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-purple-600">Reset Your Password</h2>
                <p className="text-sm text-center text-gray-500">
                    Enter your email address and we'll send you a verification code to reset your password.
                </p>
                <form className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                    >
                        Send Code
                    </button>
                </form>
                {/* Back to Login */}
                <div className="text-sm text-center text-gray-500">
                    <p>
                        Remember your password?{' '}
                        <Link to='/login' className="text-purple-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
