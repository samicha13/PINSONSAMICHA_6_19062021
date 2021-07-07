//Import schema Sauce .
const Sauce = require('../models/sauce');
//Import package File System
const fs = require('fs');

//Creation d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'La sauce a été enregistré!' }))
    .catch(error => res.status(400).json({ error }));
};

//Recupération d'une sauce
exports.getSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Modification  sauce.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'La sauce a été modifié!' }))
    .catch(error => res.status(400).json({ error }));
};

//effacer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'La sauce a été éffacé!' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//List des sauces.
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// LIKES / DISLIKES 
// userLiked,  userDisliked, userID définis grâce au modéle de données fournis dans la doc
exports.likeDislikeSauces = (req, res, next) => {
  const userAvis = new Sauce({ // constante choix avis de l'utilisateur s'il aime ou n'aime pas 
    likes: req.body.like,
    userId: req.body.userId
  });
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      Sauce.updateOne({ _id: req.params.id }, sauce)
      //Session like
      if (userAvis.likes === 1 && !sauce.usersLiked.includes(userAvis.userId)) {
        sauce.likes = sauce.likes + 1;
        sauce.usersLiked.push(userAvis.userId);
      }
      //SUPPRIMER SON LIKE OU DISLIKE
      else if (userAvis.likes === 0) {
        //Supprimer le like déja mis
        if (sauce.usersLiked.includes(userAvis.userId)) {
          let userLikedSauce = sauce.usersLiked.indexOf(userAvis.userId);
          sauce.likes = sauce.likes - 1;
          sauce.usersLiked.splice(userLikedSauce, 1);
        }
        //Si l'utillsateur veut annuler son dislike
        if (sauce.usersDisliked.includes(userAvis.userId)) {
          let userDislikedSauce = sauce.usersDisliked.indexOf(userAvis.userId);
          sauce.dislikes = sauce.dislikes - 1;
          sauce.usersDisliked.splice(userDislikedSauce, 1);
        }
      }
      //Session dislikes
      else if (userAvis.likes === -1 && !sauce.usersDisliked.includes(userAvis.userId)) {
        sauce.dislikes = sauce.dislikes + 1;
        sauce.usersDisliked.push(userAvis.userId);
      }
      sauce.save(sauce)
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};