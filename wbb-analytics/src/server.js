const express = require('express');
const mongoose = require('mongoose');
const playersRoutes = require('./routes/playersRoutes');
const drillsRoutes = require('./routes/drillsRoutes');
const practiceSessionsRoutes = require('./routes/practiceSessionsRoutes');
const shotsRoutes = require('./routes/shotsRoutes');
const temposRoutes = require('./routes/temposRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nestdb')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware to parse JSON
app.use(express.json());

app.use('/api/players', playersRoutes);
app.use('/api/drills', drillsRoutes);
app.use('/api/sessions', practiceSessionsRoutes);
app.use('/api/shots', shotsRoutes);
app.use('/api/tempos', temposRoutes);

const port = 3001; // Port where the server will listen
// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});