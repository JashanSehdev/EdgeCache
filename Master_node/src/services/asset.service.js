import ErrorHandler from '../middleware/errorMiddleware.js'
import logger from './logger.js'
import { add_asset_entry } from '../utils/database.utils.js'
import { asset_dir } from '../utils/asset_directory.js'

import file_validation from './asset.validation.js'
import { delete_asset_entry } from '../utils/database.utils.js'


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
    const { isFileValid, filePath } = await file_validation(filename);
    try {
        if (!isFileValid) {
            throw new ErrorHandler(404, 'File not found or metadata unavailable')
        }
        return filePath;
    } catch (err) {
        throw err;
    }



}