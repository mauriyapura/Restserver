
const {Router} = require("express");
const { check } = require("express-validator");
const { uploadFile1, updateImage, getImage, updateImageCloudinary } = require("../controllers/upload");
const { allowedCollections } = require("../helpers/db-validators");
const { validations, fileValidation } = require("../middlewares");

const router = Router();

router.get("/:collection/:id",[

], getImage);

router.post("/", fileValidation, uploadFile1);

router.put("/:collection/:id", [
    fileValidation,
    check("id", "Id must be a Mongo ID").isMongoId(),
    check("collection").custom(c => allowedCollections(c, ["users","products"])),
    validations
], updateImageCloudinary);





module.exports = router;