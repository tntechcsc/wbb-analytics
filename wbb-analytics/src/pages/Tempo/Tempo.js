import React, { useState } from 'react';
import './Tempo.css';
import CancelButton from './components/CancelButton';
import LastTempoDisplay from './components/LastTempoDisplay';
import PlayerList from './components/PlayerList';
import TempoTimer from './components/TempoTimer';
import TempoButton from './components/TempoButton'
import SubstitutionPopup from './components/SubstitutionPopup'

function TempoPage() {
    // State for timing control
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [recordedTempo, setRecordedTempo] = useState(null);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);

    // Players' state
    const [playersOnCourt, setPlayersOnCourt] = useState([
        { number: 1, name: "Player 1" },
        { number: 2, name: "Player 2" },
        { number: 3, name: "Player 3" },
        { number: 4, name: "Player 4" },
        { number: 5, name: "Player 5" }
    ]);
    const [allPlayers, setAllPlayers] = useState([
        { number: 1, name: "Player 1" },
        { number: 2, name: "Player 2" },
        { number: 3, name: "Player 3" },
        { number: 4, name: "Player 4" },
        { number: 5, name: "Player 5" },
        { number: 6, name: "Player 6" },
        { number: 7, name: "Player 7" },
        { number: 8, name: "Player 8" },
        { number: 9, name: "Player 9" },
        { number: 10, name: "Player 10" },
        { number: 11, name: "Player 11" },
        { number: 12, name: "Player 12" }
    ]);

    // State for substitution popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPlayerForSub, setSelectedPlayerForSub] = useState(null);

    // Start timing for tempo (offensive or defensive)
    const startTempo = (type) => {
        console.log(`Starting ${type} tempo`);
        if (recordedTempo) {
            setLastTempo(recordedTempo.toFixed(2));
        }
        setCurrentTempo(0);
        setResetTimer(true);
        setTempoType(type);
        setIsTiming(true);
    };

    // Stop the current tempo
    const handleStopTempo = () => {
        console.log(`Stopping ${tempoType} tempo`);
        setIsTiming(false);
        setRecordedTempo(currentTempo);
    };

    // Cancel the current timing
    const cancelTempo = () => {
        console.log('Cancelling tempo');
        setIsTiming(false);
        setCurrentTempo(0);
        setResetTimer(true);
        setTempoType(null);
    };

    // Handle player click for substitution
    const handlePlayerClick = (player) => {
        console.log(`Player ${player.number} clicked for substitution`);
        setSelectedPlayerForSub(player);
        setIsPopupOpen(true);
    };

    // Handle substitution with a new player
    const handleSubstitute = (newPlayer) => {
        console.log(`Substituting player ${selectedPlayerForSub.number} with ${newPlayer.number}`);
        setPlayersOnCourt(playersOnCourt.map(p =>
            p.number === selectedPlayerForSub.number ? newPlayer : p
        ));
        setIsPopupOpen(false);
    };

    return (
        <div className="TempoPage">
            <PlayerList players={playersOnCourt} onPlayerClick={handlePlayerClick} />
            {isPopupOpen && (
                <>
                    <div className="Overlay"></div>
                    <SubstitutionPopup
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        onSubstitute={handleSubstitute}
                        playersOnCourt={playersOnCourt}
                        allPlayers={allPlayers}
                    />
                </>
            )}
            <div className="TempoControls">
            <TempoButton
                    tempoType="Defensive"
                    className={`TempoButton ${isTiming && tempoType !== 'defensive' ? 'disabled' : ''} ${isTiming && tempoType === 'defensive' ? 'stop' : 'start'}`}
                    isTiming={isTiming && tempoType === 'defensive'}
                    onClick={() => {
                        if (isTiming && tempoType === 'defensive') {
                            handleStopTempo('defensive');
                        } else {
                            startTempo('defensive');
                        }
                    }}
                    disabled={isTiming && tempoType !== 'defensive'}
                />

                <div className="TimerAndLastTempo">
                    <TempoTimer
                        isTiming={isTiming}
                        resetTimer={resetTimer}
                        setResetTimer={setResetTimer}
                        currentTime={currentTempo}
                        setCurrentTime={setCurrentTempo}
                    />
                    <LastTempoDisplay lastTempo={lastTempo} />
                    <CancelButton
                        onCancel={cancelTempo}
                        className={!isTiming ? 'disabled' : ''}
                        disabled={!isTiming}
                    />
                </div>

                <TempoButton
                    tempoType="Offensive"
                    className={`TempoButton ${isTiming && tempoType === 'offensive' ? 'stop' : 'start'} ${isTiming && tempoType !== 'offensive' ? 'disabled' : ''}`}
                    isTiming={isTiming && tempoType === 'offensive'}
                    onClick={() => {
                        if (isTiming && tempoType === 'offensive') {
                            handleStopTempo('offensive');
                        } else {
                            startTempo('offensive');
                        }
                    }}
                    disabled={isTiming && tempoType !== 'offensive'}
                />
            </div>
        </div>
    );
}


export default TempoPage;
