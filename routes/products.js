
const {Router} = require("express");
const { check } = require("express-validator");
const { postProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/products");
const { validarJWT, validations, isAdmin } = require("../middlewares");
const { productExists, categoryExists } = require("../helpers/db-validators");


const router = Router();

router.get("/", getProducts);

router.get("/:id", [
    check("id", "It is not a mongo ID").isMongoId(),
    check("id").custom(productExists),
    validations
], getProduct);

router.post("/", [
    validarJWT,
    check("name", "Name is required").notEmpty(),
    check("category", "Invalid Mongo ID").isMongoId(),
    check("category").custom(categoryExists),
    validations
], postProduct);

router.put("/:id",[
    validarJWT,
    //check("category", "Invalid Mongo ID").isMongoId(),
    check("id").custom(productExists),
    validations
], updateProduct);

router.delete("/:id", [
    validarJWT,
    isAdmin,
    check("id", "Invalid Mongo ID").isMongoId(),
    check("id").custom(productExists),
    validations
], deleteProduct);



module.exports = router;


