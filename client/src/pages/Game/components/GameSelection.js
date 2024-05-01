import React, { useState, useEffect } from 'react';

const GameSelection = ({ onSelectGame }) => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/games`);
                const data = await response.json();

                // Oldest - Newest (Ascending)
                // const sortedGames = data.sort((a, b) => new Date(a.date) - new Date(b.date));

                // Newest - Oldest (Descending)
                const sortedGames = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setGames(sortedGames);

            } catch (error) {
                console.error('Failed to fetch games:', error);
            }
            setIsLoading(false);
        };

        fetchGames();
    }, []);

    return (
        <div className="game-selection-container">
            <h3 style={{ color: '#503291', fontWeight: 'bold' }}> Select Game To Load </h3>
                {isLoading ? <p style={{ color: '#503291', fontWeight: 'bold' }}> Loading Games </p> : (
                    games.length > 0 ? (
                        <ul>
                            {games.map(game => (
                                <li key={game._id} className="game-entry" onClick={() => onSelectGame(game)}>
                                    {game.opponent} - {new Date(game.date).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    ) : <p style={{ color: '#503291', fontWeight: 'bold' }}> No games available to load. </p>
                )}
        </div>
    );
};

export default GameSelection;
