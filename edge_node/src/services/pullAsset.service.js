import { assetDir } from "../utlils/assetPath.js";
import path from 'path'
import ErrorHandler from "../middleware/errorMiddleware.js";
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import fs from 'fs'
import logger from "./logger.js";
import { add_asset_entry } from "../utlils/database.utils.js";

export async function downstream (filename) {
    const masterURL = `${process.env.MasterUrl || "http://localhost:3001/api/assets/pull/"}${filename}`
    const localSavePath = path.join(assetDir, filename);
    let mime_type = 'application/octet-stream';

    const response = await fetch(masterURL);

    if (!response.ok){

        throw new ErrorHandler(500, 'No response from Master server');

    }

    const contentTypeHeader = response.headers.get('content-type');

    if (contentTypeHeader) {
        mime_type = contentTypeHeader.split(';')[0].trim();
    }

    const writeStream = fs.createWriteStream(localSavePath);
    await finished(Readable.fromWeb(response.body).pipe(writeStream));

    add_asset_entry(filename)
    logger.info('File has been fetched', {
        action: 'file has been fetched',
        filename: filename,
        location: localSavePath
    })

    


}