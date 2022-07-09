import db from "../../../libs/db";
import Joi from "joi";
import authorization from "../../../middlewares/authorization";

export default async function handler(req, res) {

    const tableName = "posts";

  if (req.method === 'GET') {
    try {
      const auth = await authorization(req, res);
      const {id} = req.query;
      const postData = await db(tableName).where({id}).first();
      if (postData === undefined) return res.status(404).send({message: 'tidak ada datanya'});
      res.status(200).json({
        status  : 'success',
        message : 'Get post success!',
        data    : postData
      });
    } catch (error) {
      res.status(500).json({
        status  : 'error',
        message : error?.message,
        data    : {}
      });
    }
  }


    else if (req.method === "PUT"){
        
        try {

            const auth  = await authorization(req, res);

            const { id } = req.query;
            let data = req.body;

            data = {
              title: data.title,
              content: data.content
            }

            const checkId = await db(tableName).where({id}).first();
            if (!checkId) return res.status(404).json({
                status  : 'failed',
                message : 'Data not Found!',
                data    : {}
            });

            const schema = Joi.object({
                title   : Joi.string(),
                content : Joi.string().min(8)
            });

            const validate = schema.validate(data);
            if (validate.error) {
                return res.status(400).json({
                    status  : 'failed',
                    message : validate.error.message,
                    data    : {}
                });
            }

            await db(tableName).where({id}).update(data);
            const updatedValue  = await db(tableName).where({id}).first();


            res.status(200).json({
                status  : 'success',
                message : 'Updated post success!',
                data    : updatedValue
            });

        } catch (error) {

            res.status(500).json({
                status  : 'error',
                message : error?.message,
                data    : {}
            });

        }
    }
    else if (req.method === "DELETE") {

        try {
        
            const auth  = await authorization(req, res);

            const { id }        = req.query;
            const  checkId      = await db(tableName).where({id}).first();

            if (!checkId) return res.status(404).json({
                status  : 'failed',
                message : 'Data not Found!',
                data    : {}
            });

            const deletedPost   = await db(tableName).where({id}).del();

            res.status(200).json({
                status  : 'success',
                message : 'Deleted post success!',
                data    : deletedPost
            });

        } catch (error) {

            res.status(500).json({
                status  : 'error',
                message : error?.message,
                data    : {}
            });

        }
    }else{

    return res.status(405).json({
        status  : 'failed',
        message : 'Method not allowed!',
        data    : {}
    });
  }


}