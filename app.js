/**IMPORT */
const express = require('express');
const mongoose = require('mongoose');

/**ROUTES */
const userRoutes = require('./routes/user');
const sauceRoutes = require("./routes/sauce");

/**MONGOOSE */
//connect to database
mongoose.connect('mongodb+srv://louis:motdepassedelouis@cluster0.yvzth.mongodb.net/cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/**APP EXPRESS */
//création de l'app
const app = express();
//json pour front-end
app.use(express.json());

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

//
app.use('/api/auth', userRoutes);

//
module.exports = app;






