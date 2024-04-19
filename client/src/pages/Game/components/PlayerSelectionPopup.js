import React, { useEffect, useState } from "react";
import "./PlayerSelectionPopup.css";

const PlayerSelectionPopup = ({ onPlayerSelect }) => {
    const [players, setPlayers] = useState([]);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const handlePlayerSelect = (playerId) => {
        if (onPlayerSelect) {
            onPlayerSelect(playerId);
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(serverUrl + '/api/players');
                const players = await response.json();
                setPlayers(players);

            } catch (error) {
                console.error('Failed to fetch players:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="overlay">
            <div className="player-selection-popup">
                <h3> Select The Player </h3>
                <ul>
                    {players.map(player => (
                        <li key={player._id} onClick={() => handlePlayerSelect(player._id)}>
                            {[player.name, player.jersey_number].join(' - ')}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PlayerSelectionPopup;
