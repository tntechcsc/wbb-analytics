const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
const Season = require('../models/season');
const Player = require('../models/player');
const GameSession = require('../models/gameSession');
const PracticeSession = require('../models/practiceSession');
const Drill = require('../models/drill');
const Tempo = require('../models/tempo');
const Shot = require('../models/shot');


const Joi = require('joi');

//#region Player Routes

// GET all players - Lists all players, essential for team overview and player selection
router.get('/players', async (req, res) => {
    try {
      const players = await Player.find();
      res.json(players);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });
  
  // GET a player by name
  router.get('/players/name/:name', async (req, res) => {
      try {
          // Use a case-insensitive search to find the player by name
          const player = await Player.findOne({ name: { $regex: new RegExp(req.params.name, "i") } });
          if (!player) {
              return res.status(404).json({ message: 'Player not found' });
          }
          res.json(player);
      } catch (err) {
          res.status(500).json({ message: 'Internal server error', error: err.message });
      }
  });
  
  // GET players by position
  router.get('/players/position/:position', async (req, res) => {
      try {
          // Find players with the provided position
          const players = await Player.find({ position: req.params.position });
          res.json(players);
      } catch (err) {
          res.status(500).json({ message: 'Internal server error', error: err.message });
      }
  });
  
  // GET a specific player by ID - Essential for viewing detailed player stats and information
  router.get('/players/:id', async (req, res) => {
      try {
        // Attempt to find a player by ID provided in the route parameter
        const player = await Player.findById(req.params.id);
        if (player) {
          // If the player is found, return the player document
          res.json(player);
        } else {
          // If no player is found with the given ID, return a 404 not found error
          res.status(404).json({ message: 'Player not found' });
        }
      } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
      }
  });
  
  // POST a new player - Allows adding a new player, crucial for roster updates
  router.post('/players', async (req, res) => {
      // Define a schema for input validation
      const schema = Joi.object({
          name: Joi.string().required(),
          position: Joi.string().required(),
          jerseyNumber: Joi.number().required(),
          image: Joi.string().uri().required()
      });
  
      // Validate the request body against the schema
      const { error } = schema.validate(req.body);
      if (error) {
          return res.status(400).json({ message: error.details[0].message });
      }
  
      // Create a new player document using the request body data.
      // Make sure your client sends data in the correct format and consider adding validation logic here.
      const player = new Player({
        _id: new mongoose.Types.ObjectId(), // Generate a new unique identifier for this player
        name: req.body.name, // Player's name
        position: req.body.position, // Player's position
        jerseyNumber: req.body.jerseyNumber, // Player's jersey number
        image: req.body.image // URL or path to the player's image
      });
      try {
          await player.save();
          res.status(201).json(player);
      } catch (err) {
          res.status(400).json({ message: 'Failed to create player', error: err.message });
      }
  });
  
  // PATCH to update a player
  router.patch('/players/:id', async (req, res) => {
      try {
          const player = await Player.findById(req.params.id);
          if (!player) {
              return res.status(404).json({ message: 'Player not found' });
          }
          // Define a schema for input validation
          const schema = Joi.object({
              name: Joi.string(),
              position: Joi.string(),
              jerseyNumber: Joi.number(),
              image: Joi.string().uri()
          });
  
          // Validate the request body against the schema
          const { error } = schema.validate(req.body);
          if (error) {
              return res.status(400).json({ message: error.details[0].message });
          }
  
          // Update player fields if provided in the request body
          if (req.body.name) player.name = req.body.name;
          if (req.body.position) player.position = req.body.position;
          if (req.body.jerseyNumber) player.jerseyNumber = req.body.jerseyNumber;
          if (req.body.image) player.image = req.body.image;
          // Save the updated player
          const updatedPlayer = await player.save();
          res.json(updatedPlayer);
      } catch (err) {
          res.status(400).json({ message: 'Failed to update player', error: err.message });
      }
  });
  
  // DELETE a player
  router.delete('/players/:id', async (req, res) => {
      try {
          const player = await Player.findById(req.params.id);
          if (!player) {
              return res.status(404).json({ message: 'Player not found' });
          }
          // Remove the player from the database
          await player.remove();
          res.json({ message: 'Deleted player' });
      } catch (err) {
          res.status(500).json({ message: 'Internal server error', error: err.message });
      }
  });
  
  //#endregion
  
