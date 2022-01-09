const apiRouter = require("express").Router();
const articlesRouter = require("./articles.router");
const topicsRouter = require("./topics.router");
const fs = require("fs");
const commentsRouter = require("./comments.router");
const path = require("path");
apiRouter.get("/", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../../endpoints.json")
  );
  let endpoints = JSON.parse(rawdata);
  res.status(200).send(endpoints);
});

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
