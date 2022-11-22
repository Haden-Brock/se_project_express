const ClothingItem = require('../models/clothingItem');
const { handleError } = require('../utils/errors');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => handleError(err, res));
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
      handleError(err, res);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new Error('Invalid Access');
      }
      return item.remove(() => res.send({ message: 'Item successfully deleted.', deleted: item }));
    })
    .catch((err) => {
      handleError(err, res);
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
      handleError(err, res);
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
      handleError(err, res);
    });
};
