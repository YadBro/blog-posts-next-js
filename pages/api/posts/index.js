import db from "../../../libs/db";
import Joi from "joi";
import authorization from "../../../middlewares/authorization";

export default async function handler(req, res) {

    
    const tableName = "posts";
    
    if (req.method === "GET") {
        
        try {

            const auth  = await authorization(req, res);

            const selectedData  = await db(tableName);

            res.status(200).json({
                status  : 'success',
                message : 'Selected all posts successfully',
                data    : selectedData
            });

        } catch (error) {

            res.status(500).json({
                status  : 'error',
                message : error?.message,
                data    : {}
            });

        }

    }else if (req.method === "POST") {

        try {
        
            const auth  = await authorization(req, res);

            const data      = req.body;

            const schema    = Joi.object({
                title   : Joi.string().required(),
                content : Joi.string().min(8).required()
            });

            const validate  = schema.validate(data);
            
            if (validate.error) {
                return res.status(400).json({
                    status  : 'failed',
                    message : validate.error.message,
                    data    : validate.value || {}
                });
            }

            const create    = await db(tableName).insert(validate.value);
            const createdData   = await db(tableName).where("id", create).first();

            if (create) {
                res.status(200).json({
                    status  : 'success',
                    message : 'Post created successfully',
                    data    : createdData
                });
            }

        } catch (error) {

            res.status(500).json({
                status  : 'error',
                message : error?.message,
                data    : {}
            });

        }

    }
    else {

        return res.status(405).json({
            status  : 'failed',
            message : 'Method not allowed!',
            data    : {}
        });

    }

}