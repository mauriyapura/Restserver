
const {Router} = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const { validations } = require("../middlewares/validations");

const router = Router();


router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validations
], login);

router.post("/google", [
    check("id_token", "Google Token is required").not().isEmpty(),    
    validations
], googleSignIn);


module.exports = router;
