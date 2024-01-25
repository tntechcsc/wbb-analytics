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

    return (
        <div className="TempoPage">
            <PlayerList />
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

export default TempoPage;
