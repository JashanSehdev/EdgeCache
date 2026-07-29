import { uploadfile, upload, downloadfile, } from "../controller/asset.controller.js";
import { pullMetadata } from "../controller/asset.metadata.controller.js";
import express from 'express'

const router = express.Router();

router.post('/upload', upload.any(), uploadfile);
router.get('/download/:filename', downloadfile);
// router.get('/fetch/:filename', getDataFromMasterNode) 
router.get('/metadata', pullMetadata);

export default router