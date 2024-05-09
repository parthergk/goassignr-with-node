const express = require("express");
const cors = require("cors");
const Router = require("./routes/data");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/data", Router);

app.listen(3000, () => {
  console.log("Server start");
});
