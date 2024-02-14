import players from "./playerData";


const StoredSessions = [
    {
        id: 1,
        session: 'Session 1',
        Drills: [
            {
            name: 'Drill 1',
            type: 'Shooting'
            },
        ],
        Team_A:['Players 1','Player 2','Player 3','Player 4','Player 5'],
        Team_B:['Player A','Player B','Player C','Player D','Player E'],
    },
    {
        id: 2,
        session: 'Session 2',
        Drills: [
            {
            name: 'Drill 4',
            type: 'Dilly Dally'
            },
            {
            name: 'Do-The-Mario',
            type: 'Intense'
            },
        ],
        Team_A:['Player A','Player B','Player C','Player D','Player E','Player 1'],
        Team_B:['Players 1','Player 2','Player 3','Player 4'],
    }
];
    export default StoredSessions;
