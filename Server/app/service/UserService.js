import mongoose from "mongoose";
import md5 from "md5";
import UserModel from "../model/UserModel.js";
import { EncodeToken } from "../utility/TokenUtility.js";
import SendEmail from "../utility/emailUtility.js";
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


const ObjectID = mongoose.Types.ObjectId;


// User Registration
export const registerService = async (req, res) => {
    try {
        let reqBody = req.body;
        let password = md5(reqBody.password);
        reqBody.password = password;
        let data = await UserModel.create(reqBody);
        return { status: 'success', message: "User registered successfully", data: data };
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};


// User Login
export const loginService = async (req, res) => {
    try {
        let email = req.body.email;
        let password = md5(req.body.password);
        let data = await UserModel.aggregate([
            {$match : { email: email, password: password }},
            {$project : {_id: 1, email: 1}}
        ]);


        if (data.length > 0) {
            let token = EncodeToken(data[0].email, data[0]._id.toString());

            let options = {
                maxAge : 30 * 24 * 60 * 60 * 1000,
                httpOnly : true,
                sameSite : 'none',
                secure : true,
            };

            res.cookie('token', token, options);
            return { status: 'success', message: "User logged in successfully", token : token};
        } else {
            return { status: 'Fail', message: "Invalid email or password"};
        }
        
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};


// User profile Read
export const readProfileService = async (req, res) => {
    try {
        let email = req.headers.email;
        let MatchStage = {
            $match: {
                email,
            }
        };

        let project = {
            $project: {
                email: 1,
                userName: 1,
                coverImg: 1,
                profileImg: 1,
                fullName: 1,
                bio: 1,
                location: 1,
                phone: 1,
                website: 1,
                updatedAt: 1,
            }
        }

        let data = await UserModel.aggregate([MatchStage, project]);
        return {status: 'success', data: data[0]}
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};



export const updateProfileService = async (req, res) => {
    try {
        const email = req.headers.email;

        if (!email) {
            return { status: 'Fail', message: 'Email is required in headers' };
        }

        const uploadedFiles = req.files || {};
        const updateData = { ...req.body };

        // Handle profileImg upload
        if (uploadedFiles.profileImg) {
            const profileImgPath = path.join(__dirname, '../../uploads', `${Date.now()}-${uploadedFiles.profileImg.name}`);

            // Save the file temporarily
            await uploadedFiles.profileImg.mv(profileImgPath);

            try {
                const cloudinaryResult = await cloudinary.uploader.upload(profileImgPath, {
                    public_id: `profile_${Date.now()}_${uploadedFiles.profileImg.name}`,
                });

                updateData.profileImg = cloudinaryResult.secure_url;

                // Delete the temporary local file
                await fs.unlink(profileImgPath);
            } catch (error) {
                await fs.unlink(profileImgPath);
                return {
                    status: 'Fail',
                    message: 'Error uploading profile image to Cloudinary',
                    error: error.toString(),
                };
            }
        }

        // Handle coverImg upload
        if (uploadedFiles.coverImg) {
            const coverImgPath = path.join(__dirname, '../../uploads', `${Date.now()}-${uploadedFiles.coverImg.name}`);

            // Save the file temporarily
            await uploadedFiles.coverImg.mv(coverImgPath);

            try {
                const cloudinaryResult = await cloudinary.uploader.upload(coverImgPath, {
                    public_id: `cover_${Date.now()}_${uploadedFiles.coverImg.name}`,
                });

                updateData.coverImg = cloudinaryResult.secure_url;

                // Delete the temporary local file
                await fs.unlink(coverImgPath);
            } catch (error) {
                await fs.unlink(coverImgPath);
                return {
                    status: 'Fail',
                    message: 'Error uploading cover image to Cloudinary',
                    error: error.toString(),
                };
            }
        }

        // Update the user's profile in the database
        const updatedUser = await UserModel.updateOne({ email }, { $set: updateData });

        return {
            status: 'success',
            message: 'User profile updated successfully',
            data: updatedUser,
        };
    } catch (error) {
        return { status: 'Fail', message: error.toString() };
    }
};


// User Profile Update
// export const updateProfileService = async (req, res) => {
//     try {
//         let email = req.headers.email;
//         let reqBody = req.body;
//         let data = await UserModel.updateOne({ email }, reqBody);
//         return { status: 'success', message: "User profile updated successfully", data : data};
//     } catch (error) {
//         return { status: 'Fail', message: error.toString()};
//     }
// };



// User Password Reset
export const forgetPasswordService = async (req, res) => {
    try {
        let email = req.body.email;
        let data = await UserModel.findOne({ email });

        if (!data) {
            return { status: 'Fail', message: "Email not found"};
        }

        let code = Math.floor(100000 + Math.random()*900000);
        let EmailText = `Your Verification Code is ${code}`;
        let EmailSubject = 'Email Verification';

        // await SendEmail(email, EmailText, EmailSubject)
        await UserModel.updateOne(
            {email:email},
            {$set:{otp:code}},
            {upsert:true}
        );
        return {status : 'success', message : 'Your 6 Digit Code Has Been Send Successfully'};
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};


// Otp Verification
export const verifyOtpService = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const data = await UserModel.findOne({ email });

        if (!data) {
            return { status: "fail", message: "Email not found" };
        }


        if (data.otp !== otp) {
            return { status: "fail", message: "Invalid OTP" };
        }

        await UserModel.updateOne({ email }, { $set: { otp: null } });

        return { status: "success", message: "OTP verified successfully" };
    } catch (error) {
        return { status: "fail", data: error.toString()};
    }
};





// Password Update

export const updatePasswordService = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = md5(password);
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { status: "fail", message: "Email not found" };
        }

        await UserModel.updateOne({ email }, { $set: { password: hashedPassword } });

        return { status: "success", message: "Password changed successfully" };
    } catch (error) {
        return { status: "fail", message: error.toString() };
    }
};



// User Delete
export const deleteAccountService = async (req, res) => {
    try {
        let email = req.headers.email;
        if (!email) {
            return { status: "fail", message: "Email is required in the headers" };
        }
        const result = await UserModel.deleteOne({ email });
        if (result.deletedCount > 0) {
            return { status: "success", message: "Account deleted successfully",
        };
        } else {
            return { status: "fail", message: "Account not found",
        };
        }
    } catch (error) {
        return { status: "fail", message: error.toString() };
    }
};



// User Profile Read
export const getUserProfileService = async (req, res) => {
    try {
        let user_id = new ObjectID(req.body.id);
        let MatchStage = {
            $match: {
                _id : user_id,
            }
        };

        let project = {
            $project: {
                email: 1,
                userName: 1,
                coverImg: 1,
                profileImg: 1,
                fullName: 1,
                bio: 1,
                location: 1,
                phone: 1,
                website: 1,
                updatedAt: 1,
            }
        }

        let data = await UserModel.aggregate([MatchStage, project]);
        return { status: 'success', data: data[0]};
    } catch (error) {
        return { status: 'fail', message: error.toString()};
    }
};