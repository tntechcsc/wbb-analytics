import './Game.css';
import React, { useState, useEffect } from "react";
import TempoTimer from '../Drill/components/TempoTimer';
import TempoButton from '../Drill/components/TempoButton';
import LastTempoDisplay from '../Drill/components/LastTempoDisplay';
import CancelButton from '../Drill/components/CancelButton';
import ShotPopup from '../Drill/components/ShotPopup';
import PlayerSelectionPopup from './components/PlayerSelectionPopup';
import GameSelection from './components/GameSelection';

const Game = () => {
    const [opponentTeam, setOpponentTeam] = useState('');
    const [opponentTeamValue, setOpponentTeamValue] = useState('');
    const [location, setLocation] = useState('');
    const [tempLocation, setTempLocation] = useState('');
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);
    const [newGameOverlay, setNewGameOverlay] = useState(false);
    const [isGameModeOverlayVisible, setIsGameModeOverlayVisible] = useState(true);
    const [loadGameOverlayVisible, setLoadGameOverlayVisible] = useState(false);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [tempoEvents, setTempoEvents] = useState([]);
    const [shotEvents, setShotEvents] = useState([]);
    const [shotOutcome, setShotOutcome] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedClockTime, setSelectedClockTime] = useState(null);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);
    const [SeasonData, setSeasonData] = useState([]);
    const [gameData, setGameData] = useState('');
    const [tempoEventIds, setTempoEventIds] = useState([]);
    const [tempoFlag, setTempoFlag] = useState(false);
    const [gameMode, setGameMode] = useState('');
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    // Sets an overlay for the input, can't interact outside until submission
    useEffect(() => {
        if (gameMode === 'new' && location !== '' && opponentTeam !== '' && isSubmitClicked === false) {
            createGame();
            setNewGameOverlay(false); // Close the overlay here after creating the game
        }
    }, [opponentTeam, location, gameMode, isSubmitClicked]);
    

    // Tempo requires an array, so set the player to an array and reset
    // the array afterwards, we only want 1 person per tempo, 1 element array
    useEffect(() => {
        if (tempoFlag) {
            const latestTempo = tempoEvents[tempoEvents.length - 1]; 
            submitTempo(tempoType, parseFloat(latestTempo.toFixed(2)));
            setTempoFlag(false);
        }
    }, [tempoFlag, tempoEvents, tempoType]);
    
    // Get the list of seasons 
    useEffect(() => {
        const handleCreateGame = async () => {
            try {
                if (SeasonData.length === 0) {
                    const response = await fetch(serverUrl + '/api/seasons');
                    const data = await response.json();
                    setSeasonData(data);
                }
            } catch (error) {
                console.error('Error fetching season data line 62:', error);
            }
        };
        handleCreateGame();
    }, [opponentTeam, location, SeasonData]);

    // Creates a new game if conditions are met
    useEffect(() => {
        if (gameMode === 'new' && location !== '' && opponentTeam !== '') {
            createGame();
        }
    }, [opponentTeam, location, gameMode]);
    
    // Submits the shot if conditions are met
    useEffect(() => {
        if (selectedPlayer !== null && shotOutcome !== null && selectedClockTime !== null) {
            submitShot(shotOutcome, selectedClockTime);
            setSelectedPlayer(null);
            setShotOutcome(null);
            setSelectedClockTime(null);
        }
    }, [selectedPlayer, shotOutcome, selectedClockTime]);

    // Initialize an empty game at first to generate gameID, as user adds tempos
    // and shots, it will add them when the game is submitted at the end
    const createGame = async () => {
        const seasonDate = getSeasonByDate();
        const game = {
            season_id: seasonDate._id,
            date: date,
            opponent: opponentTeam,
            location: location,
        };
    
        try {
            const response = await fetch(`${serverUrl}/api/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(game)
            });
    
            if (!response.ok) {
                throw new Error('Failed to create game. Please try again.');
            }
    
            const data = await response.json();
            setGameData(data._id);
        } catch (error) {
            console.error('Error with game data:', error.message);
        }
    };
    
   // Gets the season based on the current date, 2023-2024, 2024-2025, etc.
    const getSeasonByDate = () => {
        let finalYear;
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        const year1 = year.toString();
        const year2 = ((month < 8 || (month === 8 && day < 2)) ? year - 1 : year + 1).toString();
        
        if (month >= 8) {
            finalYear = SeasonData.find(season => season.year === year1 + '-' + year2);

        } else {
            finalYear = SeasonData.find(season => season.year === year2 + '-' + year1);
        }   
        
        return finalYear;
    };
    
    const handleShotOutcome = (outcome) => {
        setShotOutcome(outcome);
    };

    const handleLocationClick = (location) => {
        setTempLocation(location);
    };
    
    const startTempo = (tempoType) => {
        setIsTiming(true);
        setTempoType(tempoType);
    };

    const handleClockTimeSelection = (timeMapping) => {
        setSelectedClockTime(timeMapping);
        setShowPlayerSelection(true);
    };
    
    const handlePlayerSelection = (selectedPlayerId) => {
        setSelectedPlayer(selectedPlayerId);
        setShowPlayerSelection(false);
    }; 

    const cancelTempo = () => {
        setIsTiming(false);
        setTempoType(null);
        setResetTimer(true);
    };
    
    const stopTempo = () => {
        setIsTiming(false);
        setLastTempo(parseFloat(currentTempo.toFixed(2)));
        setTempoEvents((prevTempoEvents) => [...prevTempoEvents, parseFloat(currentTempo.toFixed(2))]);
        setCurrentTempo(0);
        setTempoFlag(true);
    };
    
    // Makes sure that user input is valid before moving on
    const handleInputSubmission = () => {
        if (opponentTeamValue !== '' && tempLocation !== '') {
            setOpponentTeam(opponentTeamValue);
            setLocation(tempLocation);
            setIsSubmitClicked(true);
            setNewGameOverlay(false);
            
        } else {
            alert('Please enter both opponent name and location.');
        }
    };
    
    // If user loads in exisiting game, we load in all the data
    // so that we can add to it as they record more data
    const handleSelectGame = async (game) => {
        try {
            const response = await fetch(`${serverUrl}/api/games/${game._id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch game details');
            }

            const gameDetails = await response.json();
            setGameData(gameDetails._id);
            setOpponentTeam(gameDetails.opponent);
            setLocation(gameDetails.location);
            setTempoEventIds(gameDetails.tempo_events || []);
            setShotEvents(gameDetails.shot_events || []);
            setLoadGameOverlayVisible(false);

        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };
    
    const submitShot = (shotOutcome, shotClockTime) => {
        const shotData = {
            gameOrDrill_id: gameData,
            onModel: "Game",
            player_id: selectedPlayer,
            made: shotOutcome === 'made',
            shot_clock_time: shotClockTime,
            timestamp: new Date().toLocaleString()
        };

        fetch(serverUrl + '/api/shots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shotData)
        })

        .then(response => response.json())

        .then(data => {
            if (data !== null) {
                setShotEvents(prevShotEvents => [...prevShotEvents, data._id]);
            }
        })

        .catch(error => console.error('Error submitting shot line 218:', error));

    };
    
    const submitTempo = (tempoType, lastTempo) => {
        const tempoData = {
            gameOrDrill_id: gameData,
            onModel: "Game",
            tempo_type: tempoType,
            transition_time: lastTempo,
            timestamp: new Date().toLocaleString()
        };
    
        fetch(serverUrl + '/api/tempos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempoData)
        })
        .then(response => response.json())
        .then(data => {
            setTempoEventIds(prevIds => [...(prevIds || []), data._id]);
        })
        .catch(error => console.error('Error submitting tempo:', error));
    };
    
    const submitGame = () => {
        const seasonDateId = getSeasonByDate();

        const gameDataUpdated = {
            season_id: seasonDateId._id,
            date: date,
            opponent: opponentTeam,
            location: location,
            tempo_events: tempoEventIds,
            shot_events: shotEvents,
        };

        fetch(`${serverUrl}/api/games/${gameData}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameDataUpdated)
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok line 267');
            }
            return response.json();
        })

        .then(data => {
            alert("Game Submission Successful.");
        })

        .catch(error => {
            console.error('Error updating game line 277:', error);
        });
    };
    
    return (
        <>
            {isGameModeOverlayVisible && (
                <div className="game-mode-overlay">
                    <div className="game-mode-content">
                        <div className='game-selection'>
                            <h2>Select Game Mode</h2>
                            <button onClick={() => { setGameMode('new'); setIsGameModeOverlayVisible(false); setNewGameOverlay(true); }}>Create New Game</button>
                            <button onClick={() => { setGameMode('load'); setIsGameModeOverlayVisible(false); setLoadGameOverlayVisible(true); }}>Load Existing Game</button>
                        </div>
                    </div>
                </div>
            )}


            {newGameOverlay && gameMode === 'new' && (
                <div className="new-game-overlay">
                    <div className="new-game-overlay-content">
                        <h3>Opponent Team Name</h3>
                        <input
                            id="opponent-team-input"
                            type="text"
                            value={opponentTeamValue}
                            onChange={(e) => setOpponentTeamValue(e.target.value)}
                        />

                        <h3>Location</h3>
                        <button onClick={() => handleLocationClick('home')} className={tempLocation === 'home' ? '' : 'disabled'} disabled={tempLocation === 'home'}>Home</button>
                        <button onClick={() => handleLocationClick('away')} className={tempLocation === 'away' ? '' : 'disabled'} disabled={tempLocation === 'away'}>Away</button>

                        <div className='submit-button'>
                            <button onClick={handleInputSubmission}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {loadGameOverlayVisible && gameMode === 'load' && (
                <div className="load-game-overlay">
                    <div className="load-game-overlay-content">
                        <GameSelection className="game-selection" onSelectGame={handleSelectGame}/>
                    </div>
                </div>
            )}

            <div className="main">
                <h1> TN Tech vs {opponentTeam} </h1>
                
                <div className='tempo-timer'>
                    <TempoTimer 
                        isTiming={isTiming}
                        resetTimer={resetTimer}
                        setResetTimer={setResetTimer}
                        currentTime={currentTempo}
                        setCurrentTime={setCurrentTempo}
                    />
                </div>

                <div className='defensive-tempo-button'>
                    <TempoButton 
                        tempoType="Defensive"
                        className={`TempoButton ${isTiming && tempoType !== 'defensive' ? 'disabled' : ''} ${isTiming && tempoType === 'defensive' ? 'stop' : 'start'}`}
                        isTiming={isTiming && tempoType === 'defensive'}
                        onClick={() => isTiming && tempoType === 'defensive' ? stopTempo('defensive') : startTempo('defensive')}
                        disabled={isTiming && tempoType !== 'defensive'}
                    />
                </div>
                
                <div className='offensive-tempo-button'>
                    <TempoButton 
                        tempoType="Offensive"
                        className={`TempoButton ${isTiming && tempoType !== 'offensive' ? 'disabled' : ''} ${isTiming && tempoType === 'offensive' ? 'stop' : 'start'}`}
                        isTiming={isTiming && tempoType === 'offensive'}
                        onClick={() => isTiming && tempoType === 'offensive' ? stopTempo('offensive') : startTempo('offensive')}
                        disabled={isTiming && tempoType !== 'offensive'}
                    />
                </div>

                <div className="display-container">
                    <div className="last-tempo">
                        <LastTempoDisplay lastTempo={lastTempo}/>
                    </div>
                    <div className="cancel-button">
                        <CancelButton onCancel={cancelTempo} />
                    </div>
                </div>


                <div className="ShotPopup">
                    <ShotPopup
                        isOpen={newGameOverlay}
                        onClose={() => setNewGameOverlay(true)}
                    />


                    <div className="ShotOutcomeSelection">
                        {!shotOutcome ? (
                            <>
                                <div className="MadeButton" onClick={() => handleShotOutcome('made')}>Made</div>
                                <div className="MissedButton" onClick={() => handleShotOutcome('missed')}>Missed</div>
                            </>
                        ) : (
                            <div className="ClockTimeSelection">
                                <div className="ClockButton1" onClick={() => handleClockTimeSelection('first_third')}>1-10</div>
                                <div className="ClockButton2" onClick={() => handleClockTimeSelection('second_third')}>11-20</div>
                                <div className="ClockButton3" onClick={() => handleClockTimeSelection('final_third')}>21-30</div>
                            </div>
                        )}
                    </div>
                </div>

                {showPlayerSelection && (
                    <PlayerSelectionPopup
                        onPlayerSelect={handlePlayerSelection}
                    />
                )}

                <button className="submit-game-button" onClick={submitGame}> Submit Game </button>
            </div>
        </>
    );
}

export default Game;
