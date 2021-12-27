const {Router} = require("express");
const { check } = require("express-validator");
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/categories");
const { categoryExists } = require("../helpers/db-validators");
const { validarJWT, validations, isAdmin } = require("../middlewares");

const router = Router();

// midleware personalizado para :id

// Obtener todas las categorias - publico
router.get("/", getCategories);

// Obtener una categoria por ID - publico
router.get("/:id", [
    check("id", "It is not a mongo ID").isMongoId(),
    check("id").custom(categoryExists),
    validations    
], getCategory);

// Crear categoria - Privado - solo usuarios con token
router.post("/", [
    validarJWT,
    check("name", "Name is required").not().isEmpty(),
    validations
], createCategory);

// Actualizar - privado
router.put("/:id", [
    validarJWT,
    check("name", "Name is required").not().isEmpty(),
    check("id").custom(categoryExists),
    validations
],updateCategory);

// Eliminar categoria - privado - solo admin
router.delete("/:id", [
    validarJWT,
    isAdmin,
    check("id", "It is not a mongo ID").isMongoId(),
    check("id").custom(categoryExists),
    validations    
], deleteCategory);


module.exports = router;