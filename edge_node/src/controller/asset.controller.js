
import {
    addFile,
    getFile
} from "../services/asset.service.js"
import path from 'path'
//import { ifMiss, pullFromMaster } from '../services/fetchData.js'
import logger from '../services/logger.js'
import { asyncHandler } from '../middleware/AsyncHandler.js'
import { asset_dir } from '../utlils/assetPath.js'


// Function will upload file

export const uploadfile = asyncHandler( async (req, res, next) => {
    const uploadedFile = req.file;

    await addFile(uploadedFile)

    res.status(200).json({
        status: 'File Uploaded Successfully',
        filename: uploadedFile.filename,
        path: `/api/${uploadedFile.filename}`
    });

})

// this function has to be modular as well 

export const downloadfile = asyncHandler(async (req, res, next) => {
    const filename = req.params.filename;
    await getFile(filename);
    const savedFilePath = path.join(asset_dir, filename);
    return res.download(savedFilePath);
})

// export async  function downloadfile(req, res) {

//     const filename = req.params.filename; 
    
//     try {
//         const savedFilePath = await ifMiss(filename);
    
//     logger.info(`${filename} has been download by user ${ip}`, 
//         {IP : ip,
//         action: 'file downloaded',
//         function: downloadfile.name
//         })

//     return res.download(savedFilePath)  

//     } catch(err) {

//         logger.error(`Found an error`, { 
//             function : downloadfile.name, 
//             error: err, ip:ip, 
//             filename: filename
//         });

//         res.status(500).json({message: `Internal Server Error`});
//     }
    

// }


// Create a function to delete particular file from local cache and also delete the metadata from database

// export async function getDataFromMasterNode(req, res) {
//     const filename = req.params.filename;
//     try {
//         pullFromMaster(filename);
//         res.status(200).json({ message: 'File has been received' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

