import {
    getAllAssets,
    getAssetByfileName,
    addAsset,
    deleteAssetByfileName
} from '../database/db.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import isFileExist from '../services/isFileExisit.js'
import { ifMiss, pullFromMaster } from '../services/fetchData.js'
import { error } from 'console'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const asset_dir = path.resolve(__dirname, '../assets');

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

export const upload = multer({ storage });



export async function uploadfile(req, res) {
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

// this function has to be modular as well 
export async  function downloadfile(req, res) {
    const filename = req.params.filename; 
    const filePath = path.join(asset_dir, filename);

    const savedFilePath = await ifMiss(filename);
    
    return res.download(savedFilePath);

}


// Create a function to delete particular file from local cache and also delete the metadata from database

export async function getDataFromMasterNode(req, res) {
    const filename = req.params.filename;
    try {
        pullFromMaster(filename);
        res.status(200).json({ message: 'File has been received' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

