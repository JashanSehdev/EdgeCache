import ErrorHandler from '../middleware/errorMiddleware.js'
import logger from './logger.js'
import { add_asset_entry } from '../utlils/database.utils.js'
import { asset_dir } from '../utlils/assetPath.js'

import { downstream } from './pullAsset.service.js'
import file_validation from './asset.validation.js'
import { delete_asset_by_filename } from '../database/db.js'
import { delete_asset_entry } from '../utlils/database.utils.js'


export async function addFile(uploadfile) {

    if (!uploadfile) {
        throw new ErrorHandler(400, 'File not uploaded');
    }

    const mimeType = uploadfile.mimetype || uploadfile.mimeType || 'application/octet-stream';

    await add_asset_entry(uploadfile.filename)

    logger.info('File has been saved', {
        filename: uploadfile?.filename,
        function: addFile.name,
        location: `${asset_dir}\\${uploadfile?.filename}`
    })

}

export async function getFile(filename) {
    const { isFileValid, filePath } = file_validation(filename);
    try {
        if (!isFileValid) {
            // pull data from masternode
            try {
                await delete_asset_entry(filename);
                await downstream(filename);
            } catch (err) {
                throw err;
            }
        }
        return filePath;
    } catch (err) {
        throw err;
    }



}