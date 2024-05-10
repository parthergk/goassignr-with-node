const express = require("express");
const cors = require("cors");
const Router = require("./routes/data");

const app = express();

app.use(cors({
  origin: 'https://goassignr.vercel.app'
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add headers to allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://goassignr.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/data", Router);

app.listen(3000, () => {
  console.log("Server start");
});
