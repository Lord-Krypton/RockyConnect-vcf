const express = require('express');
const app = express();
const sessionsRouter = require('./routes/sessions');
const participantsRouter = require('./routes/participants');

app.use(express.json());

// Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/participants', participantsRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
