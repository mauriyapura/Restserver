require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");


class Server {    
    constructor(){
        
        this.port = process.env.PORT || 5000;
        this.app = express();
        this.paths = {
            auth: "/api/auth",
            users: "/api/users",
            categories: "/api/categories",
            products: "/api/products",
            search: "/api/search",
            uploads: "/api/uploads"             
        }        

        // Conectar a base de datos
        this.conectarDB();
        
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection()
    }

    routes(){
        this.app.use(this.paths.auth, require("../routes/auth"));       
        this.app.use(this.paths.users, require("../routes/user"));    
        this.app.use(this.paths.categories, require("../routes/categories"));    
        this.app.use(this.paths.products, require("../routes/products")); 
        this.app.use(this.paths.search, require("../routes/search"));
        this.app.use(this.paths.uploads, require("../routes/uploads"));
    }

    middlewares(){
        // CORS
        this.app.use(cors());
        // Carpeta public
        this.app.use(express.static("public"));
        // Lectura y parseo de body
        this.app.use(express.json());
        // FileUpload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    serverStart(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listening on port `, this.port)
        })
    }

}

module.exports = Server;