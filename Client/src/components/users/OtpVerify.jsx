import React from 'react';

const OtpVerify = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-purple-600">Verify OTP</h2>
                <p className="text-sm text-center text-gray-500">
                    Enter the OTP sent to your registered email to verify your account.
                </p>
                <form className="space-y-4">
                    {/* OTP Input */}
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter OTP"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    {/* Verify Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                    >
                        Verify OTP
                    </button>
                </form>
                {/* Resend OTP */}
                <div className="text-sm text-center text-gray-500">
                    <p>
                        Didn't receive the OTP?{' '}
                        <a href="#" className="text-purple-600 hover:underline">
                            Resend OTP
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
