import {
    getAllAssets,
    getAssetByfileName
} from '../database/db.js'

export default async function isFileExist (filename) {
    const file = await getAssetByfileName(filename);
    
    if (!file) return false;
    const ttlInMs = process.env.TTL * 1000;    
    const current_time = Date.now();
    
    const isExisit = (current_time - file.created_at) < ttlInMs;
    console.log(file);
    console.log(`current_time: ${current_time}, file.created_at: ${file.created_at}, ttlInMs: ${ttlInMs}, isExisit: ${isExisit}`);

    return isExisit;
    
}