const express = require("express");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("../errors/index");

const apiRouter = require("./routes/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path unknown" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
