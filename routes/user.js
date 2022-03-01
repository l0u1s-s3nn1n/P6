/// "/routes/user.js": routes pour "user"

//package "express"
const express = require("express");

//"router" pour les routes "user"
const router = express.Router();

//"controllers" des routes "user"
const userCtrl = require("../controllers/user");

//routes pour "user"
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//exportation "router"
module.exports = router;