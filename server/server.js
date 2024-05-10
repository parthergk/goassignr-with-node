const express = require("express");
const cors = require("cors");
const Router = require("./routes/data");
const app = express();

// CORS middleware configuration
app.use(cors({origin: 'https://goassignr.vercel.app'})); // Allow CORS for all origins

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api", Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
