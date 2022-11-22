const ClothingItem = require('../models/clothingItem');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server' }));
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  const likes = [];

  ClothingItem.create({
    name, weather, imageUrl, owner, likes,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Invalid data for clothing item creation.' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const itemOwner = req.params.owner;
  const  requestOwner = req.user._id;
  if(requestOwner !== itemOwner) {
    throw new Error('InvalidAccess');
  }

  ClothingItem.findByIdAndRemove(itemId)
    .orFail()
    .then((item) => res
      .status(200)
      .send({ message: 'Item successfully deleted.', deleted: item })) 
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Item ID not found.' });
      } else if (err.name === 'InvalidAccess') {
        res.status(403).send({ message: 'Invalid authorization'});
      } 
      else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID format' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Item ID not found.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID format' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Item ID not found.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID format' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};
