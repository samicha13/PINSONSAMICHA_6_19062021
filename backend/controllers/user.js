//Import des packages nécéssaires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const mailValidator = require("email-validator");
const passwordValidator = require('password-validator');
const schema = new passwordValidator();


//  Schema de validation de l'émail
schema.is().min(8)                                    // Minimum  8
schema.is().max(100)                                  // Maximum 100
schema.has().uppercase(1)                              // Maj obligatoire
schema.has().lowercase()                              // Min obligatoire
schema.has().digits(2)                                // Min 2 chiffres
schema.has().not().spaces()                           // Pas d'espaces
schema.is().not().oneOf(['Passw0rd', 'Password123', 'qwertyuiop', 'qwerty', 'azertyuiop', 'azerty']); // MDP non valide car trop facile a trouver


// création nouvel utilisateur
exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email)) {
    // vérification de l'émail
    return res.status(400).json({ message: "Email incorrect" })
  };

  if (schema.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
        
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  } else {
   
    res.status(400).json({ message: schema.validate(req.body.password, { list: true })})
  } 
};

// Conexion d'un utilsateur à son compté déjà existant
exports.login = (req, res, next) => {
  
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // hash MDP
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.TK_SESSION,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};