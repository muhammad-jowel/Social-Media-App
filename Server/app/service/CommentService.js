import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;
import CommentModel from "../model/CommentModel.js";


// Comment Post service
export const CreateCommentService = async (req) => {
    try {
        const postID = new ObjectID(req.body.postID);
        const userID = new ObjectID(req.headers.user_id);

        const comment = new CommentModel({
            postID: postID,
            userID: userID,
            comment: req.body.comment,
            timestamp: new Date()
        });

        // Save the comment
        const data = await comment.save();

        return { status: 'success', message: 'Comment added successfully', data: data };
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};



// Read All Comments By Post ID service
export const ReadAllCommentsByPostIDService = async (req) => {
    try {
        const postID = new ObjectID(req.params.id);

        // Use aggregation to fetch comments for the specified post with user details
        const comments = await CommentModel.aggregate([
            { $match: { postID: postID } },
            {
                $lookup: {
                    from: "users", // The name of the user collection in the database
                    localField: "userID", // Field in the comments collection
                    foreignField: "_id", // Field in the user collection
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails" // Unwind to include user details as a flat object
            },
            {
                $project: {
                    comment: 1,
                    timestamp: 1,
                    "userDetails.fullName": 1,
                    "userDetails.img": 1
                }
            }
        ]);

        if (!comments.length) {
            return { status: 'Fail', message: 'No comments found for this post' };
        }

        return { status: 'success', data: comments };
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};



// Delete a comment service
export const DeleteCommentService = async (req) => {
    try {
        const commentID  = new ObjectID(req.body.id)
        const userID = req.headers.user_id;

        if (!commentID) {
            return { status: 'Fail', message: 'Comment ID is required' };
        }

        const comment = await CommentModel.findOne({ _id: commentID });

        if (!comment) {
            return { status: 'Fail', message: 'Comment not found' };
        }

        // Check if the logged-in user is the owner of the comment
        if (comment.userID.toString() !== userID) {
            return { status: 'Fail', message: 'You are not authorized to delete this comment' };
        }

        // Delete the comment
        const result = await CommentModel.deleteOne({ _id: commentID });

        if (result.deletedCount === 0) {
            return { status: 'Fail', message: 'Failed to delete the comment' };
        }

        return { status: 'success', message: 'Comment deleted successfully' };
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};

