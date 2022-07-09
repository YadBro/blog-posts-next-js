import db from "../../../libs/db";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

    const tableName = "users";

    try {

        if (req.method !== "POST") return res.status(405).json({
            status  : 'failed',
            message : 'Method not allowed!',
            data    : {}
        });

        const data  = req.body;
        const schema    = Joi.object({
            email       : Joi.string().email().required(),
            password    : Joi.string().min(6).required()
        });

        const validate  = schema.validate(data);
        if (validate.error) {
            return res.status(400).json({
                status  : validate.error.name,
                message : validate.error.message,
            });
        }

        const isRegistered  = await db(tableName).where("email", validate.value?.email).first();

        if (isRegistered) {

            const matchedPassword   = bcrypt.compareSync(validate.value?.password, isRegistered?.password);

            if (matchedPassword) {
                const token = jwt.sign({
                    id      : isRegistered?.id,
                    email   : isRegistered?.email
                }, process.env.JWT_SECRET, {
                    expiresIn   : '2d'
                });
                return res.status(200).json({
                    status  : 'success',
                    message : 'Login success!',
                    token
                });
            }else {
                return res.status(400).json({
                    status  : 'failed',
                    message : 'There was problem with your login!'
                });
            }

        }

        res.status(404).json({
            status  : 'failed',
            message : 'The email is not registered!'
        });


    } catch (error) {

        res.status(500).json({
            status  : 'error',
            message : error,
            data    : {}
        });

    }

}