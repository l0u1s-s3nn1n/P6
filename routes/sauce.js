/// "routes/sauce.js" : routes pour "sauce"

//package "express"
const express = require("express");

//"router" pour les routes "sauce"
const router = express.Router();

// "auth.js" pour la vérification des tokens
const auth = require("../middlewares/auth");

//"multer-config" pour les "images"
const multer = require("../middlewares/multer-config");

//controllers/sauce
const saucesCtrl = require("../controllers/sauce");

//routes pour "sauce"
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", saucesCtrl.modifyLikeSauce);

//exportation router
module.exports = router;
