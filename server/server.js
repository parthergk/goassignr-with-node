const express = require("express");
const cors = require("cors");
const Router = require("./routes/data");
const app = express();

// CORS middleware configuration
app.use(cors()); // Allow CORS for all origins

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/data", Router);

// Enable preflight requests for the '/data' route
app.options('/data', cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
