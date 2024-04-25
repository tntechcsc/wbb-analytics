import React, { useEffect } from 'react';

const Players = ({ listA, setListA, listB, setListB, playerData, setPlayerData }) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(serverUrl + '/api/players');
                if (!response.ok) throw new Error('Failed to fetch players.');
                const data = await response.json();
                setPlayerData(data); // Assuming you use this to store player data elsewhere as well
                // Initialize teams with unique players
                if (data.length >= 10) {
                    setListA(data.slice(0, 5));
                    setListB(data.slice(5, 10));
                }
            } catch (error) {
                console.error('Failed to fetch players:', error);
            }
        };
        fetchData();
    }, [serverUrl, setPlayerData]);

    // This function will filter available players for a given team excluding players already assigned to any team
    const getAvailablePlayers = (currentTeam, otherTeam, currentPlayerId) => {
        return playerData.filter(p => 
            (p._id === currentPlayerId) || (!currentTeam.concat(otherTeam).find(player => player._id === p._id))
        );
    };

    const handlePlayerChange = (team, setTeam, index, event) => {
        const playerId = event.target.value;
        const player = playerData.find(p => p._id === playerId);

        const updatedTeam = team.map((item, i) => 
            i === index ? { ...item, playerName: player.name, _id: playerId } : item
        );
        setTeam(updatedTeam);
    };

    const handleAddPlayer = (setTeam, excludeTeam) => {
        const usedIds = new Set([...listA, ...listB].map(p => p._id));
        const availablePlayers = playerData.filter(p => !usedIds.has(p._id));
        if (availablePlayers.length > 0) {
            const newPlayer = availablePlayers[0];
            setTeam(team => [...team, { _id: newPlayer._id, playerName: newPlayer.name }]);
        } else {
            alert("No more available players to add.");
        }
    };

    const handleRemovePlayer = (team, setTeam, index) => {
        const updatedTeam = team.filter((_, i) => i !== index);
        setTeam(updatedTeam);
    };

    return (
        <>
            <div className="list">
                <h2>Team Purple</h2>
                <ul>
                    {listA.map((player, index) => (
                        <li key={index} className="player-selection">
                            <select
                                className='dropdown'
                                value={player._id}
                                onChange={(e) => handlePlayerChange(listA, setListA, index, e)}
                            >
                                {getAvailablePlayers(listA, listB, player._id).map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <button className="remove-player-button" onClick={() => handleRemovePlayer(listA, setListA, index)}>
                                Remove
                            </button>
                        </li>
                    ))}
                    <li>
                        <button className="add-dropdown-button" onClick={() => handleAddPlayer(setListA, listB)}>
                            Add Player
                        </button>
                    </li>
                </ul>
            </div>
            <div className="list">
                <h2>Team Gray</h2>
                <ul>
                    {listB.map((player, index) => (
                        <li key={index} className="player-selection">
                            <select
                                className='dropdown'
                                value={player._id}
                                onChange={(e) => handlePlayerChange(listB, setListB, index, e)}
                            >
                                {getAvailablePlayers(listB, listA, player._id).map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <button className="remove-player-button" onClick={() => handleRemovePlayer(listB, setListB, index)}>
                                Remove
                            </button>
                        </li>
                    ))}
                    <li>
                        <button className="add-dropdown-button" onClick={() => handleAddPlayer(setListB, listA)}>
                            Add Player
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Players;
