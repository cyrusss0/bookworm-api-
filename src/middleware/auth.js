const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split('Bearer ')[1]; // Corrected token extraction
    const decoded = jwt.verify(token, 'pufful');

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error('User doesnt exist');
    }

    req.token = token;
    req.user = user;
    console.log('before next');
    next();
    console.log('after next');
  } catch (err) {
    res.status(401).send({ error: 'Please Authenticate' });
  }
};

module.exports = auth;
