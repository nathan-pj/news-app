const {
  showSpecificArticle,
  updateArticle,
  showArticles,
  showArticleComments,
  addArticleComment,
  addArticle,
} = require("../models/articles.model");

exports.getSpecificArticle = (req, res, next) => {
  const { article_id } = req.params;
  //

  showSpecificArticle(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const vote = req.body;

  updateArticle(article_id, vote.inc_votes)
    .then((article) => {
      if (!vote.inc_votes) {
        res.status(200).send({ article: article });
      } else {
        res.status(201).send({ article: article });
      }
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  showArticles(query)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { params } = req;
  showArticleComments(params.article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  comment = req.body.body;
  username = req.body.username;

  addArticleComment(article_id, comment, username)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const body = req.body.body;
  const title = req.body.title;
  const topic = req.body.topic;
  const author = req.body.author;
  const created_at = req.body.created_at;
  addArticle(body, title, topic, author, created_at)
    .then((article) => {
      res.status(201).send({ article: article });
    })
    .catch(next);
};
