const path = require("path");
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder="")=> {

    return new Promise((resolve, reject)=>{
        
        const { file } = files;
        const nameSplitted = file.name.split('.');
        const extension = nameSplitted[nameSplitted.length -1];
        
        // Validar la extension
        
        if(!allowedExtensions.includes(extension)){
            return reject(`Extension ${extension} is invalid`)         
        }
      
        // Cambiar nombre de archivo subido por identificador unico
        const temporalName = uuidv4() + '.' + extension ;      
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporalName) ;      
        file.mv(uploadPath, (err)=> {
          if (err) {
            reject(err)
          }
          resolve(temporalName);          
        });
    });
};


module.exports = {
    uploadFile
}

