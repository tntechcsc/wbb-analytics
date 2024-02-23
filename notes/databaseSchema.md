### Season Collection

- **id**: `mongo object id`
- **seasonYear**: `string`
- **gameSessions**: `[mongo object id]` (array of mongo ids that are from the GameSession Collection)
- **practiceSessions**: `[mongo object id]` (array of mongo ids that are from the PracticeSession Collection)


### GameSession Collection

- **id**: `mongo object id`
- **Date**: `DateTime`
- **oppTeam**: `string` (opponent team name)
- **tempoIDs**: `[mongo object id]` (array of mongo id's that are from the tempos collection)
- **shotIDs**: `[mongo object id]` (array of mongo id's that are from the shot collection)

### PracticeSession Collection

- **id**: `mongo object id`
- **Date**: `DateTime`
- **Drills**: `[mongo object id]` (array of mongo object id's that are from the drills collection)

## Drills Collection

- **id**: `mongo object id`
- **Name**: `string`
- **tempoIDs**: `[mongo object id]` (array of mongo id's that are from the tempo collectoin)
- **shotIDs**: `[mongo object id]` (arry of mongo id's that are from the shot collection)

### Tempos Collection

- **id**: `mongo object id`
- **playersOnCourt**: `[mongo object id]` (array of 5 mongo id's that are from the players collection)
- **offensiveTempo**: `time` (number in seconds and milliseconds)
- **defensiveTempo**: `time` (number in seconds and milliseconds)

### Players Collection

- **id**: `mongo object id`
- **Name**: `string`
- **Position**: `string`
- **jerseyNumber**: `int`
- **playerImage**: `string`

### Shot Collectoin

- **id**: `mongo object id`
- **playerID**: `mongo object id` (id of the player who took the shot)
- **shotZone** : `int` (zone that the shot was made/missed in)
- **madeMissed**: `bool` (true if made, false if missed)
- **shotClock**: `int` (indicates which third of the shot clock the shot was taken)
