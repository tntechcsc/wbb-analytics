import React, { useEffect, useState } from "react";
import "./PlayerSelectionPopup.css";

const PlayerSelectionPopup = ({ onPlayerSelect, seasonId }) => {
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/seasons/${seasonId}`);
                const data = await response.json();

                if (data.players) {
                    setLoadingPlayers(true);

                    const playerDetails = await Promise.all(
                        data.players.map(playerId =>
                            fetch(`${serverUrl}/api/players/${playerId}`).then(res => res.json())
                        )
                    );
                    
                    setPlayers(playerDetails);
                    setLoadingPlayers(false);
                }
            } catch (error) {
                console.error('Failed to fetch season data:', error);
                setLoadingPlayers(false);
            }
        };
        if (seasonId) {
            fetchData();
        }
    }, [seasonId, serverUrl]);

    const handlePlayerSelect = (playerId) => {
        if (onPlayerSelect) {
            onPlayerSelect(playerId);
        }
    };

    return (
        <div className="overlay">
            <div className="player-selection-popup">
                <h3>Select The Player</h3>
                {loadingPlayers ? <p>Loading players...</p> : (
                    <ul>
                        {players.map(player => (
                            <li key={player._id} onClick={() => handlePlayerSelect(player._id)}>
                                {[player.name, player.jersey_number].join(' - ')}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default PlayerSelectionPopup;