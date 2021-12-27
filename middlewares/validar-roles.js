
const isAdmin = (req, res, next)=>{

    if(!req.user){
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token primero"
        })
    };

    const {role, name} = req.user;

    if(role !== "ADMIN_ROLE"){
        return res.status(404).json({
            msg: `${name} is not Admin - He is unable to do this`
        })
    }    

    next();
};

const hasRole = ( ...roles )=> {
    
    return (req, res, next)=>{
        
        if(!req.user){
            return res.status(500).json({
                msg: "Se quiere verificar el rol sin validar el token primero"
            })
        };
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg: `The service requires one of these roles: ${roles}`
            })
        }
        next();
    }
};

module.exports = {
    isAdmin,
    hasRole
}