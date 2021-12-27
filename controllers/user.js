const { response, request } = require('express');
const User = require("../models/user");
const bcrypt = require("bcrypt");

const getUser = async(req=request , res=response)=>{

    // Paginacion 
    const {limit=5, from=0} = req.query;
    const query = {status: true};    

    // Con promise.all se ejecuta ambas promesas simultaneamente, ya que ninguna promesa depende de otra, asi ahorramos tiempo de ejecución
    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)  //condicion=estado en true
            .skip(Number(from))
            .limit(Number(limit))        
    ]);
    res.json({                      
        total,
        users      
    });
};

const postUser = async (req, res)=>{    

    const { name, email, password, role } = req.body;
    const user = new User({name, email, password, role});      

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync( password, salt );    

    // Guardar en BD
    await user.save();
    res.json({               
        user        
    });
};

const putuser = async(req, res)=>{

    const {id} = req.params;
    const {password, google, ...resto} = req.body;

    // TODO validar contra BD
    if(password){
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync( password, salt );
    }
    const user = await User.findByIdAndUpdate(id, resto);

    res.json(user);
};
const patchUser = (req, res)=>{
    res.json({                
        msg: "patch API"
    });
};
const deleteUser = async(req, res)=>{

    const {id} = req.params;    

    // Fisicamente lo borramos
    //const user1 = await User.findByIdAndDelete(id);

    // Cambiamos estado a false. RECOMENDABLE
    const user2 = await User.findByIdAndUpdate(id, {status: false});    

    res.json(user2);
};

module.exports =  {
    getUser,
    postUser,
    putuser,
    patchUser,
    deleteUser
}

