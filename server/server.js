const express = require('express');
const mongoose = require('mongoose');
const playerRoutes = require('./routes/playerRoutes');
const drillsRoutes = require('./routes/drillsRoutes');
const practiceSessionsRoutes = require('./routes/practiceSessionsRoutes');
const shotsRoutes = require('./routes/shotsRoutes');
const temposRoutes = require('./routes/temposRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const userRoutes = require('./routes/usersRoutes');

const app = express();

const cors = require('cors');

// Enable CORS for a specific domain
app.use(cors({ origin: 'http://localhost:3000' }));
//app.use(cors({ origin: 'http://192.168.0.177:3000' })); This does not currently work, but it should allow the React app to access the server from a different IP address
//Currently commented out to allow for testing on the same machine

// Connect to MongoDB
//  Connection string for Gannod's MongoDB
mongoose.connect('mongodb://mongoadmin:c%40pSt0n3Sp24!@csclnx01.tntech.edu:27017/nestdb?authMechanism=DEFAULT&authSource=admin')

// Connection string for Kyle's MongoDB
//mongoose.connect('mongodb+srv://kyleh865:Password@nestcluster.xzqjz3i.mongodb.net/nestdb?retryWrites=true&w=majority')


.then(() => console.log(mongoose.connection))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware to parse JSON
app.use(express.json());

app.use('/api/players', playerRoutes);
app.use('/api/drills', drillsRoutes);
app.use('/api/sessions', practiceSessionsRoutes);
app.use('/api/shots', shotsRoutes);
app.use('/api/tempos', temposRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/users', userRoutes);

const port = 3001; // Port where the server will listen
// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});