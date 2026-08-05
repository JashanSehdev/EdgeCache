import { addFile, getFile } from '../services/asset.service.js'
import asyncHandler from '../middleware/asyncHandler.js'
import logger from '../services/logger.js'
import { asset_dir } from '../utils/asset_directory.js'
import path from 'path'
import fs from 'fs'

// Control the uploading for files
export const uploadfile = asyncHandler( async (req, res, next) => {
    const uploadedFile = req.file || req.files?.[0];

    if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    await addFile(uploadedFile)

    res.status(200).json({
        status: 'File Uploaded Successfully',
        filename: uploadedFile.filename,
        path: `/api/${uploadedFile.filename}`
    });

})

// control the downloading of files for clients
export const downloadfile = asyncHandler(async (req, res, next) => {
    const filename = req.params.filename;
    const savedFilePath = await getFile(filename);
    return res.download(savedFilePath);
})


// control the pulling request from edge servers
export const pushAssets = asyncHandler(async (req, res, next) => {
    const filename = req.params.filename;
    const savedFilePath = await getFile(filename);
    res.sendFile(savedFilePath);
    logger.info('file has been sent to server', {
        action: 'file has been sent',
        ip: req.ip,
        filename: filename
    })
});


