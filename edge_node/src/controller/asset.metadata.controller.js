import {
    getAllAssets
} from "../database/db.js"

export async function pullMetadata(req, res) {
    try{
        const result = await getAllAssets();

        res.status(200).send(result);
        
    } catch (err){
        console.log(err);
    }
}