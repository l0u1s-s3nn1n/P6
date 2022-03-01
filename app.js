/// "app.js" est l'application pour les requêtes venant du serveur

//framework "express"
const express = require("express");

//création de l'application "express"
const app = express();

//"body-parser"  pour le json
const bodyParser = require("body-parser");

//"helmet" sert à se protéger contre plusieurs failles de sécurité
const helmet = require("helmet");

//"path" permet de créer des chemins
const path = require("path");

//"dotenv" permet de gérer des variables d'environnement
const dotenv = require("dotenv");

//routeur "userRoutes"(/route/user.js)
const userRoutes = require("./routes/user");

//routeur "sauceRoutes"(/routes/sauce.js)
const sauceRoutes = require("./routes/sauce");

//"mongoose" permets d'accéder à mongoDB
const mongoose = require("mongoose");

//chargement du fichier ".env"
dotenv.config();

//connexion à DB
mongoose.connect(`mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//middleware "bodyparser" requête = données JSON en objets JS
app.use(bodyParser.json());

//middleware d'appel "helmet" dans l'app express
app.use(
  helmet({
    crossOriginResourcePolicy: false,//corrige erreur console
    // ...
  })
);

//middleware CORS(sécurité)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//middleware routes
//indication de la route "images" (path)
app.use("/images", express.static(path.join(__dirname, "images")));

//indication de la route racine "/api/auth"
app.use("/api/auth", userRoutes);

//indication de la route racine "/api/sauces"
app.use("/api/sauces", sauceRoutes);

//exportation "app.js"
module.exports = app;
