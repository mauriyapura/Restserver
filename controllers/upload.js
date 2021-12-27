const path = require("path");
const fs = require("fs");
const { uploadFile } = require("../helpers/upload-file");
const {User, Product} = require("../models/index");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile1 = async(req, res)=> {   
 
  try {
      //const name = await uploadFile(req.files,["txt", "md"], "texts");
      const name = await uploadFile(req.files, undefined, "imgs");
      res.json({
          name
      })      
  } catch (msg) {
      res.status(400).json({msg})
  }  
    
};

// Esta es para aprender a subir localmente
const updateImage = async(req, res)=> {    

    const {id, collection} = req.params;
    let model;

    switch (collection) {
        case "users":
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({msg: ` User with ID ${id} doesn't exists`})
            }
        break;
        case "products":
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({msg: ` Product with ID ${id} doesn't exists`})
            }                   
        break;
        
        default:
            return res.status(500).json({msg: "se me olvido validar esto"});
    }

    // Limpiar imagenes previas
    if(model.img){
        // Hay que borrar la img del servidor
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;

    await model.save();
    res.json(model);
};

// esta es para subir a la nube 
const updateImageCloudinary = async(req, res)=> {    

    const {id, collection} = req.params;
    let model;

    switch (collection) {
        case "users":
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({msg: ` User with ID ${id} doesn't exists`})
            }
        break;
        case "products":
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({msg: ` Product with ID ${id} doesn't exists`})
            }                   
        break;
        
        default:
            return res.status(500).json({msg: "se me olvido validar esto"});
    }

    // Limpiar imagenes previas
    if(model.img){
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');

        cloudinary.uploader.destroy(public_id);
    }
    
    const {tempFilePath} = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath ); 
    model.img = secure_url;
    await model.save();
    res.json(model);
};


const getImage = async(req, res, next)=> {

    const {id, collection} = req.params;
    let model;

    switch (collection) {
        case "users":
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({msg: ` User with ID ${id} doesn't exists`})
            }
        break;
        case "products":
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({msg: ` Product with ID ${id} doesn't exists`})
            }                   
        break;
        
        default:
            return res.status(500).json({msg: "se me olvido validar esto"});
    }

    // Limpiar imagenes previas
    if(model.img){
        // Hay que borrar la img del servidor
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if(fs.existsSync(pathImage)){
            return res.sendFile(pathImage);
        }
    }  

    const pathPlaceholderImage = path.join(__dirname, "../assets/no-image.jpg");
    res.sendFile(pathPlaceholderImage);    

};


module.exports = {
    uploadFile1,
    updateImage,
    getImage,
    updateImageCloudinary
}

