const express = require("express");
const cors = require("cors");
const Router = require("./routes/data");
const app = express();

// CORS middleware configuration
app.use(cors({
  origin: 'https://goassignr.vercel.app',
}));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging middleware for requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/data", Router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
