const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

class AuthController {
  static async signup(req, res) {
    // Vérifiez si l'e-mail est déjà utilisé
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // L'e-mail est déjà utilisé, renvoie une réponse d'erreur
      res.status(409).json({ message: 'Cet e-mail est déjà utilisé.' });
    }
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          userName: req.body.userName,
          email: req.body.email,
          password: hash,
          adress: {
            street: '',
            city: req.body.adress.city,
            postalCode: req.body.adress.postalCode,
            country: '',
          },
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }

  static async login(req, res) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: '1h' },
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
}

module.exports = AuthController;
