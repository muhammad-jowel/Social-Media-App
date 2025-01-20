import mongoose from "mongoose";
import PostModel from "../model/PostModel.js";
const ObjectID = mongoose.Types.ObjectId;

import path from 'path';
import fs from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

// __dirname Define for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




// Create a post
export const CreatePostService = async (req, res) => {
    try {
        let user_id = req.headers.user_id;
        if (!user_id) {
            return { status: "Fail", message: "User ID is required in headers." };
        }

        let reqBody = req.body;
        reqBody.userID = user_id;

        // Handle post image upload
        const uploadedFiles = req.files || {};
        if (uploadedFiles.postImg) {
            const postImgPath = path.join(__dirname, '../../uploads', `${Date.now()}-${uploadedFiles.postImg.name}`);

            // Save the file temporarily
            await uploadedFiles.postImg.mv(postImgPath);

            try {
                const cloudinaryResult = await cloudinary.uploader.upload(postImgPath, {
                    public_id: `post_${Date.now()}_${uploadedFiles.postImg.name}`,
                });

                reqBody.postImg = cloudinaryResult.secure_url;

                // Delete the temporary local file
                await fs.unlink(postImgPath);
            } catch (error) {
                await fs.unlink(postImgPath);
                return {
                    status: 'Fail',
                    message: 'Error uploading post image to Cloudinary',
                    error: error.toString(),
                };
            }
        }

        // Create the post in the database
        let data = await PostModel.create(reqBody);
        return { status: 'success', message: 'Post created successfully', data: data };
    } catch (e) {
        return { status: "Fail", message: e.toString() };
    }
};



// Read My post service
export const ReadPostService = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.headers.user_id);

        // Aggregation pipeline
        const data = await PostModel.aggregate([
            {
                $match: { userID: user_id }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    postImg: 1,
                    content: 1,
                    createdAt: 1,
                    "userDetails.fullName": 1,
                    "userDetails.profileImg": 1
                }
            },
            {
                $sort: { createdAt: -1 } // Optional: Sort by most recent
            }
        ]);

        if (data.length === 0) {
            return { status: "success", data: [], message: "No posts found for the user." };
        }

        return { status: "success", data };
    } catch (e) {
        console.error("Error in ReadPostService:", e); // Log error for debugging
        return { status: "Fail", message: e.message || "An error occurred." };
    }
};





// Update Post service
export const UpdatePostService = async (req, res) => {
    try {
        let user_id = new ObjectID(req.headers.user_id);
        let postID  = new ObjectID(req.body.id);
        let reqBody = req.body;
        reqBody.userID = user_id;

        const data = await PostModel.updateOne(
            { userID: user_id, _id : postID},
            { $set: reqBody }
        );
        return { status: "success", data : data };
    } catch (e) {
        return { status: "Fail", message: e.toString() };
    }
};


// Delete Post service
export const DeletePostService = async (req) => {
    try {
        let user_id = new ObjectID(req.headers['user_id']);
        let postID  = new ObjectID(req.body.id);
        
        await PostModel.deleteOne({_id : postID, userID : user_id})
        return {status:"success",message:"Delete Successfully"};
    }catch(error) {
        return {status:"fail",data:error.toString()}
    }
};



