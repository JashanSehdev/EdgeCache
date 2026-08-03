import {
    add_entry,
    get_entry_by_filename,
    get_all_entries,
    delete_asset_by_filename
} from '../database/db.js'
import path from 'path'
import { asset_dir } from './assetPath.js'
import fs from 'fs'
import ErrorHandler from '../middleware/errorMiddleware.js';
import logger from '../services/logger.js';

export async function add_asset_entry(filename) {
    try {
        const filePath = path.join(asset_dir, filename);

        if (!fs.existsSync(filePath)) {
            throw new ErrorHandler(500, 'File not exit in the asset directory');
        }

        const file_metadata = fs.statSync(filePath);
        const size = file_metadata.size;
        const mimeType = file_metadata.mimetype || 'application/octet-stream';

        await add_entry(filename, size, mimeType);
    } catch (err) {
        if (err instanceof ErrorHandler) {
            throw err;
        }
        throw new ErrorHandler(500, err.message || 'Internal Server Error');
    }
}

export async function delete_asset_entry(filename) {
    try {
        await  delete_asset_by_filename(filename);
        logger.info('asset_metadata has been removed', {
            filename: filename,
            action: "delete entry",
            function: delete_asset_entry.name
        })
    } catch (error) {
        if (error instanceof ErrorHandler) throw error;
        throw new ErrorHandler(500, error.message || 'Internal Server Error')
    }
}