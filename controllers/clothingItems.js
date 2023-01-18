const ClothingItem = require('../models/clothingItem');
const handleError = require('../utils/validateUrl');
const InvalidDataError = require('../errors/invalid-data-error');
const AuthError = require('../errors/auth-error');

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  const likes = [];

  ClothingItem.create({
    name, weather, imageUrl, owner, likes,
  })
    .then((item) => res.status(201).send(item))
    .catch(next);
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new AuthError('Invalid Access');
      }
      return item.remove(() => res.send({ message: 'Item successfully deleted.', deleted: item }));
    })
    .catch(next);
};

module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch(next);
};

module.exports.dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch(next);
};
