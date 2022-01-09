const { PORT = 9090 } = process.env;
const app = require("./app/app");

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Listening on ${PORT}...`);
});
