const User = require('../models/user');

module.exports.getUsers = (req, res) => {
    User.find({})
        .then(user => res.send({data: user}))
        .catch(() => res.status(500).send({message: 'An error has occurred on the server.'}));
}

module.exports.getUserById = (req, res) => {
    const userId  = req.params.userId;
    
    User.findById(userId)
        .orFail(() => {
            const err = new Error("Item ID not found");
            err.statusCode = 404;
            err.name = "NotFound";
            throw err;
        })
        .then(user => res.send({data: user}))
        .catch((err) => {
            if(err.name === "NotFound") {
                res.status(404).send({message: 'User ID not found.'});
            } else if(err.name === "CastError"){
                res.status(400).send({message: 'Invalid ID format.'})
            } else {
                res.status(500).send({message: 'An error has occurred on the server.'});
            }
        });
}

module.exports.createUser = (req, res) => {
    const { name, avatar } = req.body;
    
    User.create({ name, avatar })
        .then(user => res.send({data: user}))
        .catch((err) => {
            if(err.name === "ValidationError") {
                res.status(400).send({message: 'Invalid data for user creation.'});
            } else {
                res.status(500).send({message: 'An error has occurred on the server.'});
            }
        });
}