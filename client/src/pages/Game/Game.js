import './Game.css';
import React, { useState, useEffect } from "react";
import TempoTimer from '../Drill/components/TempoTimer';
import TempoButton from '../Drill/components/TempoButton';
import LastTempoDisplay from '../Drill/components/LastTempoDisplay';
import CancelButton from '../Drill/components/CancelButton';

const Game = () => {
    const [opponentTeamInput, setOpponentTeamInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [recordedTempo, setRecordedTempo] = useState(null);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);
    const [isOpponentTeamInputVisible, setIsOpponentTeamInputVisible] = useState(true);
    const [isOpponentTeamOverlayVisible, setIsOpponentTeamOverlayVisible] = useState(true);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

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

    // Focus on the input when the overlay is visible
    useEffect(() => {
        if (isOpponentTeamOverlayVisible) {
            document.getElementById("opponent-team-input").focus();
        }
    }, [isOpponentTeamOverlayVisible]);


    const handleOpponentTeamSubmit = () => {
        setIsOpponentTeamInputVisible(false); // Hide the opponent team input
        setIsOpponentTeamOverlayVisible(false); // Hide the overlay

        console.log('Opponent Team:', opponentTeamInput);
        console.log('Location:', locationInput);
    };

    const handleLocationClick = (location) => {
        setLocationInput(location);
    };

    const currentDate = new Date();
    const newDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    return (
        <>
            <div className="main">
                <h1> Game Tempo </h1>
                
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

            </div>

            {isOpponentTeamOverlayVisible && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h3> Opponent Team Name </h3>
                        <input id="opponent-team-input" type="text" value={opponentTeamInput} onChange={(e) => setOpponentTeamInput(e.target.value)} />
                        
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
        </>
    );
}

export default Game;
