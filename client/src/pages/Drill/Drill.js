import React, { useState, useEffect } from 'react';
import './Drill.css';
import CancelButton from './components/CancelButton';
import LastTempoDisplay from './components/LastTempoDisplay';
import PlayerList from './components/PlayerList';
import TempoTimer from './components/TempoTimer';
import TempoButton from './components/TempoButton';
import SubstitutionPopup from './components/SubstitutionPopup';
import ShotPopup from './components/ShotPopup';
import ImageMapper from "react-img-mapper";
import basketballCourtVector from './components/basketball-court-vector.jpg';
import ExtraStats from './components/ExtraStats';
import AvgTempoDisplay from './components/AvgTempo';

function DrillPage() {
    // State hooks for timing and tempo tracking
    const [isTiming, setIsTiming] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [currentTempo, setCurrentTempo] = useState(0);
    const [recordedTempo, setRecordedTempo] = useState(null);
    const [lastTempo, setLastTempo] = useState(0);
    const [tempoType, setTempoType] = useState(null);
    const [avgTempo, setAvgTempo] = useState(0);
    const [tempoCount, setTempoCount] = useState(1);
    const [totalTempo, setTotalTempo] = useState(0);

    // State hooks for player and popup management
    const [playersOnCourt, setPlayersOnCourt] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [isSub, setIsSub] = useState(false);
    const [isPlayerSelectedforShot, setIsPlayerSelectedforShot] = useState(false);
    const [player, setPlayer] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPlayerForSub, setSelectedPlayerForSub] = useState(null);
    const [isShotPopupOpen, setIsShotPopupOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);

    // Server URL from environment variables for API requests
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    // Extracting practice and drill IDs from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const drillID = urlParams.get('DrillID');


    // Fetch players from the server on component mount
    useEffect(() => {

        fetch(serverUrl + '/api/players')
            .then(response => response.json())
            .then(data => {
                const playersData = data.map(player => ({
                    id: player._id,
                    name: player.name,
                    number: player.jersey_number
                }));
                setAllPlayers(playersData);
                setPlayersOnCourt(playersData.slice(0, 5)); // Example: Set the first five players as on court
            })
            .catch(error => console.error('Failed to fetch players:', error));
    }, [serverUrl]);

    // Function to submit tempo
    const submitTempo = (isOffensive, playersOnCourtIds, timeValue) => {

        const tempoData = {
            gameOrDrill_id: drillID,
            player_ids: playersOnCourtIds,
            onModel: 'Drill',
            tempo_type: isOffensive,
            transition_time: timeValue.toFixed(2),
            timestamp: new Date()
        };

        fetch(serverUrl + '/api/tempos', {
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

    // Start timing for tempo (offensive or defensive)
    const startTempo = (type) => {
        console.log(`Starting ${type} tempo`);
        if (recordedTempo) {
            setLastTempo(recordedTempo.toFixed(2));
            setTempoCount(tempoCount + 1);
            setTotalTempo(totalTempo + recordedTempo);
            setAvgTempo(((recordedTempo + totalTempo)/tempoCount).toFixed(2));
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

    // Handle substitution with a new player
    const handleSubstitute = (newPlayer) => {
        console.log(`Substituting player ${selectedPlayerForSub.number} with ${newPlayer.number}`);
        setPlayersOnCourt(playersOnCourt.map(p =>
            p.number === selectedPlayerForSub.number ? newPlayer : p
        ));
        setIsPopupOpen(false);
        setIsSub(false);
        setIsPlayerSelectedforShot(false);
    };

    const handleOverlayClick = () => {
        setIsPopupOpen(false);
        setIsSub(false);
        setIsPlayerSelectedforShot(false);
    };

    let MAP2 = {
        name: "my-map",
        areas: [
            { name: "3", shape: "poly", coords: [49, 3, 58, 79, 210, 79, 210, 3], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "green" },
            { name: "2", shape: "poly", coords: [385, 3, 385, 83, 540, 83, 548, 3], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "green" },
            { name: "1", shape: "poly", coords: [215, 3, 215, 230, 380, 230, 380, 3], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "purple" },
            { name: "5", shape: "poly", coords: [56, 83, 210, 83, 210, 235, 300, 235, 300, 316, 245, 312, 239, 310, 220, 305, 176, 285, 140, 260, 115, 235, 100, 210, 85, 185, 75, 160, 65, 120], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "red" },
            { name: "4", shape: "poly", coords: [60, 83, 215, 83, 215, 235, 300, 235, 300, 316, 240, 310, 238, 310, 218, 302, 173, 280, 149, 264, 129, 238, 100, 196, 85, 170, 75, 145].map((n, i, arr) => (i % 2 === 0 ? 600 - n : n)), fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "red" },
            { name: "8", shape: "poly", coords: [160, 280, 0, 550, 600, 550, 445, 275, 410, 295, 360, 315, 300, 320, 245, 315, 195, 299], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "blue" },
            { name: "7", shape: "poly", coords: [0, 3, 45, 3, 53, 83, 70, 155, 80, 180, 90, 200, 100, 220, 110, 235, 120, 245, 130, 255, 140, 265, 160, 280, 0, 550], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "blue" },
            { name: "6", shape: "poly", coords: [600, 3, 553, 3, 545, 83, 534, 130, 520, 170, 490, 220, 445, 275, 600, 550], fillColor: "#4f2984", preFillColor: "rgba(52, 52, 52, 0.2)", strokeColor: "blue" },

        ]
    };


    const handleCourtOverlayClick = () => {
        //setIsShotPopupOpen(false);
        setIsPlayerSelectedforShot(false);
        setIsShotPopupOpen(false);
    };


    const handleCourtClick = (area) => {
        console.log(`Player ${area} clicked for shot`);
        setSelectedZone(area);
        setIsShotPopupOpen(true);
    }

    const courtClicked = (area) => {
        console.log(area);
        handleCourtClick(area.name);
    }

    const handleShotPopupClose = () => {
        setIsShotPopupOpen(false);
        setIsPlayerSelectedforShot(false);
    }


    // Example method signatures in the TempoPage component
    const onPlayerSelectForShot = (player) => {
        setIsPlayerSelectedforShot(true);
        setPlayer(player);
    };

    const onPlayerSelectForSub = (player) => {
        setSelectedPlayerForSub(player); // Set the player selected for substitution
        setIsPopupOpen(true); // Open the substitution popup
        setIsSub(true); // Assuming `isSub` is used to distinguish between different actions
    };

    const recordStats = (player, stat) => {
        console.log(`Recording ${stat} for player ${player.number}`);

        // Example: Submit the stat to the server
        const statData = {
            player_id: player.id,
            gameOrDrill_id: drillID,
            stat_type: stat,
            timestamp: new Date()
        };

        fetch(serverUrl + '/api/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statData)
        })
            .then(response => response.json())
            .then(data => console.log('Stat submitted:', data))
            .catch(error => console.error('Error submitting stat:', error));
    };


    return (
        <div className="drill-container">
            <div className="player-and-court-container">
                <div className="player-container">
                    <PlayerList
                        players={playersOnCourt}
                        onPlayerSelectForShot={onPlayerSelectForShot}
                        onPlayerSelectForSub={onPlayerSelectForSub}
                    />
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
                <div className="court-container">
                    <div style={{ position: "relative", width: '100%', height: '100%' }}>
                        <ImageMapper
                            src={basketballCourtVector}
                            map={MAP2}
                            width={600}
                            height={550}
                            lineWidth={5}
                            strokeColor={"white"}
                            onClick={courtClicked}
                        />
                        {isShotPopupOpen && isPlayerSelectedforShot && (
                            <>
                                <div className="Overlay" onClick={handleCourtOverlayClick}></div>
                                <ShotPopup
                                    isOpen={isShotPopupOpen}
                                    onClose={() => handleShotPopupClose()}
                                    gameOrDrill_id={null}
                                    onModel="Drill"
                                    player_id={player.id}
                                    zone={selectedZone}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="tempo-container">
                <TempoButton
                    tempoType="Defensive"
                    className={`TempoButton ${isTiming && tempoType !== 'defensive' ? 'disabled' : ''} ${isTiming && tempoType === 'defensive' ? 'stop' : 'start'}`}
                    isTiming={isTiming && tempoType === 'defensive'}
                    onClick={() => isTiming && tempoType === 'defensive' ? handleStopTempo('defensive') : startTempo('defensive')}
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
                    onClick={() => isTiming && tempoType === 'offensive' ? handleStopTempo('offensive') : startTempo('offensive')}
                    disabled={isTiming && tempoType !== 'offensive'}
                />
            </div>
        </div>
    );
}

export default DrillPage;