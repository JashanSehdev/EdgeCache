// This Service is used to handle file uploads using Multer middleware in an Express.js application.
import multer from "multer";
import { asset_dir } from '../utlils/assetPath.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, asset_dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

export const upload = multer({ storage });