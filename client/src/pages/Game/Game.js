import './Game.css';
import React, { useState, useEffect } from "react";
import TempoTimer from '../Drill/components/TempoTimer';
import TempoButton from '../Drill/components/TempoButton';
import LastTempoDisplay from '../Drill/components/LastTempoDisplay';
import CancelButton from '../Drill/components/CancelButton';
import ShotPopup from '../Drill/components/ShotPopup';

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

    const stopTempo = (tempoType) => {
        setIsTiming(false);
        setTempoType(null);
        setRecordedTempo(currentTempo);
        setLastTempo(currentTempo);
        setLastTempo(parseFloat(currentTempo.toFixed(2))); // Update the last tempo display with 2 decimal places
        setCurrentTempo(0);
    };

    const cancelTempo = () => {
        setIsTiming(false);
        setTempoType(null);
        setResetTimer(true);
    };

    const handleClockTimeSelection = (timeMapping) => {
        if (shotOutcome) {
            submitGame(shotOutcome === 'made', timeMapping);
            console.log('Shot submitted:', shotOutcome, timeMapping);
            setShotOutcome(null); // Reset shot outcome
        }
    };
    
    const handleShotOutcome = (outcome) => {
        setShotOutcome(outcome);
    };

    /*
        post a shot with:
        gameOrDrill_id: game_id
        onModel: "Game"
        player_ids: id of player who took the shot
        made: true / false
        shot_clock_time: selected shot clock time
        timestamp: time player took shot

        after shot is posted, we get an obj id -> (data._id probably), w that shot
        and append that shot to an array of shot_ids for shot_events

        post to game with:
        date: date
        opponent: opponent team name
        location: selected location
        tempo_events: all recorded tempos
        shot_events: all recorded shot_ids

        submitGame is a partial mock submission to bypass errors for now, it will be updated 
        later with the above information as everything is added and ready

        shots need to be tied to a player so players still need to be implemented in this page,
        also change tempo_events to be an array of all tempos taken, add tempo to array each time
    */

    const submitGame = (shotClockTime) => {
        const currentDate = new Date();
        const date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        const gameData = {
            date: date,
            opponent: opponentTeamInput,
            location: locationInput,
            tempo_events: recordedTempo,
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

                <div className='cancel-button'>
                    <CancelButton onCancel={cancelTempo} />
                </div>

                <div className="ShotPopup">
                    <ShotPopup
                        isOpen={isOpponentTeamOverlayVisible}
                        onClose={() => setIsOpponentTeamOverlayVisible(false)}
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

            </div>
        </>
    );
}

export default Game;
