/// "/controllers/user.js" logique métier "sauce"

//modèle "Sauce"
const Sauce = require("../models/Sauce");

//package "fs" pour les fichiers (images)
const fs = require("fs");

//"createSauce" : création d'une sauce
exports.createSauce = (req, res, next) => {
  //json => objet JS
  const sauceObject = JSON.parse(req.body.sauce);
  //supprimer l'id dans la requête
  delete sauceObject._id;
  //modèle "sauce" pour DB
  const sauce = new Sauce({
    ...sauceObject,
    //url dynamisée pour être conforme au nom du fichier envoyé
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    //like/dislikes
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  //enregistrement dans DB
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//"getAllSauces" pour voir toutes les sauces dans l'API
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//"getOneSauce" pour voir une sauce de l'API
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

//"modifySauce" pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  // 2 possibilités : avec ou sans fichier image
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //mise à jour des modifications en vérifiant que "id" et "sauce" correspondent bien
  Sauce.updateOne(
    { _id: req.params.id, userId: sauceObject.userId },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(403).json({ error }));
};

//"deleteSauce" pour supprimer une "sauce"
exports.deleteSauce = (req, res, next) => {
  //"sauce" à supprimer par id
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //image à supprimer
      const filename = sauce.imageUrl.split("/images/")[1];
      //Suppression de "sauce" et image 
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

//"modifyLikeSauce" pour enlever ou ajouter un like/dislike
exports.modifyLikeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  //si like == 1 alors
  if (like == 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        //incrémentation d' un like de plus
        $inc: { likes: +1 },
        //push de "userId" dans tableau "usersLiked"
        $push: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "likes ajoutée !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //si like == -1 alors on incrémente le champ "dislikes" de +1 et on rajoute "userId" au tableau "usersLiked"
  if (like == -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        //incrémentation d'un' "dislikes" de plus
        $inc: { dislikes: +1 },
        //push "userID" dans le tableau "usersDisliked"
        $push: { usersDisliked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "dislikes ajoutée !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //si Like == 0 alors le "likes" ou "dislikes" "user" est annulé et userId est supprimé du tableau (usersDisliked/usersLiked)
  if (like == 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //si "userId" est dans "usersLiked"
        if (sauce.usersLiked.includes(userId)) {
          //suppression de userID de "usersLiked" et du like de "likes"
          Sauce.updateOne(
            { _id: req.params.id },
            {
              //+1
              $inc: { likes: -1 },
              //push tb
              $pull: { usersLiked: userId },
            }
          )
            .then(() => res.status(200).json({ message: "likes retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        //si "userId" est dans "usersDisliked"
        if (sauce.usersDisliked.includes(userId)) {
          //suppression de userID de "usersDisliked" et du like de "disikes"
          Sauce.updateOne(
            { _id: req.params.id },
            {
              //-1
              $inc: { dislikes: -1 },
              //pull tb
              $pull: { usersDisliked: userId },
            }
          )
            .then(() => res.status(200).json({ message: "dislikes retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};