// Read All Post service
export const ReadAllPostService = async () => {
    try {
      let data = await PostModel.aggregate([
        {
          $lookup: {
            from: "users", // Ensure this is the correct collection name
            localField: "userID",  // PostModel's userID field
            foreignField: "_id",  // User's _id field
            as: "userDetails", // Store user details in userDetails array
          },
        },
        {
          $project: {
            postImg: 1,
            content: 1,
            createdAt: 1,
            "userDetails.fullName": 1,  // Ensure fullName is selected
            "userDetails.profileImg": 1,  // Ensure profileImg is selected
            "userDetails._id": 1,  // Ensure profileImg is selected
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);
  
  
      if (data.length === 0) {
        return { status: "success", data: [], message: "No posts found." };
      }
  
      return { status: "success", data };
    } catch (e) {
      return { status: "Fail", message: e.toString() };
    }
  };
  







// Read Post by ID service
export const ReadPostByIDService = async (req, res) => {
    try {
        let postID = new ObjectID(req.params.id);
        let data = await PostModel.findById(postID);
        if (data) {
            return { status: 'success', data: data };
        } else {
            return { status: 'Fail', message: 'Post not found' };
        }
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};


// Like Post service
export const LikePostService = async (req, res) => {
    try {
        const postID = new ObjectID(req.body.id);
        const userID = new ObjectID(req.headers.user_id);

        const post = await PostModel.findById(postID);
        if (!post) {
            return { status: 'Fail', message: 'Post not found' };
        }

        const hasLiked = post.likedBy.includes(userID);
        const hasDisliked = post.dislikedBy.includes(userID);

        if (hasDisliked) {
            return { status: 'Fail', message: 'User has already disliked this post' };
        }

        const update = hasLiked
            ? { $inc: { likes: -1 }, $pull: { likedBy: userID } } // Withdraw like
            : { $inc: { likes: 1 }, $addToSet: { likedBy: userID } }; // Like

        await PostModel.updateOne({ _id: postID }, update);

 
        const updatedPost = await PostModel.aggregate([
            { $match: { _id: postID } },
            {
                $lookup: {
                    from: "users",
                    localField: "likedBy",
                    foreignField: "_id",
                    as: "likedByUsers"
                }
            },
            {
                $project: {
                    likedByUsers: {
                        _id: 1,
                        fullName: 1
                    }
                }
            }
        ]);


        return { 
            status: 'success', 
            message: hasLiked ? 'Like withdrawn' : 'Post liked',
            likedBy: updatedPost[0].likedByUsers // List of users who liked with fullName
        };
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};



// Dis like Post service
export const DisLikePostService = async (req, res) => {
    try {
        const postID = new ObjectID(req.body.id);
        const userID = new ObjectID(req.headers.user_id);

        const post = await PostModel.findById(postID);
        if (!post) {
            return { status: 'Fail', message: 'Post not found' };
        }

        const hasDisliked = post.dislikedBy.includes(userID);
        const hasLiked = post.likedBy.includes(userID);

        if (hasLiked) {
            return { status: 'Fail', message: 'User has already liked this post' };
        }

        const update = hasDisliked
            ? { $inc: { dislikes: -1 }, $pull: { dislikedBy: userID } } // Withdraw dislike
            : { $inc: { dislikes: 1 }, $addToSet: { dislikedBy: userID } }; // Dislike

        await PostModel.updateOne({ _id: postID }, update);


        const updatedPost = await PostModel.aggregate([
            { $match: { _id: postID } },
            {
                $lookup: {
                    from: "users",
                    localField: "dislikedBy",
                    foreignField: "_id",
                    as: "dislikedByUsers"
                }
            },
            {
                $project: {
                    dislikedByUsers: {
                        _id: 1,
                        fullName: 1
                    }
                }
            }
        ]);

        return { 
            status: 'success', 
            message: hasDisliked ? 'Dislike withdrawn' : 'Post disliked',
            dislikedBy: updatedPost[0].dislikedByUsers // List of users who disliked with fullName
        };
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};



// Comment Post service
// export const CommentPostService = async (req) => {
//     try {
//         const postID = new ObjectID(req.body.postID);
//         const userID = new ObjectID(req.headers.user_id);

//         // Fetch user details
//         const user = await UserModel.findById(userID).select('fullName img');
//         if (!user) {
//             return { status: 'Fail', message: 'User not found' };
//         }

//         const comment = {
//             userID: userID,
//             fullName: user.fullName, // Include fullName
//             img: user.img, // Include img
//             comment: req.body.comment,
//             timestamp: new Date()
//         };

//         // Update the post with the new comment
//         const data = await PostModel.updateOne(
//             { _id: postID },
//             { $push: { comments: comment } }
//         );

//         // Verify that the comment was added correctly
//         const updatedPost = await PostModel.findById(postID).select('comments');

//         return { status: 'success', message: 'Comment added successfully', data: updatedPost.comments };
//     } catch (e) {
//         return { status: 'Fail', message: e.toString() };
//     }
// };



// Delete a comment service
// export const DeleteCommentService = async (req) => {
//     try {
//         const postID = new ObjectID(req.body.postID);
//         const commentID = new ObjectID(req.body.commentID);
//         const userID = new ObjectID(req.headers.user_id);

//         // Find the post and check if the comment belongs to the user
//         const post = await PostModel.findOne({ _id: postID, "comments._id": commentID, "comments.userID": userID });
//         if (!post) {
//             return { status: 'Fail', message: 'Comment not found or user not authorized' };
//         }

//         // Delete the comment
//         const data = await PostModel.updateOne(
//             { _id: postID },
//             { $pull: { comments: { _id: commentID } } }
//         );

//         return { status: 'success', message: 'Comment deleted successfully', data: data };
//     } catch (e) {
//         return { status: 'Fail', message: e.toString() };
//     }
// };


// Read All Comments By Post ID service
// export const ReadAllCommentsByPostIDService = async (req) => {
//     try {
//         const postID = new ObjectID(req.params.id);

//         // Use aggregation to fetch comments with user details
//         const postWithComments = await PostModel.aggregate([
//             { $match: { _id: postID } },
//             { $unwind: "$comments" },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "comments.userID",
//                     foreignField: "_id",
//                     as: "commentUser"
//                 }
//             },
//             { $unwind: "$commentUser" },
//             {
//                 $group: {
//                     _id: "$_id",
//                     comments: {
//                         $push: {
//                             userID: "$comments.userID",
//                             fullName: "$commentUser.fullName",
//                             img: "$commentUser.img",
//                             comment: "$comments.comment",
//                             timestamp: "$comments.timestamp"
//                         }
//                     }
//                 }
//             }
//         ]);

//         if (!postWithComments.length) {
//             return { status: 'Fail', message: 'Post not found' };
//         }

//         return { status: 'success', data: postWithComments[0].comments };
//     } catch (e) {
//         return { status: 'Fail', message: e.toString() };
//     }
// };



// Share Post service
// export const SharePostService = async (req, res) => {
//     try {
//         let postID = new ObjectID(req.body.postID);
//         let userID = new ObjectID(req.headers.user_id);
//         let share = {
//             userID: userID,
//             timestamp: new Date()
//         };

//         const data = await PostModel.updateOne(
//             { _id: postID },
//             { $push: { shares: share } }
//         );
//         return { status: 'success', message: 'Post shared successfully', data: data };
//     } catch (e) {
//         return { status: 'Fail', message: e.toString() };
//     }
// };