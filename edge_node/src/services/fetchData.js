// This code will help edge node to fetch data from master server

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { asset_dir } from '../controller/asset.controller.js'
import { addAsset,getAssetByfileName, deleteAssetByfileName } from '../database/db.js'


// it fetches data from master server.
export async function pullFromMaster(filename) {
    const masterURL = `http://localhost:3001/api/assets/pull/${filename}`
    const localSavePath = path.join(asset_dir, filename);
    let mimeType = 'application/octet-stream';

    try {
        const response = await fetch(masterURL);

        if (!response.ok) {
            throw new Error(`Master node error: ${await response.statusText}`);
        }

        const contentTypeHeader = response.headers.get('content-type');
        if (contentTypeHeader) {
            mimeType = contentTypeHeader.split(';')[0].trim();
        }

        const writeStream = fs.createWriteStream(localSavePath);
        await finished(Readable.fromWeb(response.body).pipe(writeStream));

        console.log(`Successfully cached ${filename} into src/assets`);

        return { localSavePath, mimeType };
    } catch (error) {
        console.error(`Failed to fetch ${filename} from master node:`, error);
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
        console.log('File has been fetched from Master');
        
        return localSavePath;
    } catch (err) {
        console.log(err);
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
    console.log(process.env.TTL);
    console.log(`current_time: ${current_time}, file.created_at: ${file.created_at}, ttlInMs: ${ttlInMs}, isExisit: ${isExisit}`);

    return isExisit;

}


export async function ifMiss(filename) {
    const localSavePath = path.join(asset_dir, filename);

    try {


        if (fs.existsSync(localSavePath)) {
            if (await isFileValid(filename)) {
                console.log('File is valid. ready to be download');
                return localSavePath;
            } else {
                console.log(`File is been expired, deleting metadata. fetching new file from MasterNode.....`)
                await deleteAssetByfileName(filename);
            }
        }
        
        await fetchDataFromMaster(filename);

        return localSavePath;

    } catch (err) {
        console.error(err);
        throw err;

    }




}
