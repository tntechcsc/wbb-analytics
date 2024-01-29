import React, { useState } from 'react';
import './Tempo.css';
import CancelButton from './components/CancelButton';
import LastTempoDisplay from './components/LastTempoDisplay';
import PlayerList from './components/PlayerList';
import TempoTimer from './components/TempoTimer';

function TempoPage() {
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [recordedTempo, setRecordedTempo] = useState(null);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);
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
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPlayerForSub, setSelectedPlayerForSub] = useState(null);

    const startTempo = (type) => {
        if (recordedTempo) {
            setLastTempo(recordedTempo.toFixed(2));
        }
        setCurrentTempo(0);
        setResetTimer(true);
        setTempoType(type);
        setIsTiming(true);
    };

    const handleStopTempo = () => {
        setIsTiming(false);
        setRecordedTempo(currentTempo);
    };

    const cancelTempo = () => {
        setIsTiming(false);
        setCurrentTempo(0);
        setResetTimer(true);
        setTempoType(null);
    };

    const handlePlayerClick = (player) => {
        setSelectedPlayerForSub(player);
        setIsPopupOpen(true);
    };

    const handleSubstitute = (newPlayer) => {
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
                <button
                    className={`TempoButton ${isTiming && tempoType === 'defensive' ? 'stop' : 'start'} ${isTiming && tempoType !== 'defensive' ? 'disabled' : ''}`}
                    onClick={() => {
                        if (isTiming && tempoType === 'defensive') {
                            handleStopTempo('defensive');
                        } else {
                            startTempo('defensive');
                        }
                    }}
                    disabled={isTiming && tempoType !== 'defensive'}
                >
                    {isTiming && tempoType === 'defensive' ? 'Stop Defensive Tempo' : 'Start Defensive Tempo'}
                </button>

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

                <button
                    className={`TempoButton ${isTiming && tempoType === 'offensive' ? 'stop' : 'start'} ${isTiming && tempoType !== 'offensive' ? 'disabled' : ''}`}
                    onClick={() => {
                        if (isTiming && tempoType === 'offensive') {
                            handleStopTempo('offensive');
                        } else {
                            startTempo('offensive');
                        }
                    }}
                    disabled={isTiming && tempoType !== 'offensive'}
                >
                    {isTiming && tempoType === 'offensive' ? 'Stop Offensive Tempo' : 'Start Offensive Tempo'}
                </button>
            </div>
        </div>
    );
}

function SubstitutionPopup({ isOpen, onClose, onSubstitute, playersOnCourt, allPlayers }) {
    const playersNotOnCourt = allPlayers.filter(p =>
        !playersOnCourt.some(onCourt => onCourt.number === p.number)
    );

    return (
        <div className="Popup">
            {playersNotOnCourt.map(player => (
                <div key={player.number} className="PopupPlayerContainer" onClick={() => onSubstitute(player)}>
                    <div className="PopupPlayerCircle">{player.number}</div>
                    <div className="PopupPlayerName">{player.name}</div>
                </div>
            ))}
            <div className="PopupCloseButtonContainer">
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default TempoPage;
