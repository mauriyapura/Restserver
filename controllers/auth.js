
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { json } = require("express/lib/response");



const login = async(req, res)=> {

    const {email, password} = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                msg: "User or Password Incorrect - Email"
            })
        };

        // Si esta activo en la BD
        if(!user.status){
            return res.status(400).json({
                msg: "User or Password Incorrect - Status false"
            })
        };

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "User or Password Incorrect -  Password"
            })
        };

        // generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });
        
    } catch (error) {
        return res.status(500).json({
            msg: "Something went wrong"
        })
    }

};

const googleSignIn = async (req, res, next)=> {

    const {id_token} = req.body;

    try {
        
        const {name, img, email} = await googleVerify(id_token);
        let user = await User.findOne({email});        
        
        if(!user){
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':P',
                img,
                role: "USER_ROLE",
                google: true 
            };            
            user = new User(data);
            await user.save();
        };
        // Si el usuario en DB 
        if(!user.status){
            return res.status(401).json({
                msg: "blocked account"
            })
        };
        
        // generar el JWT
        const token = await generarJWT(user.id);          
        
        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "El Token no se pudo verificar"
        })        
    }

}

module.exports = {
    login,
    googleSignIn
}
