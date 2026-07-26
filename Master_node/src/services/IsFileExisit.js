import {
    getAllAssets,
    getAssetByfileName
} from '../database/db.js'

export default function isFileExist (filename) {
    const file = getAssetByfileName(filename);
    
    if (!file) return false;

    const ttlInMs = process.env.TTL * 1000;
    const current_time = Date.now();

    return (current_time - file.created_at) < ttlInMs;
    
}