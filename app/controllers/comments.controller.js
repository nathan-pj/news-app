const { deleteComment } = require("../models/comments.model");

exports.removeComment = (req, res, next) => {
  deleteComment(req.params.comment_id)
    .then((comments) => {
      res.status(204).send();
    })
    .catch(next);
};
