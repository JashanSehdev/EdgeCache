import {
    getAllAssets
} from "../database/db.js"

export async function get_asset_metadata(req, res) {
    try{
        const result = await getAllAssets();

        res.status(200).send(result);
        
    } catch (err){
        console.error(err);
    }
}