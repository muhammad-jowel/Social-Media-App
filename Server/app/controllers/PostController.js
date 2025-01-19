import { 
    CreatePostService, 
    DeletePostService, 
    DisLikePostService, 
    LikePostService, 
    ReadAllPostService, 
    ReadPostByIDService, 
    ReadPostService, 
    UpdatePostService 
} from "../service/PostService.js";

// Create a post 
export const CreatePost = async (req, res) => {
    let result = await CreatePostService(req, res);
    return res.json(result);
};



// Read My post
export const ReadPost = async (req, res) => {
    let result = await ReadPostService(req, res);
    return res.json(result);
};



// Update Post
export const UpdatePost = async (req, res) => {
    let result = await UpdatePostService(req, res);
    return res.json(result);
};



// Delete Post
export const DeletePost = async (req, res) => {
    let result = await DeletePostService(req, res);
    return res.json(result);
};



// Read All Post
export const ReadAllPost = async (req, res) => {
    let result = await ReadAllPostService(req, res);
    return res.json(result);
};



// Read Post By Id
export const ReadPostById = async (req, res) => {
    let result = await ReadPostByIDService(req, res);
    return res.json(result);
};



// Like Post
export const LikePost = async (req, res) => {
    let result = await LikePostService(req, res);
    return res.json(result);
};



// Dislike Post
export const DislikePost = async (req, res) => {
    let result = await DisLikePostService(req, res);
    return res.json(result);
};



// Comment Post
// export const CommentPost = async (req, res) => {
//     let result = await CommentPostService(req, res);
//     return res.json(result);
// };


// Delete Comment
// export const DeleteComment = async (req, res) => {
//     let result = await DeleteCommentService(req, res);
//     return res.json(result);
// };


// Read All Comments by Post id
// export const ReadAllCommentsByPostId = async (req, res) => {
//     let result = await ReadAllCommentsByPostIDService(req, res);
//     return res.json(result);
// };



// Share Post
// export const SharePost = async (req, res) => {
//     let result = await SharePostService(req, res);
//     return res.json(result);
// };