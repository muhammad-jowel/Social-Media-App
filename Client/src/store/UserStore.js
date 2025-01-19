import {create} from "zustand";
import axios from "axios";
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import { BaseUrl } from "../utility/BaseUrl";
import { unauthorized } from "../utility/Utility";



const UserStore = create((set) => ({

    isFormSubmit: false,

    isLogin : () => {
        return !!Cookie.get('token')
    },


    RegisterFormValue : {fullName : '', userName : '', email : '', password : '', confirmPassword: ''},

    RegisterFormOnChange : (name, value) => {
        set((state) => ({
            RegisterFormValue: {
                ...state.RegisterFormValue,
                [name]: value
            }
        }))
    },


    // Register Request-
    RegisterRequest : async (postBody) => {
        try {
            set({isFormSubmit: true});
            let response = await axios.post(`${BaseUrl}Registration`, postBody);
            set({isFormSubmit: false});
            return response.data;
        } catch (e) {
            console.error('Error registering user:', e)
        }
    },



    LoginFormValue : {email : '', password : ''},

    LoginFormOnChange : (name, value) => {
        set((state) => ({
            LoginFormValue: {
                ...state.LoginFormValue,
                [name]: value
            }
        }))
    },


    // Login Request
    LoginRequest : async (postBody) => {
        try {
            set({isFormSubmit: true});
            let response = await axios.post(`${BaseUrl}Login`, postBody);
            set({isFormSubmit: false});
            Cookie.set('token', response.data.token);
            return response.data;
        } catch (e) {
            console.error('Error login user:', e)
        }
    },




    ProfileFormValue : {coverImg: '', profileImg: '', fullName: '', bio: '', location: '', phone: '', website: ''},

    ProfileFormOnChange : (name, value) => {
        set((state) => ({
            ProfileFormValue: {
                ...state.ProfileFormValue,
                [name]: value
            }
        }))
    },

    // User Profile Details
    ProfileDetails : null,
    ProfileDetailsRequest : async () => {
        try {
            let response = await axios.get(`${BaseUrl}Read-Profile`, {
                headers: {
                    token: Cookies.get('token')
                }
            })

            if (response.data.status === 'success') {
                set({ProfileDetails : response.data['data']});
                set({ProfileFormValue : response.data['data']});
            } else {
                set({ProfileDetails : []});
            }
        } catch (err) {
            unauthorized(err.response.status);
        }
    },


    // User Profile updates
    ProfileUpdateRequest : async (PostBody) => {
        try {
            set({ProfileDetails : null});
            let response = await axios.post(`${BaseUrl}Update-Profile`, PostBody, {
                headers: {
                    token: Cookies.get('token')
                }
            });
            return response.data['status'] === 'success';
        } catch (err) {
            unauthorized(err.response.status);
        }
    },










    // OtpFormValue : {otp : ''},

    // OtpFormOnChange : (name, value) => {
    //     set((state) => ({
    //         OtpFormValue: {
    //             ...state.OtpFormValue,
    //             [name]: value
    //         }
    //     }))
    // },

    
    // Otp Verify
    // VerifyLoginRequest : async (otp) => {
    //     try {  
    //         let email = sessionStorage.getItem('email');
    //         let response = await axios.post(`https://creative-agency-lake-five.vercel.app/api/VerifyLogin`, {email: email, otp: otp});
    //         Cookie.set('token', response.data.token);
    //         return response.data
    //     } catch (e) {
    //         console.error('Error verifying OTP:', e)
    //     }
    // },


    // User Logout Request
    LogoutRequest : async () => {
        let response = await axios.get(`${BaseUrl}Logout`, {
            headers : {
                token: Cookies.get('token')
            }
        });
        return response.data['status'] === 'success';
    }



}));

export default UserStore;