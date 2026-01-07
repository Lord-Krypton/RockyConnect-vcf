const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
