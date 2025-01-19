import { 
    uploadSingleFileService, 
    uploadMultipleFilesService, 
    readFileService,
    deleteSingleFileService
} from '../service/FileService.js';


// Single File Upload
export const uploadSingleFile = async (req, res) => {
    let result = await uploadSingleFileService(req);
    return res.json(result);
};


// Multiple File Upload
export const uploadMultipleFiles = async (req, res) => {
    let result = await uploadMultipleFilesService(req);
    return res.json(result);
};



// File Read
 export const readFile = async (req, res) => {
    let result = await readFileService(req, res);
    return res.sendFile(result);
};


 
// Delete Single File
export const deleteSingleFile = async (req, res) => {
    let result = await deleteSingleFileService(req, res);
    return res.json(result);
};






// export const uploadFile = (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     res.json({ message: "File uploaded successfully", file: req.file });
//   };
  