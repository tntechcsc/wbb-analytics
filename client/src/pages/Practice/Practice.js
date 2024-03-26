import React, { useState, useEffect } from 'react';
import './Practice.css';
import { View } from "react-native";
import { useNavigate } from 'react-router-dom';
import TabButton from '../../components/TabButton';
import DrillButtons from './components/DrillButtons';
import Players from './components/Players';
import SessionButtons from './components/SessionButtons';

const Practice = () => {
    
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Drills');
    const [SeasonData, setSeasonData] = useState([]);
    const [drills, setDrills] = useState([]);
    const [opponentTeam, setOpponentTeam] = useState('');
    const [date, setDate] = useState('');
    const [listA, setListA] = useState([]);
    const [listB, setListB] = useState([]);
    const [playerData, setPlayerData] = useState([]);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const handleSaveDrill = (customId) => {

        for (let i = 0; i < drills.length; i++) {
            const drillData = {
                practice_id: customId,
                name: drills[i].name,
                tempo_events: [],
                shot_events: [],
            };

            console.log(drillData);
            fetch(serverUrl + '/api/drills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(drillData),
            })
                .then(response => response.json())
                .then(data => console.log('Drill submitted:', data))
                .catch(error => console.error('Error submitting drill:', error));
        }
    };

    const handleSaveSession = async () => {
        const listIDA = listA.map(player => player._id);
        const listIDB = listB.map(player => player._id);
        const updatedDate = FindSeason(date, listIDA, listIDB);
        postSession(updatedDate || date);
        navigate('/drill');
    };
    

    const FindSeason = (date, listIDA, listIDB) => {

        if (!date) {
            const currentDate = new Date();
            date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        }
        
        const splitDate = date.split("-");
        const year = splitDate[0];
        const x = SeasonData.find(season => season.year === year)

        if (!x) {
            const seasonData = {
                year: year,
                players: listIDA.concat(listIDB),
            };
    
            fetch(serverUrl + '/api/seasons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(seasonData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Submitting Season', data);
                    postSession(data._id, date);
                })
                .catch(error => console.error('Error Submitting Season:', error));
        } else {
            const season = SeasonData.find(season => season.year === year);
            console.log(season);
            postSession(season.ID, date);
        }
    
        // Return the updated date
        return date;
    };

    const postSession = (sesData, date) => {

        if (!date) {
            const currentDate = new Date();
            date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        }

        else { date = date;}

        const listIDA = listA.map(player => player._id);
        const listIDB = listB.map(player => player._id);

        const sessionData = {
            season_id: sesData,
            date: date,
            //drills: drillIDS,
            team_purple: listIDA,
            team_gray: listIDB
        };

        //console.log('players: ', listIDA, listIDB)
    
        // Send POST request to save session data
        const respons = fetch(serverUrl + '/api/practices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        })
    
        .then(response => response.json())
        .then(data => {
            console.log('Session Submitted:', data);
            handleSaveDrill(data._id);
        })
    
        .catch(error => console.error('Error submitting Session:', error));
    
        // Handle successful response
        navigate('/drill');
    };
    

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        console.log(`Switched to ${tab} tab`);
    };
  
    return (
        <> 
            <div className="create-sessions-container">
                <div className="drills-column">
                    <View style={{ flexDirection: 'row' }}>
                        <TabButton text={"Drills"} onPress={() => handleTabClick('Drills')} active={activeTab === 'Drills'} />
                        <TabButton text={"Session Information"} onPress={() => handleTabClick('Session Information')} active={activeTab === "Session Information"} />
                    </View>

                    <div className="drill-buttons">
                        {activeTab === 'Drills' && (
                            <>
                                <h2>Drills</h2>
                                <DrillButtons drills={drills} setDrills={setDrills}/>
                            </>
                        )}
                    </div>

                    <div className="session-information">
                        {activeTab === 'Session Information' && (
                            <>
                                <h2>Session Information</h2>
                                <SessionButtons 
                                    setOpponentTeam={setOpponentTeam}
                                    setDate={setDate}
                                />

                                <div className='session-inputs'>
                                    {/*<h3> Opponent Team: {opponentTeam}</h3>*/}
                                    <h3> Date: {date}</h3>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="lists-column">
                    <Players listA={listA} setListA={setListA} listB={listB} setListB={setListB} playerData={playerData} setPlayerData={setPlayerData} />
                </div>

            </div>
            <button className="create-session-button" onClick={handleSaveSession}>
                Create Session
            </button>
        </>
    );
};

export default Practice;