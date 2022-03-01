///"auth.js" pour la validation des tokens 

//package "jsonwebtoken"
const jwt = require("jsonwebtoken");

//package "dotenv" (variables d'environnements)
require("dotenv").config();

//token secret
const secretKey = process.env.TOKEN_KEY;

//middleware de base auth
module.exports = (req, res, next) => {
  try {
    //récupération du token 
    const token = req.headers.authorization.split(" ")[1];
    //décodage du token en objet et vérification 
    const decodedToken = jwt.verify(token, `${secretKey}`);
  
    const userId = decodedToken.userId;
    //on vérifie que le userID venant du front = celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID invalide !";
    } else {
      //si les "userId" sont les mêmes
      next();
    }
  } catch {
    //erreurs authentification
    res.status(401).json({ error: new Error("Requête non authentifiée !") });
  }
};
