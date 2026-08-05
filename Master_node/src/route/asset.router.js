import { uploadfile, downloadfile, pushAssets } from "../controller/asset.controller.js";
import { get_asset_metadata } from "../controller/asset.metadata.controller.js";  
import express from 'express'
import { upload } from "../utils/multer.js";

const route = express.Router();

route.post('/upload', upload.any(), uploadfile);
route.get('/download/:filename', downloadfile);
route.get('/pull/:filename', pushAssets);
route.get('/metadata', get_asset_metadata);

export default route