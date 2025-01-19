import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import UserModel from '../model/UserModel.js';
// import multer from 'multer';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

// __dirname Define for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload Single File
// export const uploadSingleFileService = async (req, res) => {
//     try {
//         const uploadFile = req.files?.file;

//         if (!uploadFile) {
//             return { status: 'Fail', message: 'No file provided' };
//         }

//         const uploadPath = path.join(__dirname, '../../uploads', `${Date.now()}-${uploadFile.name}`);

//         // Move the file to a temporary location
//         await uploadFile.mv(uploadPath);

//         try {
//             // Upload to Cloudinary
//             const cloudinaryResult = await cloudinary.uploader.upload(uploadPath, {
//                 public_id: `${Date.now()}-${uploadFile.name}`
//             });

//             // Delete the local file
//             await fs.unlink(uploadPath);

//             // Send success response
//             return {
//                 status: 'success',
//                 message: 'File uploaded successfully to Cloudinary',
//                 data: {url: cloudinaryResult.secure_url}
//             };
//         } catch (uploadError) {
//             // Delete the local file in case of an error
//             await fs.unlink(uploadPath);
//             return {
//                 status: 'Fail',
//                 message: 'Error uploading file to Cloudinary',
//                 error: uploadError.toString()
//             };
//         }
//     } catch (error) {
//         return { status: 'Fail', message: error.toString() };
//     }
// };


export const uploadSingleFileService = async (req, res) => {
    try {
        const uploadFile = req.files?.file;

        if (!uploadFile) {
            return { status: 'Fail', message: 'No file provided' };
        }

        const uploadPath = path.join(__dirname, '../../uploads', `${Date.now()}-${uploadFile.name}`);

        // Move the file to a temporary location
        await uploadFile.mv(uploadPath);

        try {
            // Upload to Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(uploadPath, {
                public_id: `${Date.now()}-${uploadFile.name}`
            });

            // Delete the local file after uploading to Cloudinary
            await fs.unlink(uploadPath);

            
            let email = req.headers.email;  

            // Update the user's profile image URL in the database
            const updatedUser = await UserModel.updateOne(
                { email },
                { $set: { profileImg: cloudinaryResult.secure_url } }
            );

            // Send the updated user data with the new profile image URL
            return {
                status: 'success',
                message: 'File uploaded successfully to Cloudinary and updated in user profile',
                data: updatedUser
            };
        } catch (uploadError) {
            // Delete the local file in case of an error during upload
            await fs.unlink(uploadPath);
            return {
                status: 'Fail',
                message: 'Error uploading file to Cloudinary',
                error: uploadError.toString()
            };
        }
    } catch (error) {
        return { status: 'Fail', message: error.toString() };
    }
};




// // Configure Multer for file storage in temporary folder
// const upload = multer({ dest: path.join(__dirname, '../../uploads') });

// // Upload Single File
// export const uploadSingleFileService = async (req, res) => {
//     const uploadFile = req.file;

//     if (!uploadFile) {
//         return { status: 'Fail', message: 'No file provided' };
//     }

//     const uploadPath = path.join(__dirname, '../../uploads', uploadFile.filename);

//     try {
//         // Upload to Cloudinary
//         const cloudinaryResult = await cloudinary.uploader.upload(uploadPath, {
//             public_id: `${Date.now()}-${uploadFile.originalname}`
//         });

//         // Delete the local file
//         await fs.unlink(uploadPath);

//         // Send success response
//         return {
//             status: 'success',
//             message: 'File uploaded successfully to Cloudinary',
//             data: { url: cloudinaryResult.secure_url }
//         };
//     } catch (uploadError) {
//         // Delete the local file in case of an error
//         await fs.unlink(uploadPath);
//         return {
//             status: 'Fail',
//             message: 'Error uploading file to Cloudinary',
//             error: uploadError.toString()
//         };
//     }
// };

// // Middleware to handle single file uploads
// export const multerMiddleware = upload.single('file');



// Upload Multiple File
export const uploadMultipleFilesService = async (req, res) => {
    try { 
        let uploadFiles = req.files.file;
        for (let i = 0; i < uploadFiles.length; i++) {
            const uploadPath = path.join(__dirname, '../../uploads', Date.now() + '-' + uploadFiles[i].name);
            await uploadFiles[i].mv(uploadPath, (err) => {
                if (err) {
                    return { status: 'Fail', message: 'Error uploading file' };
                }
            });
        };
        return { status: 'Success', message: 'Files uploaded successfully'};
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};



// Read File
export const readFileService = async (req, res) => {
    try {   
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, '../../uploads', fileName);
        return filePath;
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};


// Delete Single File
export const deleteSingleFileService = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, '../../uploads', fileName);
        fs.unlink(filePath, (err) => {
            if (err) {
                return { status: 'Fail', message: 'Error deleting file' };
            }
        });
        return { status: 'Success', message: 'File deleted successfully'};
    } catch (error) {
        return { status: 'Fail', message: error.toString()};
    }
};






