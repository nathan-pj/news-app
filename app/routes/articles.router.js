const articlesRouter = require("express").Router();

const {
  getSpecificArticle,
  patchArticle,
  getArticles,
  getArticleComments,
  postArticleComment,
  postArticle,
} = require("../controllers/articles.controller");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);

articlesRouter
  .route("/:article_id")
  .get(getSpecificArticle)
  .get(getArticleComments)
  .patch(patchArticle);

module.exports = articlesRouter;
