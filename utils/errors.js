function handleError(err, res) {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(400).send({ message: 'Invalid data.' });
  } else if (err.name === 'LoginError') {
    res.status(401).send({ message: 'Incorrect email or password' });
  } else if (err.message === 'Invalid Access') {
    res.status(403).send({ message: 'Invalid authorization' });
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'User ID not found.' });
  } else if (err.message === 'ExistingUser') {
    res.status(409).send({ message: 'There is already a user with that email.' });
  } else {
    res
      .status(500)
      .send({ message: 'An error has occurred on the server.' });
  }
}

module.exports = handleError;
