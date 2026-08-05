import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const asset_dir = path.resolve(__dirname, '../assets');

if (!fs.existsSync(asset_dir)){
    fs.mkdirSync(asset_dir, { recursive: true });
}

export {asset_dir}