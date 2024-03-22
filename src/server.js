require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import routes
const playerRoutes = require('./routes/playerRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const userRoutes = require('./routes/usersRoutes');

const app = express();

const cors = require('cors');
app.use(cors());

// Enable CORS for a specific domain
app.use(cors({ origin: 'http://localhost:3000' }));
//app.use(cors({ origin: 'http://192.168.0.177:3000' })); This does not currently work, but it should allow the React app to access the server from a different IP address
//Currently commented out to allow for testing on the same machine

// Connect to MongoDB
//  Connection string for Gannod's MongoDB
mongoose.connect('mongodb://mongoadmin:c%40pSt0n3Sp24!@csclnx01.tntech.edu:27017/nestdb?authMechanism=DEFAULT&authSource=admin')

// Connection string for Kyle's MongoDB
//mongoose.connect('mongodb+srv://kyleh865:Password@nestcluster.xzqjz3i.mongodb.net/nestdb?retryWrites=true&w=majority')

// Determine MongoDB URI based on the environment
let mongoURI;

const env = process.env.NODE_ENV;
// Determine the URI based on NODE_ENV
if (env.includes('_OFFCAMPUS')) {
  mongoURI = process.env[`MONGO_URI_${env}`];
} else {
  mongoURI = process.env[`MONGO_URI_${env}`] || process.env.MONGO_URI_DEVELOPMENT;
}

mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB at ${mongoURI}`))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Setup routes
app.use('/api/players', playerRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/practices', practiceRoutes);
app.use('/api/drills', drillRoutes);
app.use('/api/tempoEvents', tempoEventRoutes);
app.use('/api/shotEvents', shotEventRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);


const port = process.env.PORT || 3001; // Use environment variable or default to 3001
// Start the server on a single port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
