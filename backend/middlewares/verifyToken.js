const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
           return res.status(401).send({ error: 'No headers provided' })
       }
       const token = req.headers.authorization.split(' ')[1];
       console.log(token);
       const verify = jwt.verify(token, process.env.SECRET_KEY)
       if (verify) {
           req.user = verify
        next()
       }
   } catch (error) {
       if (error instanceof jwt.JsonWebTokenError) {
           res.status(401).send("Invalid Token.");
       } else {
           res.status(500).send('Internal server error.')
           console.log(error);
       }
   }
}

const isAdmin = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ error: 'No headers provided' })
        }
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const verify = jwt.verify(token, process.env.SECRET_KEY)
        if (verify) {
            req.user = verify
               if (req.user.isAdmin) {
                   next(); 
               } else {
                   res.status(403).send("Unauthorized. User is not an admin.");
               }
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).send("Invalid Token.");
        } else {
            res.status(500).send('Internal server error.')
            console.log(error);
        }
    }
}

module.exports = {isAuth,isAdmin}