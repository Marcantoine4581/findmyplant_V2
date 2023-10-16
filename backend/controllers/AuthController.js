const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

class AuthController {
  static async signup(req, res) {
    // Vérifiez si l'e-mail est déjà utilisé
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        // L'e-mail est déjà utilisé, renvoie une réponse d'erreur
        return res.status(409).json({ message: 'Cet e-mail est déjà utilisé.' });
      }
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit avoir au moins 6 caractères.' });
      }

      const hash = await bcrypt.hash(req.body.password, 10);

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

      const newUser = await user.save();
      return res.status(201).json({ message: `Bienvenue ${newUser.userName}` });
    } catch (error) {
      return res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'enregistrement' });
    }
  }

  static async login(req, res) {
    try {
      const userfound = await User.findOne({ email: req.body.email });
      if (!userfound) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
      const result = await bcrypt.compare(req.body.password, userfound.password);
      if (!result) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
      return res.status(200).json({
        userId: userfound._id,
        token: jwt.sign(
          { userId: userfound._id },
          process.env.SECRET_TOKEN,
          { expiresIn: '1h' },
        ),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
