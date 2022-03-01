///"multer-config.js" paramètre "multer" pour les images

//package "multer" 
const multer = require("multer");

//MIME_TYPES pour l'extension des fichiers
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//création d'un objet pour le "multer"
const storage = multer.diskStorage({
  //dossier dans lequel seront enregistré les fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //nom du fichier à utiliser
  filename: (req, file, callback) => {
    //nouveau nom de fichier à partir du originalName
    const name = file.originalname.split(".")[0];
    //newName
    const newName = name.split(" ").join("_");
    //extansion (jpg, png, jpeg) (MIME_TYPES)
    const extension = MIME_TYPES[file.mimetype];
    callback(null, newName + "_" + Date.now() + "." + extension);
  },
});

//exportation (une seule image)
module.exports = multer({ storage: storage }).single("image");