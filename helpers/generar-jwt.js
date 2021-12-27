const jwt = require('jsonwebtoken');


const generarJWT = ( uid='' )=>{

    return new Promise( (resolve, reject) => {

        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '2h'
        }, (err, token)=>{
            if(err){
                console.log(err);
                reject('Couldnt generate Token')
            }else{
                resolve(token);
            }
        })

    })
};

module.exports = {
    generarJWT
};
