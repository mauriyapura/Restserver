
const Product = require("../models/product");

const getProducts = async(req, res)=> {

    const {limit=5, from=0} = req.query;
    const query = {status: true};    

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)  //condicion=estado en true
            .populate("user", "name")
            .populate("category", "name")
            .skip(Number(from))
            .limit(Number(limit))        
    ]);
    res.json({                      
        total,
        products      
    });

};

const getProduct = async(req, res)=> {

    const {id} = req.params;
    const product  = await Product.findById(id)
                        .populate('user', 'name')
                        .populate('category', 'name');

    res.json(product);
};


const postProduct = async(req, res)=> {
    
    const {status, user, ...body} = req.body;

    const productoDB = await Product.findOne({ name: body.name });    
    if(productoDB){
        return res.status(400).json({
            msg: `Product ${productoDB.name} already exists`
        })
    } 
    
    const data = {
        name: body.name.toUpperCase(),        
        user: req.user._id,
        ...body         
    };
    const product = await Product.create(data);

    res.status(201).json(product);
};


const updateProduct = async(req, res)=> {

    const {id} = req.params;
    const {status, user, ...data} = req.body;

    if(data.nombre){
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, {new: true});
    // new en true muestra la info nueva en la respuesta

    res.json(product);
};

const deleteProduct = async(req, res)=> {

    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndUpdate( id, {status: false}, {new: true} );

    res.json(deletedProduct);
};

module.exports = {
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct
}


