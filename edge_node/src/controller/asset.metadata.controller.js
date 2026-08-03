import { get_all_entries, delete_asset_by_filename } from '../database/db.js';
import logger from '../services/logger.js'

export async function pullMetadata(req, res) {
    try{
        const result = await get_all_entries();

        logger.info(`Pulling request recieved`, {
            action: 'sending IP Address',
            filename: 'Metadata'
        })

        res.status(200).send(result);
        
    } catch (err){
        logger.error(`Error found while sending metadata`, {
            function: pullMetadata.name,
            error: err,
        })
        res.status(500).json({message: 'Internal Server Error'})
    }
}