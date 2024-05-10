const express = require("express");
const cors = require("cors");
const Router = require("./routes/data");

const app = express();

app.use(cors({
  origin: 'https://goassignr.vercel.app/',
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/data", Router);

app.listen(3000, () => {
  console.log("Server start");
});
