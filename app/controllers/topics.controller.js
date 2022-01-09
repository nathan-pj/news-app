const { showTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  const { body } = req.body;
  showTopics(body)
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};
