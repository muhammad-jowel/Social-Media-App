import express from 'express';
const router = express.Router();

import * as UserController from '../app/controllers/UserController.js';
import * as PostController from '../app/controllers/PostController.js';
import * as CommentController from '../app/controllers/CommentController.js';


import * as FileController from '../app/controllers/FileController.js';
import AuthMiddleware from '../app/middlewares/AuthMiddleware.js';
// import { multerMiddleware } from '../app/service/FileService.js';
// import upload from '../app/middlewares/UploadMiddleware.js';
// import { uploadFile } from '../app/controllers/FileController.js';


// User Router
router.post('/Registration', UserController.Registration); //Done
router.post('/Check-Username', UserController.Registration); //Done
router.post('/Login', UserController.Login); //Done
router.get('/Read-Profile', AuthMiddleware, UserController.ReadProfile); //Done
router.post('/Update-Profile', AuthMiddleware, UserController.UpdateProfile); //Done
router.get('/Logout', AuthMiddleware, UserController.Logout); //Done
router.post('/Reset-Password', UserController.ResetPassword); //Done
router.post('/Verify-OTP', UserController.OTPVerification); //Done
router.post('/Update-Password', UserController.UpdatePassword); //Done
router.delete('/Delete-User', AuthMiddleware, UserController.DeleteAccount); //Done
router.get('/Read-Users-Details', AuthMiddleware, UserController.getUserProfile); //Done



// Post Router
router.post('/Create-Post', AuthMiddleware, PostController.CreatePost); //Done
router.get('/Read-Post', AuthMiddleware, PostController.ReadPost); //Done
router.post('/Update-Post', AuthMiddleware, PostController.UpdatePost); //Done
router.delete('/Delete-Post', AuthMiddleware, PostController.DeletePost); //Done

router.get('/Read-All-Post', AuthMiddleware, PostController.ReadAllPost); //Done
router.get('/Read-Post-By-Id/:id', AuthMiddleware, PostController.ReadPostById); //Done

router.post('/Like-Post', AuthMiddleware, PostController.LikePost); //Done
router.post('/Dislike-Post', AuthMiddleware, PostController.DislikePost); //Done

router.post('/Create-Comment', AuthMiddleware, CommentController.CreateComment); //Done
router.get('/Read-Comments/:id', AuthMiddleware, CommentController.ReadAllCommentsByPostId); //Done
router.delete('/Delete-Comment', AuthMiddleware, CommentController.DeleteComment); //Done


// File Upload Router
router.post('/Upload-Single-File', AuthMiddleware, FileController.uploadSingleFile);
router.post('/Upload-Multiple-Files', FileController.uploadMultipleFiles);
router.get('/Read-File/:fileName', FileController.readFile);
router.delete('/Delete-Single-File/:fileName', FileController.deleteSingleFile);





// router.post("/upload", upload.single("file"), uploadFile);

//router.post('/Reply-Comment', AuthMiddleware, PostController.ReplyComment);
//router.get('/Read-Comments/:postId', AuthMiddleware, PostController.ReadComments);
//router.get('/Read-Replies/:commentId', AuthMiddleware, PostController.ReadReplies);
//router.post('/Flag-Post', AuthMiddleware, PostController.FlagPost);
//router.get('/Read-Flagged-Posts', AuthMiddleware, PostController.ReadFlaggedPosts);
//router.get('/Read-Post-Likes/:postId', AuthMiddleware, PostController.ReadPostLikes);
// router.get('/Read-Post-Dislikes/:postId', AuthMiddleware, PostController.ReadPostDislikes);
// router.get('/Read-User-Posts/:userId', AuthMiddleware, PostController.ReadUserPosts);
// router.get('/Read-User-Liked-Posts/:userId', AuthMiddleware, PostController.ReadUserLikedPosts);
// router.get('/Read-User-Disliked-Posts/:userId', AuthMiddleware, PostController.ReadUserDislikedPosts);
// router.get('/Read-User-Comments/:userId', AuthMiddleware, PostController.ReadUserComments);
// router.get('/Read-User-Replies/:userId', AuthMiddleware, PostController.ReadUserReplies);
// router.get('/Read-User-Flagged-Posts/:userId', AuthMiddleware, PostController.ReadUserFlaggedPosts);
// router.get('/Read-User-Followers/:userId', AuthMiddleware, PostController.ReadUserFollowers);
// router.get('/Read-User-Following/:userId', AuthMiddleware, PostController.ReadUserFollowing);
// router.post('/Follow-User', AuthMiddleware, PostController.FollowUser);
// router.post('/Unfollow-User', AuthMiddleware, PostController.UnfollowUser);
// router.get('/Read-User-Shared-Posts/:userId', AuthMiddleware, PostController.ReadUserSharedPosts);
// router.get('/Read-User-Shared-Comments/:userId', AuthMiddleware, PostController.ReadUserSharedComments);
// router.post('/Share-Post', AuthMiddleware, PostController.SharePost);



export default router;