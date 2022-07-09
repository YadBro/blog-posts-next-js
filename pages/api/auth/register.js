import db from "../../../libs/db";
import Joi from "joi";
import bcrypt from "bcrypt";

export default async function handler(req, res) {

    const tableName = "users";

    try {

        if (req.method !== "POST") return res.status(405).json({
            status  : 'failed',
            message : 'Method not allowed!'
        });

        const data      = req.body;
        
        const schema    = Joi.object({
            email       : Joi.string().email().required(),
            password    : Joi.string().min(6).required()
        });

        const validate  = schema.validate(data);
        if (validate.error) {
            return res.status(400).json({
                status  : validate.error.name,
                message : validate.error.message,
                data    : {}
            });
        }

        const isRegistered  = await db(tableName).where("email", validate.value?.email).first();

        if (!isRegistered) {
            const salt              = bcrypt.genSaltSync(10);
            const hashedPassword    = bcrypt.hashSync(validate.value?.password, salt);
            validate.value  = {
                ...validate.value,
                password    : hashedPassword
            }

            await db(tableName).insert(validate.value);
            return res.status(200).json({
                status  : 'success',
                message : 'Success to register!',
                data    : validate.value
            });
        }


        res.status(404).json({
            status  : 'failed',
            message : 'The email is registered!',
            data    : {}
        });

    } catch (error) {

        res.status(500).json({
            status  : 'error',
            message : error?.message,
            data    : {}
        });

    }
}