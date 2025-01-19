import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit"
import helmet from "helmet";
import fileUpload from "express-fileupload";
// import fs from "fs";
// import path from "path";
import router from "./routes/api.js";
import 'dotenv/config'

const app = express();

// Ensure uploads directory exists
// const uploadsDir = path.resolve("uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// App Use Middlewares
app.use(express.json({limit: process.env.MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: process.env.URL_ENCODE || 'true' }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(fileUpload());


// Rate Limiting
const limiter = rateLimit({windowMs: process.env.REQUEST_TIME, max: process.env.REQUEST_NUMBER });
app.use(limiter);


// Web Cache
app.set('etag', process.env.WEB_CACHE === 'false');


// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {autoIndex: true}).then(() => {
    console.log('MongoDB Connected') 
}).catch(() => {
    console.log('Failed to connect to MongoDB...')
});


// Routes
app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})