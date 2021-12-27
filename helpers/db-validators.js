const Role = require("../models/role");
const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");

const isValidRole = async(role="")=>{    
    const requiredRole = await Role.findOne({role});
    if(!requiredRole){
        throw new Error(`Role ${role} is not registered in DB`)
    }    
};

const emailExist = async(email="")=>{
    const email1 = await User.findOne({email});
    if ( email1 ){
        throw new Error(`This email is already registered`)
    }
};

const userExists = async(id)=>{
    const user1 = await User.findById(id);
    if ( !user1 ){
        throw new Error(`ID: ${id} doesn't exist.`)
    }
};

const categoryExists = async(id)=>{    

    const categoryDB = await Category.findById(id);
    if(!categoryDB){
        throw new Error(`Category with ID ${id} doesn't exists`)
    }    
};

const productExists = async(id)=>{    

    const productDB = await Product.findById(id);
    if(!productDB){
        throw new Error(`Product with ID ${id} doesn't exists`)
    }    
};

// Validar colleciones permitidas
const allowedCollections = (collection="", collections=[])=> {

    const incluido = collections.includes(collection);

    if(!incluido){
        throw new Error(`Collection ${collection} is not allowed`);
    }

    return true;
};


module.exports = {
    isValidRole,
    emailExist,
    userExists,
    categoryExists,
    productExists,
    allowedCollections
}
