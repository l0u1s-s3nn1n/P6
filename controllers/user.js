/// "controllers/user.js" : logique métier pour "user"

//modèle "User"
const User = require("../models/User");

//"jsonwebtoken"(vérifier les tokens)
const jwt = require("jsonwebtoken");

//"bcrypt" (mots de passe cryptés)
const bcrypt = require("bcrypt");

//"dotenv"(variables d'environnement)
require("dotenv").config();

//token secret
const secretKey = process.env.TOKEN_KEY;

//fonction "signup" pour créer un compte "user"
exports.signup = (req, res, next) => {
  //hash password avec bcrypt
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      //model "user" pour DB
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //enregistrement dans la DB
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//fonction "login" pour se connecter à un compte "user"
exports.login = (req, res, next) => {
  //on récupère le compte dans la DB avec l'email fournit
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvée !" });
      }
      //Si on trouve un "user" alors on compare le mot de passe du front au back (tokens)
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          //Si mauvais mot de passe
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //Si mot de passe : ok
          res.status(200).json({
            //token pour le "user"
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${secretKey}`, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};