import mongoose from "mongoose";
const ObjectID = mongoose.Types.ObjectId;
import CommentModel from "../model/CommentModel.js";
import PostModel from "../model/PostModel.js";


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

        await PostModel.updateOne(
            { _id: postID },              // Find the post by ID
            { $inc: { commentCount: 1 } } // Increment commentCount by 1
        );

        return { status: 'success', message: 'Comment added successfully', data: data };
    } catch (e) {
        return { status: 'fail', message: e.toString() };
    }
};



// Read All Comments By Post ID service
export const ReadAllCommentsByPostIDService = async (req) => {
    try {
        const postID = req.params.id;

        if (!ObjectID.isValid(postID)) {
            return { status: 'Fail', message: 'Invalid Post ID' };
        }

        const comments = await CommentModel.aggregate([
            { $match: { postID: new ObjectID(postID) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    comment: 1,
                    createdAt: 1,
                    "userDetails.fullName": 1,
                    "userDetails.profileImg": {
                        $ifNull: ["$userDetails.profileImg", "default-profile.jpg"]
                    }
                }
            }
        ]);

        if (!comments.length) {
            return { status: 'Fail', message: 'No comments found for this post', data: [] };
        }

        return { status: 'success', message: 'Comments fetched successfully', data: comments };
    } catch (e) {
        console.error("Error fetching comments:", e);
        return { status: 'Fail', message: 'Internal Server Error' };
    }
};



// Delete a comment service
export const DeleteCommentService = async (req) => {
    try {
        const commentID = new ObjectID(req.body.id);
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

        // Get the associated post ID
        const postID = comment.postID;

        // Delete the comment
        const result = await CommentModel.deleteOne({ _id: commentID });

        if (result.deletedCount === 0) {
            return { status: 'Fail', message: 'Failed to delete the comment' };
        }

        // Update the comment count on the associated post
        const postUpdate = await PostModel.updateOne(
            { _id: postID },
            { $inc: { commentCount: -1 } } // Decrease the comment count
        );

        if (postUpdate.modifiedCount === 0) {
            return { status: 'Fail', message: 'Failed to update comment count on the post' };
        }

        return { status: 'success', message: 'Comment deleted successfully, and comment count updated' };
    } catch (e) {
        return { status: 'Fail', message: e.toString() };
    }
};


