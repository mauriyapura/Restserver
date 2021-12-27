const {response} = require("express");
const {ObjectId} = require("mongoose").Types;
const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");

const allowedCollections = [
    "users",
    "categories",
    "products",
    "roles"
];

const searchUsers = async( searchTerm = "", res=response )=> {

    const isMongoID = ObjectId.isValid( searchTerm );

    if(isMongoID){
        const user = await User.findById(searchTerm);
        return res.json({
            results: (user) ? [user] : []
        })
    };

    const regex = new RegExp( searchTerm, 'i' );  // Expresion regular insensible a mayus y minus

    const users = await User.find({ 
        $or: [{name: regex}, {email: regex}],
        $and: [{status: true}]
    });
    res.json({
        results: users
    });
};

const searchCategories = async( searchTerm = "", res=response )=> {

    const isMongoID = ObjectId.isValid( searchTerm );

    if(isMongoID){
        const category = await Category.findById(searchTerm);
        return res.json({
            results: (category) ? [category] : []
        })
    };

    const regex = new RegExp( searchTerm, 'i' );  // Expresion regular insensible a mayus y minus

    const categories = await Category.find({name: regex, status: true});
    res.json({
        results: categories
    });
};

const searchProducts = async( searchTerm = "", res=response )=> {

    const isMongoID = ObjectId.isValid( searchTerm );

    if(isMongoID){
        const product = await Product.findById(searchTerm).populate("category","name");
        return res.json({
            results: (product) ? [product] : []
        })
    };

    const regex = new RegExp( searchTerm, 'i' );  // Expresion regular insensible a mayus y minus

    const products = await Product.find({name: regex, status: true})
                        .populate("category","name");
    res.json({
        results: products
    });

};


const search = async(req, res)=>{

    const { collection, searchTerm } = req.params;

    if(!allowedCollections.includes(collection)){
        return res.status(400).json({
            msg: `Allowed collections are: users, categories, products, roles `
        })
    };     

    switch (collection) {
        case "users":
            searchUsers(searchTerm, res);   
        break;

        case "categories":
            searchCategories(searchTerm, res);
        break;

        case "products":
            searchProducts(searchTerm, res);

        break;
    
        default:
            res.status(500).json({
                msg: "Error in backend. Sorry!"
            })
    }    

};

module.exports = {
    search
}
