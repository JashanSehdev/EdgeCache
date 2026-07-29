// This code will help edge node to fetch data from master server

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { asset_dir } from '../controller/asset.controller.js'
import { addAsset,getAssetByfileName, deleteAssetByfileName } from '../meta_database/db.js'
import logger from './logger.js'


// it fetches data from master server.
export async function pullFromMaster(filename) {
    const masterURL = `http://localhost:3001/api/assets/pull/${filename}`
    const localSavePath = path.join(asset_dir, filename);
    let mimeType = 'application/octet-stream';

    try {
        const response = await fetch(masterURL);

        if (!response.ok) {

            logger.error('Master Node error', {
                error : {
                    message: 'Master is not responding'
                },
                function: pullFromMaster.name,
                filename: filename
            })

            throw new Error(`Master node error: ${await response.statusText}`);
        }

        const contentTypeHeader = response.headers.get('content-type');

        if (contentTypeHeader) {
            mimeType = contentTypeHeader.split(';')[0].trim();
        }

        const writeStream = fs.createWriteStream(localSavePath);

        await finished(Readable.fromWeb(response.body).pipe(writeStream));

        logger.cache(`${filename} saved to local asset cache`, {
            function: pullFromMaster.name,
            asset_location: localSavePath,
            filename: filename
        });

        return { localSavePath, mimeType };

    } catch (error) {

        logger.error(`Error Found while pulling ${filename}`, {
            error: error,
            filename: filename,
            function: pullFromMaster.name,
        });

        throw error;
    }
}

// it additionally saves metadata in db.

export async function fetchDataFromMaster(filename) {

    try {

        const { localSavePath, mimeType } = await pullFromMaster(filename);

        if (!fs.existsSync(localSavePath)) {
            throw new Error("File not fetched")
        }

        const fileStats = fs.statSync(localSavePath);

        await addAsset(filename, fileStats.size, mimeType);

        logger.cache(`Fresh metadata has been saved ${filename}`, {
            filename: filename,
            function: fetchDataFromMaster.name,
            action: 'saving metadata'
        })
        
        return localSavePath;

    } catch (err) {
        logger.error(`Error found while fetching data`, {
            function: fetchDataFromMaster.name,
            filename: filename,
            error: err,
        })

        throw err;
    }
}


// create a function to check if the file exists in the local cache if not exist then fetch from master node and cache it in local assets folder

export default async function isFileValid(filename) {

    const file = await getAssetByfileName(filename);

    if (!file) return false;

    const ttlInMs = process.env.TTL * 1000;
    const current_time = Date.now();
    const isExisit = (current_time - file.created_at) <= ttlInMs;

    return isExisit;

}


export async function ifMiss(filename) {

    const localSavePath = path.join(asset_dir, filename);

    try {

        if (fs.existsSync(localSavePath)) {

            if (await isFileValid(filename)) {
                logger.info(`File is Fresh and ready to dispatch`, {
                    function: ifMiss.name,
                    action: 'ready to dispatch',
                    filename: filename
                })

                return localSavePath;

            } else {

                logger.cache('File is stale, Deleting metadata of the stale file', {
                    function: ifMiss.name,
                    action: 'deleting metadata and fetching fresh File',
                    filename: filename
                })
                
                await deleteAssetByfileName(filename);
            }
        }
        
        await fetchDataFromMaster(filename);

        logger.cache(`${filename} has been Cached at ${localSavePath}`,{
            function: ifMiss.name,
            action:'file had been fetched with new metadata',
            filename: filename
        })

        return localSavePath;

    } catch (err) {
        
        logger.error(`Error found`, {
            function: ifMiss.name,
            error: err,
            filename: filename
        })

        throw err;

    }




}
