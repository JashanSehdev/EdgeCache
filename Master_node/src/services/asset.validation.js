import { asset_dir } from "../utils/asset_directory.js";
import path from 'path'
import ErrorHandler from "../middleware/errorMiddleware.js";
import fs from 'fs'
import logger from './logger.js'
import { get_entry_by_filename } from "../database/db.js";

export default async function file_validation(filename) {
    try {
        if (!filename) {
            throw new ErrorHandler(500, 'filename is undefined');
        }

        const filePath = path.join(asset_dir, filename);
        const metadata = await get_entry_by_filename(filename);

        if (!fs.existsSync(filePath)) {
            logger.error('File missing on disk during validation', { filename, filePath });
            return { isFileValid: false, filePath: filePath };
        }

        const isFileValid = metadata ? true : false;

        if (!isFileValid) {
            logger.error('Metadata not found for file during validation', { filename, filePath });
        }

        return { isFileValid, filePath };
    } catch (err) {
        throw err;
    }
}