import {
    getAllAssets,
    getAssetByfileName,
    addAsset
} from '../database/db.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import isFileExist from '../services/isFileExisit.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const asset_dir = path.resolve(__dirname, '../assets');

if (!fs.existsSync(asset_dir)) fs.mkdirSync(asset_dir, {
    recursive: true
})
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, asset_dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

export const upload = multer({storage});



export async function uploadfile (req, res) {
    const uploadedFile = req.file || req.files?.[0];

    try {
        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        await addAsset(uploadedFile.filename, uploadedFile.size, uploadedFile.mimetype);
        console.log(`upload file via multer: ${uploadedFile.filename}`);

        res.status(200).json({
            status: 'File Uploaded Successfully',
            filename: uploadedFile.filename,
            path: `/api/${uploadedFile.filename}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}

export function downloadfile (req, res) {
    const filename = req.params.filename;
    const filePath = path.join(asset_dir, filename);

    if (!fs.existsSync(filePath)){
        return res.status(404).json({message: `file not found`});
    }

    res.download(filePath, filename);
}

//this will send data to server

export function pushAssets (req, res) {
    const filename = req.params.filename;
    const filePath = path.join(asset_dir,filename);
    

    if(!fs.existsSync(filePath)) {
        return res.status(404).json({message: "Resource not found"});
    }

    res.sendFile(filePath);
    console.log("file has been sent", filename);
    
}

