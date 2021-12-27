
const {Router} = require("express");
const { check } = require("express-validator");

const { getUser, postUser, putuser, patchUser, deleteUser } = require("../controllers/user");
const { isValidRole, emailExist, userExists } = require("../helpers/db-validators");

const { validations, validarJWT, isAdmin, hasRole } = require("../middlewares");   // Así directamente se apunta al index

const router = Router();


router.get("/", getUser);
router.post("/", [
    check("name", "name is required").not().isEmpty(),
    check("password", "password must be at least 6 characters").isLength({min: 6}),
    check("email", "email is not valid").isEmail(),
    //check("role", "Invalid role").isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check("email").custom(emailExist),
    check("role").custom(isValidRole),
    validations
], postUser );
router.put("/:id", [
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(userExists),
    check("role").custom(isValidRole),
    validations    
], putuser);
router.patch("/", patchUser);
router.delete("/:id", [
    validarJWT,
    //isAdmin,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(userExists),    
    validations  
],deleteUser);





module.exports = router;

