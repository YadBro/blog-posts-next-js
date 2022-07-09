import jwt from "jsonwebtoken";


export default function authorization(req, res) {

  return new Promise((resolve, reject) => {

    const {
      authorization
    } = req.headers;

    if (!authorization) return res.status(401).json({
      status: 'Unauthorized!',
      message: 'Access Denied!'
    });

    const [authType, token] = authorization.split(" ");

    if (authType !== "Bearer") return res.status(401).json({
      status: 'Unauthorized!',
      message: 'Access Denied!'
    });

    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({
        status: 'Unauthorized!',
        message: 'Access Denied!'
      });
      return resolve(decoded);
    });
  });
}