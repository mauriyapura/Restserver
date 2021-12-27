
const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");
const validations = require("../middlewares/validations");
const fileValidation = require("./fileValidation");


module.exports = {
    ...validations,
    ...validarJWT,
    ...validarRoles,
    ...fileValidation
}
