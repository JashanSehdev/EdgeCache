import {
    getAllAssets,
    getAssetByfileName,
    addAsset
} from '../meta_database/db.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from '../services/logger.js'

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

export const upload = multer({ storage });



export async function uploadfile(req, res) {
    const uploadedFile = req.file || req.files?.[0];

    try {
        if (!uploadedFile) {

            logger.error('No File uploaded', {
                error: {
                    message: "File is not uploaded"
                },
                function: 'uploadfile',
                action: "Check for incoming stream"
            })

            return res.status(400).json({ error: 'No file uploaded' });
        }

        const resource_name = uploadedFile.originalname

        await addAsset(resource_name, uploadedFile.size, uploadedFile.mimetype);

        logger.info(`File ${uploadedFile.resource_name} has been uploaded and metadata has been added`, {
            function: 'uploadfile',
            action: 'File uploaded',
        })

        res.status(200).json({
            status: 'File Uploaded Successfully',
            resource_name: resource_name,
            path: `/api/${resource_name}`
        });

    } catch (err) {

        logger.error(`Error Has been occured during file upload`, {
            error: err?.message || String(err),
            function: 'uploadfile'
        })

        res.status(500).json({ error: err?.message || 'Internal server error' });
    }
}

export function downloadfile(req, res) {
    const resource_name = req.params.resource_name;
    const resource_path = path.join(asset_dir, resource_name);

    try {
        if (!fs.existsSync(resource_path)) {

            logger.error(`File: ${resource_name} has not found in ${resource_path}`, {
                function: 'downloadfile',
                error: {
                    message: "File not found"
                }
            })

            return res.status(404).json({success: false,  message: `file not found` });
        }

        logger.info(`File: ${resource_name} is ready to download`, {
            function: 'downloadfile',
            action: `File: ${resource_name} Downloaded`
        })

        res.download(resource_path, resource_name);
    } catch (error) {
        logger.error(`Error has been occur while download file`, {
            function: 'downloadfile',
            error: error,
        })
        res.status(500).json({ success: false, message: 'Internal Server Error' });

    }

}


//this will send data to server

export function pushAssets(req, res) {
    const resource_name = req.params.resource_name;
    const resource_path = path.join(asset_dir, resource_name);

    try {
        if (!fs.existsSync(resource_path)) {

            logger.error(`${resource_name} Resource not found in path ${resource_path}`, {
                function: 'pushAssets',
                error: {
                    message: 'Resource not found'
                }
            })

            return res.status(404).json({ message: "Resource not found" });
        }

        logger.info(`File: ${resource_name} has been sent`, {
            function: 'pushAssets',
            action: 'File has been sent'
        })

        res.sendFile(resource_path);

    } catch (error) {
        logger.error(`Error has been occur while dispatching file`, {
            function: 'pushAssets',
            error: error,
        })

        res.status(500).json({success: false, message: 'Internal Server Error' });
    }


}

