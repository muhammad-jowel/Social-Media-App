import { CreateCommentService, DeleteCommentService, ReadAllCommentsByPostIDService } from "../service/CommentService.js";

// Comment Post
export const CreateComment = async (req, res) => {
    let result = await CreateCommentService(req, res);
    return res.json(result);
};


// Delete Comment
export const DeleteComment = async (req, res) => {
    let result = await DeleteCommentService(req, res);
    return res.json(result);
};


// Read All Comments by Post id
export const ReadAllCommentsByPostId = async (req, res) => {
    let result = await ReadAllCommentsByPostIDService(req, res);
    return res.json(result);
};