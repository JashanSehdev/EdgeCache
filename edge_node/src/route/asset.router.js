import { uploadfile, downloadfile, } from "../controller/asset.controller.js";
import { upload } from "../services/multer.js";
import { pullMetadata } from "../controller/asset.metadata.controller.js";
import express from 'express'

const router = express.Router();

router.post('/upload', upload.single("file"), uploadfile);
router.get('/download/:filename', downloadfile);
router.get('/metadata', pullMetadata);

export default router