import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NotificationPage from "./pages/NotificationPage";
import MessagePage from "./pages/MessagePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import OtpVerifyPage from "./pages/OtpVerifyPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import AllFriendsPage from "./pages/AllFriendsPage";
import FriendRequestPage from "./pages/FriendRequestPage";
import SettingsPage from "./pages/SettingsPage";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/forget-password" element={<ForgetPasswordPage/>}/>
        <Route path="/otp-verify" element={<OtpVerifyPage/>}/>
        <Route path="/new-password" element={<NewPasswordPage/>}/>


        <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
        <Route path="/notifications" element={<ProtectedRoute><NotificationPage/></ProtectedRoute>}/>
        <Route path="/messages" element={<ProtectedRoute><MessagePage/></ProtectedRoute>}/>
        <Route path="/all-friends" element={<ProtectedRoute><AllFriendsPage/></ProtectedRoute>}/>
        <Route path="/friends-request" element={<ProtectedRoute><FriendRequestPage/></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
