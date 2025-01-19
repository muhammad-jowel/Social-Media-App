import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
    {
        email : { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        fullName : { type: String, required: true},
        phone : { type: String},
        profileImg : { type: String},
        coverImg : { type: String},
        otp : { type: String},
        userName: { type: String, unique: true },
        bio: { type: String },
        website: { type: String },
        location: { type: String },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }]
    },
    {
        timestamps : true,
        versionKey : false,
    }
);


const UserModel = mongoose.model("users", DataSchema);

export default UserModel;