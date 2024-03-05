import React, { useState, useEffect } from 'react';
import './Tempo.css';
import CancelButton from './components/CancelButton';
import LastTempoDisplay from './components/LastTempoDisplay';
import PlayerList from './components/PlayerList';
import TempoTimer from './components/TempoTimer';
import TempoButton from './components/TempoButton'
import SubstitutionPopup from './components/SubstitutionPopup'
import Court from './components/Court'

function TempoPage() {
    // Define the base URL for your API
    // const BASE_URL = 'http://localhost:3001';
    const BASE_URL = 'http://10.105.194.195:3001';

    // State for timing control
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [recordedTempo, setRecordedTempo] = useState(null);
    const [lastTempo, setLastTempo] = useState(null);
    const [tempoType, setTempoType] = useState(null);

    const [playersOnCourt, setPlayersOnCourt] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/players`)
            .then(response => response.json())
            .then(data => {
                const playersData = data.map(player => ({
                    id: player._id,
                    name: player.name,
                    number: player.jersey_number
                }));
                setAllPlayers(playersData);
                // Set players on court based on your logic, e.g., first five players
                setPlayersOnCourt(playersData.slice(0, 5));
            })
            .catch(error => console.error('Failed to fetch players:', error));
    }, []);

    // Function to submit tempo
    const submitTempo = (isOffensive, playersOnCourtIds, timeValue) => {
        const tempoData = {
            player_ids: playersOnCourtIds,
            onModel: 'Practice',
            tempo_type: isOffensive,
            transition_time: timeValue,
            timestamp: new Date()
        };

        fetch(`${BASE_URL}/api/tempos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempoData)
        })
            .then(response => response.json())
            .then(data => console.log('Tempo submitted:', data))
            .catch(error => console.error('Error submitting tempo:', error));
    };

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
    const handleStopTempo = (type) => {
        console.log(`Stopping ${tempoType} tempo`);
        setIsTiming(false);
        setRecordedTempo(currentTempo);

        // Determine if tempo is offensive or defensive
        const isOffensive = type;

        // Get the IDs of the players on the court
        const playersOnCourtIds = playersOnCourt.map(player => player.id);

        // Call submitTempo with the correct arguments
        submitTempo(isOffensive, playersOnCourtIds, currentTempo);
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

    const handleOverlayClick = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="TempoPage">
            <div className="TopContainer">
                <div className="PlayerListContainer">
                    <PlayerList players={playersOnCourt} onPlayerClick={handlePlayerClick} />
                    {isPopupOpen && (
                        <>
                            <div className="Overlay" onClick={handleOverlayClick}></div>
                            <SubstitutionPopup
                                isOpen={isPopupOpen}
                                onClose={() => setIsPopupOpen(false)}
                                onSubstitute={handleSubstitute}
                                playersOnCourt={playersOnCourt}
                                allPlayers={allPlayers}
                            />
                        </>
                    )}
                </div>
                <div className="RightComponent">
                    <div className="GreyBox">
                        <Court/>
                    </div>
                    
                </div>
            </div>
            <div className="BottomContainer">
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
        </div>
    );
}

export default TempoPage;
