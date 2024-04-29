import './Game.css';
import React, { useState, useEffect } from "react";
import TempoTimer from '../Drill/components/TempoTimer';
import TempoButton from '../Drill/components/TempoButton';
import LastTempoDisplay from '../Drill/components/LastTempoDisplay';
import CancelButton from '../Drill/components/CancelButton';
import ShotPopup from '../Drill/components/ShotPopup';
import PlayerSelectionPopup from './components/PlayerSelectionPopup';

/*
    work on compartamentalizing this code, there is too much
    in this file, surely it can be split.
*/

const Game = () => {
    const [opponentTeamInput, setOpponentTeamInput] = useState('');
    const [opponentTeamInputValue, setOpponentTeamInputValue] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [tempLocationInput, setTempLocationInput] = useState('');
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);
    const [isOpponentTeamOverlayVisible, setIsOpponentTeamOverlayVisible] = useState(true);
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
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    // Sets an overlay for the input, can't interact outside until submission
    useEffect(() => {
        setIsOpponentTeamOverlayVisible(false);
    }, []);

    // Tempo requires an array, so set the player to an array and reset
    // the array afterwards, we only want 1 person per tempo, 1 element array
    useEffect(() => {
        if (tempoFlag) {
            const latestTempo = tempoEvents[tempoEvents.length - 1]; 
            submitTempo(tempoType, parseFloat(latestTempo.toFixed(2)));
            setTempoFlag(false);
        }
    }, [tempoFlag, tempoEvents, tempoType]);
    
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
    }, [opponentTeamInput, locationInput]);
    
    useEffect(() => {
        if (selectedPlayer !== null && shotOutcome !== null && selectedClockTime !== null) {
            submitShot(shotOutcome, selectedClockTime);
            setSelectedPlayer(null);
            setShotOutcome(null);
            setSelectedClockTime(null);
        }
    }, [selectedPlayer, shotOutcome, selectedClockTime]);

    // Initialize an empty game so that we can have gameId for shots and tempos
    useEffect(() => {
        const createGame = async () => {
        if (locationInput !== '' && opponentTeamInput !== '') {
            const seasonDate = getSeasonByDate();

            const game = {
                season_id: seasonDate._id,
                date: date,
                opponent: opponentTeamInput,
                location: locationInput,
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
                console.error('Error with game data, line 105:', error.message);
            }
        }
    };
    
    createGame();
    }, [opponentTeamInput, locationInput, date, serverUrl]);

    
    
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

    const handleOpponentTeamInputChange = (e) => {
        setOpponentTeamInputValue(e.target.value);
    };
    
    const handleShotOutcome = (outcome) => {
        setShotOutcome(outcome);
    };

    const handleLocationClick = (location) => {
        setTempLocationInput(location);
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
    
    const handleInputSubmission = () => {
        setOpponentTeamInput(opponentTeamInputValue);
        setLocationInput(tempLocationInput);

        if (opponentTeamInputValue !== '' && tempLocationInput !== '') {
            setIsSubmitClicked(true);
            
        } else {
            alert('Please enter both opponent name and location.');
        }
    };
    
    /* 
        Some reason the timestamp in shot and tempo has an incorrect date, no matter
        what I do, even by specific time zone, it is incorrect. Game date is perfectly
        fine, even getSeasonByDate() returns perfectly fine, but the timestamp not.
    */
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
            setTempoEventIds(prevIds => [...prevIds, data._id]);
        })

        .catch(error => console.error('Error submitting tempo line 243:', error));
    };
    
    const submitGame = () => {
        const seasonDateId = getSeasonByDate();

        const gameDataUpdated = {
            season_id: seasonDateId._id,
            date: date,
            opponent: opponentTeamInput,
            location: locationInput,
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

        .catch(error => {
            console.error('Error updating game line 277:', error);
        });
    };
    

    return (
        <>
            {!isOpponentTeamOverlayVisible && !isSubmitClicked && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h3> Opponent Team Name </h3>
                        <input
                            id="opponent-team-input"
                            type="text"
                            value={opponentTeamInputValue}
                            onChange={(e) => setOpponentTeamInput(handleOpponentTeamInputChange(e))}
                        />                        
                        <h3> Location </h3>

                        <button
                            onClick={() => handleLocationClick('home')}
                            className={tempLocationInput === 'home' ? '' : 'disabled'}
                            disabled={tempLocationInput === 'home'}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => handleLocationClick('away')}
                            className={tempLocationInput === 'away' ? '' : 'disabled'}
                            disabled={tempLocationInput === 'away'}
                        >
                            Away
                        </button>

                        <div className='submit-button'>
                            <button onClick={handleInputSubmission}> Submit </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="main">
                <h1> Game Mode </h1>
                
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
                        tempoType="defensive"
                        className={`TempoButton ${isTiming && tempoType !== 'defensive' ? 'disabled' : ''} ${isTiming && tempoType === 'defensive' ? 'stop' : 'start'}`}
                        isTiming={isTiming && tempoType === 'defensive'}
                        onClick={() => isTiming && tempoType === 'defensive' ? stopTempo('defensive') : startTempo('defensive')}
                        disabled={isTiming && tempoType !== 'defensive'}
                    />
                </div>
                
                <div className='offensive-tempo-button'>
                    <TempoButton 
                        tempoType="offensive"
                        className={`TempoButton ${isTiming && tempoType !== 'offensive' ? 'disabled' : ''} ${isTiming && tempoType === 'offensive' ? 'stop' : 'start'}`}
                        isTiming={isTiming && tempoType === 'offensive'}
                        onClick={() => isTiming && tempoType === 'offensive' ? stopTempo('offensive') : startTempo('offensive')}
                        disabled={isTiming && tempoType !== 'offensive'}
                    />
                </div>

                <div className='last-tempo'>
                    <LastTempoDisplay lastTempo={lastTempo}/>
                </div>

                <div className="ShotPopup">
                    <ShotPopup
                        isOpen={isOpponentTeamOverlayVisible}
                        onClose={() => setIsOpponentTeamOverlayVisible(false)}
                    />

                    <div className='cancel-button'>
                        <CancelButton onCancel={cancelTempo} />
                    </div>

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