//#region Game Session Routes
// GET all game sessions - Lists all game sessions, necessary for game performance analysis
router.get('/game-sessions', async (req, res) => {
    try {
        const gameSessions = await GameSession.find();
        res.json(gameSessions);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a specific game session by ID
router.get('/game-sessions/:id', async (req, res) => {
    try {
        const gameSession = await GameSession.findById(req.params.id);
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        res.json(gameSession);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET game sessions by Date
router.get('/game-sessions/date/:date', async (req, res) => {
    try {
        const gameSessions = await GameSession.find({ date: req.params.date });
        res.json(gameSessions);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET game sessions by Date Range
router.get('/game-sessions/date-range/:startDate/:endDate', async (req, res) => {
    try {
        const startDate = new Date(req.params.startDate);
        const endDate = new Date(req.params.endDate);
        const gameSessions = await GameSession.find({ date: { $gte: startDate, $lte: endDate } });
        res.json(gameSessions);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempoIDs by Game Session ID
router.get('/game-sessions/:id/tempoIDs', async (req, res) => {
    try {
        const gameSession = await GameSession.findById(req.params.id);
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        res.json(gameSession.tempoIDs);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET shotIDs by Game Session ID
router.get('/game-sessions/:id/shotIDs', async (req, res) => {
    try {
        const gameSession = await GameSession.findById(req.params.id);
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        res.json(gameSession.shotIDs);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET game sessions by Opponent Team
router.get('/game-sessions/opponent/:opponentTeam', async (req, res) => {
    try {
        const gameSessions = await GameSession.find({ oppTeam: req.params.opponentTeam });
        res.json(gameSessions);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new game session - Allows adding a new game session
router.post('/game-sessions', async (req, res) => {
    const schema = Joi.object({
        oppTeam: Joi.string().required(),
        tempoIDs: Joi.array().items(Joi.string()),
        shotIDs: Joi.array().items(Joi.string())
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const gameSession = new GameSession({
        _id: new mongoose.Types.ObjectId(),
        oppTeam: req.body.oppTeam,
        tempoIDs: req.body.tempoIDs,
        shotIDs: req.body.shotIDs
    });

    try {
        const newGameSession = await gameSession.save();
        res.status(201).json(newGameSession);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create game session', error: err.message });
    }
});

// PATCH to update a game session
router.patch('/game-sessions/:id', async (req, res) => {
    try {
        const gameSession = await GameSession.findById(req.params.id);
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        
        if (req.body.oppTeam) gameSession.oppTeam = req.body.oppTeam;
        if (req.body.tempoIDs) gameSession.tempoIDs = req.body.tempoIDs;
        if (req.body.shotIDs) gameSession.shotIDs = req.body.shotIDs;

        const updatedGameSession = await gameSession.save();
        res.json(updatedGameSession);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update game session', error: err.message });
    }
});

// DELETE a game session
router.delete('/game-sessions/:id', async (req, res) => {
    try {
        const gameSession = await GameSession.findById(req.params.id);
        if (!gameSession) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        
        await gameSession.remove();
        res.json({ message: 'Deleted game session' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//#endregion

//#region Practice Session Routes
// GET all practice sessions - Lists all practice sessions
router.get('/practice-sessions', async (req, res) => {
    try {
        const practiceSessions = await PracticeSession.find();
        res.json(practiceSessions);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a specific practice session by ID
router.get('/practice-sessions/:id', async (req, res) => {
    try {
        const practiceSession = await PracticeSession.findById(req.params.id);
        if (!practiceSession) {
            return res.status(404).json({ message: 'Practice session not found' });
        }
        res.json(practiceSession);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new practice session - Allows adding a new practice session
router.post('/practice-sessions', async (req, res) => {
    // Define Joi schema for input validation
    const schema = Joi.object({
        drills: Joi.array().items(Joi.string())
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Create a new practice session document using the validated request body data
    const practiceSession = new PracticeSession({
        _id: new mongoose.Types.ObjectId(),
        drills: req.body.drills
    });

    try {
        const newPracticeSession = await practiceSession.save();
        res.status(201).json(newPracticeSession);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create practice session', error: err.message });
    }
});

// PATCH to update a practice session
router.patch('/practice-sessions/:id', async (req, res) => {
    try {
        const practiceSession = await PracticeSession.findById(req.params.id);
        if (!practiceSession) {
            return res.status(404).json({ message: 'Practice session not found' });
        }
        
        if (req.body.drills) practiceSession.drills = req.body.drills;

        const updatedPracticeSession = await practiceSession.save();
        res.json(updatedPracticeSession);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update practice session', error: err.message });
    }
});

// DELETE a practice session
router.delete('/practice-sessions/:id', async (req, res) => {
    try {
        const practiceSession = await PracticeSession.findById(req.params.id);
        if (!practiceSession) {
            return res.status(404).json({ message: 'Practice session not found' });
        }
        
        await practiceSession.remove();
        res.json({ message: 'Deleted practice session' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//#endregion

//#region Drill Session Routes
// GET all drill sessions - Lists all drill sessions
router.get('/drill-sessions', async (req, res) => {
    try {
        const drillSessions = await DrillSession.find();
        res.json(drillSessions);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a specific drill session by ID
router.get('/drill-sessions/:id', async (req, res) => {
    try {
        const drillSession = await DrillSession.findById(req.params.id);
        if (!drillSession) {
            return res.status(404).json({ message: 'Drill session not found' });
        }
        res.json(drillSession);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new drill session - Allows adding a new drill session
router.post('/drill-sessions', async (req, res) => {
    // Define Joi schema for input validation
    const schema = Joi.object({
        DrillName: Joi.string().required(),
        ShotIDs: Joi.array().items(Joi.string()),
        TempoIDs: Joi.array().items(Joi.string())
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Create a new drill session document using the validated request body data
    const drillSession = new DrillSession({
        _id: new mongoose.Types.ObjectId(),
        DrillName: req.body.DrillName,
        ShotIDs: req.body.ShotIDs,
        TempoIDs: req.body.TempoIDs
    });

    try {
        const newDrillSession = await drillSession.save();
        res.status(201).json(newDrillSession);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create drill session', error: err.message });
    }
});

// PATCH to update a drill session
router.patch('/drill-sessions/:id', async (req, res) => {
    try {
        const drillSession = await DrillSession.findById(req.params.id);
        if (!drillSession) {
            return res.status(404).json({ message: 'Drill session not found' });
        }
        
        if (req.body.DrillName) drillSession.DrillName = req.body.DrillName;
        if (req.body.ShotIDs) drillSession.ShotIDs = req.body.ShotIDs;
        if (req.body.TempoIDs) drillSession.TempoIDs = req.body.TempoIDs;

        const updatedDrillSession = await drillSession.save();
        res.json(updatedDrillSession);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update drill session', error: err.message });
    }
});

// DELETE a drill session
router.delete('/drill-sessions/:id', async (req, res) => {
    try {
        const drillSession = await DrillSession.findById(req.params.id);
        if (!drillSession) {
            return res.status(404).json({ message: 'Drill session not found' });
        }
        
        await drillSession.remove();
        res.json({ message: 'Deleted drill session' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//#endregion

//#region Tempo Routes
// GET all tempos - Lists all tempo sessions, necessary for performance analysis
router.get('/tempos', async (req, res) => {
    try {
        const tempos = await Tempo.find();
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a specific tempo by ID
router.get('/tempos/:id', async (req, res) => {
    try {
        const tempo = await Tempo.findById(req.params.id);
        if (!tempo) {
            return res.status(404).json({ message: 'Tempo not found' });
        }
        res.json(tempo);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempos by Date Range
router.get('/tempos/date-range/:startDate/:endDate', async (req, res) => {
    try {
        const startDate = new Date(req.params.startDate);
        const endDate = new Date(req.params.endDate);
        const tempos = await Tempo.find({ date: { $gte: startDate, $lte: endDate } });
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempos by Players on Court
router.get('/tempos/players-on-court/:playerId', async (req, res) => {
    try {
        const playerId = req.params.playerId;
        const tempos = await Tempo.find({ playersOnCourt: playerId });
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempos by Offensive Tempo Range
router.get('/tempos/offensive-tempo-range/:min/:max', async (req, res) => {
    try {
        const min = parseInt(req.params.min);
        const max = parseInt(req.params.max);
        const tempos = await Tempo.find({ offensiveTempo: { $gte: min, $lte: max } });
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempos by Defensive Tempo Range
router.get('/tempos/defensive-tempo-range/:min/:max', async (req, res) => {
    try {
        const min = parseInt(req.params.min);
        const max = parseInt(req.params.max);
        const tempos = await Tempo.find({ defensiveTempo: { $gte: min, $lte: max } });
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempos by Player
router.get('/tempos/by-player/:playerId', async (req, res) => {
    try {
        const playerId = req.params.playerId;
        const tempos = await Tempo.find({ playersOnCourt: playerId });
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new tempo session
router.post('/tempos', async (req, res) => {
    const schema = Joi.object({
        playersOnCourt: Joi.array().items(Joi.string()).required(),
        offensiveTempo: Joi.number().required(),
        defensiveTempo: Joi.number().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const tempo = new Tempo({
        _id: new mongoose.Types.ObjectId(),
        playersOnCourt: req.body.playersOnCourt,
        offensiveTempo: req.body.offensiveTempo,
        defensiveTempo: req.body.defensiveTempo
    });

    try {
        const newTempo = await tempo.save();
        res.status(201).json(newTempo);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create tempo session', error: err.message });
    }
});

// PATCH to update a tempo session
router.patch('/tempos/:id', async (req, res) => {
    try {
        const tempo = await Tempo.findById(req.params.id);
        if (!tempo) {
            return res.status(404).json({ message: 'Tempo not found' });
        }

        if (req.body.playersOnCourt) tempo.playersOnCourt = req.body.playersOnCourt;
        if (req.body.offensiveTempo) tempo.offensiveTempo = req.body.offensiveTempo;
        if (req.body.defensiveTempo) tempo.defensiveTempo = req.body.defensiveTempo;

        const updatedTempo = await tempo.save();
        res.json(updatedTempo);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update tempo session', error: err.message });
    }
});

// DELETE a tempo session
router.delete('/tempos/:id', async (req, res) => {
    try {
        const tempo = await Tempo.findById(req.params.id);
        if (!tempo) {
            return res.status(404).json({ message: 'Tempo not found' });
        }

        await tempo.remove();
        res.json({ message: 'Deleted tempo session' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//#endregion

//#region Shot Routes
// GET all shots - Lists all shots
router.get('/shots', async (req, res) => {
    try {
        const shots = await Shot.find();
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a specific shot by ID
router.get('/shots/:id', async (req, res) => {
    try {
        const shot = await Shot.findById(req.params.id);
        if (!shot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        res.json(shot);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET shots by Player ID
router.get('/shots/player/:playerID', async (req, res) => {
    try {
        const shots = await Shot.find({ playerID: req.params.playerID });
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new shot
router.post('/shots', async (req, res) => {
    const schema = Joi.object({
        playerID: Joi.string().required(),
        shotZone: Joi.number().required(),
        madeMissed: Joi.boolean().required(),
        shotClock: Joi.number().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const shot = new Shot({
        _id: new mongoose.Types.ObjectId(),
        playerID: req.body.playerID,
        shotZone: req.body.shotZone,
        madeMissed: req.body.madeMissed,
        shotClock: req.body.shotClock
    });

    try {
        const newShot = await shot.save();
        res.status(201).json(newShot);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create shot', error: err.message });
    }
});

// PATCH to update a shot
router.patch('/shots/:id', async (req, res) => {
    try {
        const shot = await Shot.findById(req.params.id);
        if (!shot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        
        if (req.body.playerID) shot.playerID = req.body.playerID;
        if (req.body.shotZone) shot.shotZone = req.body.shotZone;
        if (req.body.madeMissed) shot.madeMissed = req.body.madeMissed;
        if (req.body.shotClock) shot.shotClock = req.body.shotClock;

        const updatedShot = await shot.save();
        res.json(updatedShot);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update shot', error: err.message });
    }
});

// DELETE a shot
router.delete('/shots/:id', async (req, res) => {
    try {
        const shot = await Shot.findById(req.params.id);
        if (!shot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        
        await shot.remove();
        res.json({ message: 'Deleted shot' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//#endregion

module.exports = router;
