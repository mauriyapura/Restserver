
const { Category } = require("../models")

// getCategories - paginado - total - populate
const getCategories = async(req, res)=> {

    const {limit=5, from=0} = req.query;
    const query = {status: true};    

    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)  //condicion=estado en true
            .populate("user", "name")
            .skip(Number(from))
            .limit(Number(limit))        
    ]);
    res.json({                      
        total,
        categories      
    });
};

// getCategory - populate {}
const getCategory = async(req, res)=> {

    const {id} = req.params;
    const category  = await Category.findById(id).populate('user', 'name');

    res.json(category);
};

const createCategory =  async(req, res)=> {
    
    const nameUC = req.body.name.toUpperCase();    
    const categoryDB = await Category.findOne({ name: nameUC });    
    if(categoryDB){
        return res.status(400).json({
            msg: `Category ${categoryDB.name} already exists`
        })
    }    
    
    // Generar la data a guardar
    const data = {
        name: nameUC,
        user: req.user._id
    };
    const category = await Category.create(data);
    
    res.status(201).json(category);
}

// updateCategory 
const updateCategory = async(req, res)=> {

    const {id} = req.params;
    const {status, user, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, {new: true});
    // new en true muestra la info nueva en la respuesta

    res.json(category);
};

// deleteCategory  (status=false)  
const deleteCategory = async(req, res)=> {

    const {id} = req.params;
    const deletedCategory = await Category.findByIdAndUpdate( id, {status: false}, {new: true} );

    res.json(deletedCategory);
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};