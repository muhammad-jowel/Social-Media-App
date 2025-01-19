import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UserStore from "../../store/UserStore";
import { toast } from "react-toastify";
import SubmitButton from "../../utility/SubmitButton";

const Login = () => {
  const Navigate = useNavigate();
  const { LoginFormValue, LoginFormOnChange, LoginRequest } = UserStore();

  const onFormSubmit = async (event) => {
    event.preventDefault();
  
    // Basic Validation
    if (!LoginFormValue.email || !LoginFormValue.password) {
      toast.error("Email and Password are required");
      return;
    }
  
    const postBody = { ...LoginFormValue };
    try {
      let response = await LoginRequest(postBody);
      if (response.status === "success") {
        toast.success("Login Success");
        Navigate("/");
      } else {
        toast.error(response.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error(`Error logging in: ${err.message || "Unexpected error occurred"}`);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-purple-600">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={onFormSubmit}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              value={LoginFormValue.email}
              onChange={(event) => {
                LoginFormOnChange("email", event.target.value);
              }}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              value={LoginFormValue.password}
              onChange={(event) => {
                LoginFormOnChange("password", event.target.value);
              }}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Submit Button */}
          <SubmitButton
            type="submit"
            text='Login'
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
          >
            {/* Login */}
          </SubmitButton>
        </form>
        {/* Additional Links */}
        <div className="text-sm text-center text-gray-500">
          <p>
            <Link to="/forget-password" className="text-purple-600 hover:underline">
              Forgot your password?
            </Link>
          </p>
          <p className="mt-1">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
