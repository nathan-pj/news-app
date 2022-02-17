const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("../errors/index");

const apiRouter = require("./routes/api.router");

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path unknown" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
