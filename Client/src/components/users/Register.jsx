import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UserStore from "../../store/UserStore";
import { toast } from "react-toastify";
import ValidationHelper from "../../utility/ValidationHelper";
import SubmitButton from "../../utility/SubmitButton";

const Register = () => {
  const Navigate = useNavigate();
  const { RegisterFormValue, RegisterFormOnChange, RegisterRequest } =
    UserStore();

  const onFormSubmit = async (event) => {
    event.preventDefault();

    // Check if any field is empty
    const { fullName, userName, email, password, confirmPassword } = RegisterFormValue;
    if (!fullName || !userName || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    // Validate email format
    if (!ValidationHelper.IsEmail(RegisterFormValue.email)) {
        toast.error("Invalid email format!");
        return;
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const postBody = { ...RegisterFormValue };
    try {
      let response = await RegisterRequest(postBody);
      if (response.status === "success") {
        toast.success("Registration Success");
        Navigate("/login");
      } else {
        toast.error("Registration Failure");
      }
    } catch (err) {
      toast.error("Error registering user:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-purple-600">
          Create Your Account
        </h2>
        <form className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              required
              value={RegisterFormValue.fullName}
              onChange={(event) => {
                RegisterFormOnChange("fullName", event.target.value);
              }}
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              required
              value={RegisterFormValue.userName}
              onChange={(event) => {
                RegisterFormOnChange("userName", event.target.value);
              }}
              type="text"
              id="username"
              placeholder="Enter a username"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              required
              value={RegisterFormValue.email}
              onChange={(event) => {
                RegisterFormOnChange("email", event.target.value);
              }}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              required
              value={RegisterFormValue.password}
              onChange={(event) => {
                RegisterFormOnChange("password", event.target.value);
              }}
              type="password"
              id="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              required
              value={RegisterFormValue.confirmPassword} 
              onChange={(event) => { RegisterFormOnChange('confirmPassword', event.target.value) }}
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Submit Button */}
          <SubmitButton
            onClick={onFormSubmit}
            text="Register"
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
          >
            Register
          </SubmitButton>
        </form>
        {/* Additional Links */}
        <div className="text-sm text-center text-gray-500">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
