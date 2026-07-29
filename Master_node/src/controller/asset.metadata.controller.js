import {
    getAllAssets
} from "../meta_database/db.js"
import logger from "../services/logger.js"

export async function get_asset_metadata(req, res) {
    try {
        const result = await getAllAssets();

        logger.info('Pulling request received', {
            function: 'get_asset_metadata',
            action: 'sending metadata',
            ipAddress: req.ip,
            filename: 'Metadata'
        })

        res.status(200).send(result);

    } catch (error) {
        logger.error('Error found while sending metadata', {
            function: 'get_asset_metadata',
            error: error,
        })

        res.status(500).json({ message: 'Internal Server Error' });
    }
}