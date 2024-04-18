import './Game.css';
import React, { useState, useEffect } from "react";
import TempoTimer from '../Drill/components/TempoTimer';
import TempoButton from '../Drill/components/TempoButton';
import LastTempoDisplay from '../Drill/components/LastTempoDisplay';
import CancelButton from '../Drill/components/CancelButton';
import ShotPopup from '../Drill/components/ShotPopup';
import PlayerSelectionPopup from './components/PlayerSelectionPopup';

const Game = () => {
    const [opponentTeamInput, setOpponentTeamInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [recordedTempo, setRecordedTempo] = useState(null);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);
    const [isOpponentTeamOverlayVisible, setIsOpponentTeamOverlayVisible] = useState(true);
    const [shotOutcome, setShotOutcome] = useState(null);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [tempoEvents, setTempoEvents] = useState([]);
    const [shotEvents, setShotEvents] = useState([]);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        setIsOpponentTeamOverlayVisible(false);
    }, []);

    const handleOpponentTeamSubmit = () => {
        setIsSubmitClicked(true);
        console.log('Opponent Team:', opponentTeamInput);
        console.log('Location:', locationInput);
    };
    
    const handleLocationClick = (location) => {
        setLocationInput(location);
    };

    const startTempo = (tempoType) => {
        setIsTiming(true);
        setTempoType(tempoType);
    };

    const stopTempo = () => {
        setIsTiming(false);
        setTempoType(null);
        setLastTempo(parseFloat(currentTempo.toFixed(2)));
        setTempoEvents((prevTempoEvents) => [...prevTempoEvents, parseFloat(currentTempo.toFixed(2))]);
        setCurrentTempo(0);
        setRecordedTempo(currentTempo);
    };

    const cancelTempo = () => {
        setIsTiming(false);
        setTempoType(null);
        setResetTimer(true);
    };

    const handleClockTimeSelection = (timeMapping) => {
        if (shotOutcome) {
            // submitShot(shotOutcome === 'made', timeMapping);
            console.log('Shot submitted:', shotOutcome, timeMapping);
            setShotOutcome(null);
            setShowPlayerSelection(true);
        }
    };

    const handlePlayerSelection = (selectedPlayerId) => {
        console.log('Selected player:', selectedPlayerId);
        setShowPlayerSelection(false);
    }
    
    const handleShotOutcome = (outcome) => {
        setShotOutcome(outcome);
    };

    /*
        after shot is posted, we get an obj id -> (shotData._id, probably), w that shot
        and append that shot to an array of shot_ids for shot_events

        submitGame will be posted w all the shot_ids in shotEvents and tempoEvents

        players need to be implemented still, they will be tied to the shot and if it was
        made or missed, this will be posted in submitShot
    */

    /*
    const submitShot = (isMade, shotClockTime) => {
        const shotData = {
            gameOrDrill_id: game_id,
            onModel: "Game",
            player_id: player_id,
            made: isMade === 'made',
            shot_clock_time: timeMapping,
            timestamp: new Date()
        };
        console.log('Submitting shot:', shotData);

        fetch( serverUrl + '/api/shots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shotData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Shot submitted:', data);
            resetAndClose(); // Close the popup after submission
        })
        .catch(error => console.error('Error submitting shot:', error));
    };
    */

    /*
    const submitGame = (shotClockTime) => {
        const currentDate = new Date();
        const date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        const gameData = {
            date: date,
            opponent: opponentTeamInput,
            location: locationInput,
            tempo_events: tempoEvents,
            shot_events: shotClockTime,
        };
        console.log('Submitting game data:', gameData);

        fetch(serverUrl + '/api/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Game data submitted:', data);
        })
        .catch(error => console.error('Error submitting shot:', error));
    };
    */

    return (
        <>
            {!isOpponentTeamOverlayVisible && !isSubmitClicked && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h3> Opponent Team Name </h3>
                        <input
                            id="opponent-team-input"
                            type="text"
                            value={opponentTeamInput}
                            onChange={(e) => setOpponentTeamInput(e.target.value)}
                        />                        
                        <h3> Location </h3>

                        <button
                            onClick={() => handleLocationClick('home')}
                            className={locationInput === 'home' ? '' : 'disabled'}
                            disabled={locationInput === 'home'}
                        >Home
                        </button>

                        <button
                            onClick={() => handleLocationClick('away')}
                            className={locationInput === 'away' ? '' : 'disabled'}
                            disabled={locationInput === 'away'}
                        >Away
                        </button>

                        <div className='submit-button'>
                            <button onClick={handleOpponentTeamSubmit}> Submit </button>
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

                <div className='last-tempo'>
                    <LastTempoDisplay lastTempo={lastTempo}/>
                </div>

                <div className="ShotPopup">
                    <ShotPopup
                        isOpen={isOpponentTeamOverlayVisible}
                        onClose={() => setIsOpponentTeamOverlayVisible(false)}
                    />

                    {/* Move cancel button out of shot popup if ui gets changed and its not
                        near the made / missed buttons if needed. The shot popup css is creating
                        a large border or something of such and made the cancel button unclickable,
                        unfortunately I cannot figure out the exact code that is doing this, so temp sol. */}
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

            </div>
        </>
    );
}

export default Game;
