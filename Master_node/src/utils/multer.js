import multer from "multer";
import { asset_dir } from "./asset_directory.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, asset_dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

export const upload = multer({ storage });