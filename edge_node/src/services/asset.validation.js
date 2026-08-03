import { assetDir } from "../utlils/assetPath.js";
import path from 'path'
import ErrorHandler from "../middleware/errorMiddleware.js";
import fs from 'fs'
import { get_entry_by_filename } from "../database/db.js";

export default async function file_validation(filename) {
    try {
        if (!filename) {
            throw new ErrorHandler(500, 'filename is undefined');
        }

        const filePath = path.join(assetDir, filename);
        const metadata = await get_entry_by_filename(filename);

        if (!fs.existsSync(filePath)) {
            return { isFileValid: false, filepath: filePath };
        }

        const ttlInMs = Number(process.env.TTL || 60) * 1000;
        const currentTime = Date.now();
        const fileStats = fs.statSync(filePath);
        const isFileValid = metadata ? (currentTime - fileStats.mtimeMs) <= ttlInMs : false;

        return { isFileValid, filePath };
    } catch (err) {
        throw err;
    }
}