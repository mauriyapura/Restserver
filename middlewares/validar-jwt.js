const jwt = require('jsonwebtoken');
const User = require("../models/user");

const validarJWT = async(req, res, next)=> {
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "There isn't token in the request"
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el user que corresponde al uid
        const user = await User.findById(uid); 

        if(!user){
            return res.status(401).json({
                msg: "Invalid Token- User doesn't exist"
            }) 
        }

        // Verificar si el uid tiene status en true
        if(!user.status){
            return res.status(401).json({
                msg: "Invalid Token- Status false"
            })
        }

        req.user = user;        
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Invalid Token"
        })        
    }

};

module.exports = {
    validarJWT
}
