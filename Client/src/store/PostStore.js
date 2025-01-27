import axios from "axios";
import { create } from "zustand";
import { unauthorized } from "../utility/Utility";
import { BaseUrl } from "../utility/BaseUrl";
import Cookie from "js-cookie";
import Cookies from "js-cookie";

const PostStore = create((set) => ({

    isFormSubmit: false,

    // Create a new Post
    PostCreateRequest: async (postBody) => {
        try {
            set({isFormSubmit: true});
            let response = await axios.post(`${BaseUrl}Create-Post`, postBody, {
                headers: {
                    token: Cookies.get('token')
                }
            });
            set({isFormSubmit: false});
            return response.data.data;
        } catch (err) {
            unauthorized(err.response); // Custom function to handle unauthorized errors
            throw err;
        }
    },


    // Single Post Details
    MyPostDetails: null,
    MyPostDetailsRequest: async () => {
        try {
            let response = await axios.get(`${BaseUrl}Read-Post`, {
                headers: {
                    token: Cookies.get('token'),
                },
            });

            if (response.data.status === 'success' && response.data.data) {
                set({ MyPostDetails: response.data['data'] });
            } else {
                set({ MyPostDetails: [] });
            }
        } catch (err) {
            console.error("Error in MyPostDetailsRequest:", err); // Debugging log
            unauthorized(err.response?.status || 500); // Handle the error gracefully
        }
    },



    // All Post Details
    AllPostDetails: null,
    AllPostDetailsRequest: async () => {
        try {
        let response = await axios.get(`${BaseUrl}Read-All-Post`, {
            headers: {
            token: Cookies.get('token'),
            },
        });

        if (response.data.status === 'success') {
            set({ AllPostDetails: response.data.data });
        } else {
            set({ AllPostDetails: [] });
        }
        } catch (err) {
        console.error("Error fetching posts:", err.response);
        }
    },


    // Delete a Post
    DeletePostRequest: async (id) => {
        try {
            let response = await axios.delete(`${BaseUrl}Delete-Post`,{
                data: { id },
                headers: {
                    token: Cookies.get('token'),
                },
            });
            return response.data.status ==='success';
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },


    // Update a Post
    UpdatePostRequest: async (postBody) => {
        try {
            let response = await axios.post(`${BaseUrl}Update-Post`, postBody, {
                headers: {
                    token: Cookies.get('token'),
                },
            });
            return response.data.status ==='success';
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },


    // Like a Post
    LikePostRequest: async (id) => {
        try {
            let response = await axios.post(`${BaseUrl}Like-Post`, { id }, {
                headers: {
                    token: Cookies.get('token'),
                },
            });
            return response.data.status ==='success';
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },


    // Dislike a Post
    DislikePostRequest: async (id) => {
        try {
            let response = await axios.post(`${BaseUrl}Dislike-Post`, { id }, {
                headers: {
                    token: Cookies.get('token'),
                },
            });
            return response.data.status ==='success';
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },


    // Comment on a Post
    CommentPostRequest: async (commentBody) => {
        try {
            let response = await axios.post(`${BaseUrl}Create-Comment`, commentBody, {
                headers: {
                    token: Cookies.get('token'),
                },
            });
            return response.data.status ==='success';
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },


    // Read All Comments By Post ID
    AllCommentsByPostID: null,
    AllCommentsByPostIDRequest: async (id) => {
        try {
            let response = await axios.get(`${BaseUrl}Read-Comments/${id}`, 
                {
                    headers: {
                        token: Cookies.get('token'),
                    },
                }
            );
            if (response.data.status === 'success') {
                set({ AllCommentsByPostID: response.data.data });
            } else {
                set({ AllCommentsByPostID: [] });
            }
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },


    // Delete a Comment
    DeleteCommentRequest: async (id) => {
        try {
            let response = await axios.delete(`${BaseUrl}Delete-Comment`, {
                data: { id },
                headers: {
                    token: Cookies.get('token'),
                },
            });
            return response.data.status ==='success';
        } catch (err) {
            unauthorized(err.response);
            throw err;
        }
    },




    
}));

export default PostStore;
