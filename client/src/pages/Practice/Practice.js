import React, { useState, useEffect } from 'react';
import './Practice.css';
import { View } from "react-native";
import { useNavigate } from 'react-router-dom';
import TabButton from '../../components/TabButton';
import DrillButtons from './components/DrillButtons';
import Players from './components/Players';
import SessionButtons from './components/SessionButtons';
import { get, set } from 'js-cookie';

const Practice = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Drills');
    const [SeasonData, setSeasonData] = useState([]);
    const [SessionData, setSessionData] = useState([]);
    const [drills, setDrills] = useState([]);
    const [opponentTeam, setOpponentTeam] = useState('');
    const [date, setDate] = useState('');
    const [listA, setListA] = useState([]);
    const [listB, setListB] = useState([]);
    const [playerData, setPlayerData] = useState([]);
    const serverUrl = process.env.REACT_APP_SERVER_URL;


    useEffect(() => {
        const handleCreatePractice = async () => {
            try {
                const response = await fetch(serverUrl + '/api/seasons');
                const data = await response.json();
                setSeasonData(data);
            } catch (error) {
                console.error('Error fetching season data:', error);
            }
    
            const currentDate = new Date();
            const newDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            setDate(newDate); // This ensures that the `date` state is updated correctly.
    
            // Since SeasonData might not be populated yet, defer this operation until after the state is set.
        };
    
        handleCreatePractice();
    }, []);
    
    useEffect(() => {
        // This effect depends on SeasonData and date, so it runs after they are set.
        if (SeasonData.length > 0 && date) {
            const seasonByDate = getSeasonByDate(date);
            // Only attempt to create a practice session if a season is found.
            if (seasonByDate) {
                const practiceData = {
                    season_id: seasonByDate._id,
                    date: date,
                };
    
                const createPracticeSession = async () => {
                    console.log(serverUrl);
                    try {
                        const response = await fetch(serverUrl + '/api/practices', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(practiceData),
                        });
                        const data = await response.json();
                        setSessionData(data);
                    } catch (error) {
                        console.error('Error creating practice:', error);
                    }
                };
    
                createPracticeSession();
            }
        }
    }, [SeasonData, date]); // Add SeasonData and date as dependencies


    const updatePractice = async () => {

        const seasonByDate = getSeasonByDate(date);

        const practiceData = {
            season_id: seasonByDate._id,
            date: date,
            drills: drills.map(drill => drill._id),
            team_purple: listA.map(player => player._id),
            team_gray: listB.map(player => player._id),
        };

        try {
            const response = await fetch(serverUrl + `/api/practices/${SessionData._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(practiceData),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedPractice = await response.json();
            console.log('Practice updated successfully:', updatedPractice);
        } catch (error) {
            console.error('Failed to update practice:', error);
        }


    }

    const getSeasonByDate = (date) => {
        const splitDate = date.split("-");
        const year = splitDate[0];
        const seasonByDate = SeasonData.find(season => season.year === year)

        return seasonByDate;
    };

    const addDrill = async (drill) => {

        const drillData = {
            name: drill.name,
            practice_id: SessionData._id,
        };

        try {
            const response = await fetch(serverUrl + '/api/drills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(drillData),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newDrill = await response.json();
            setDrills(currentDrills => [...currentDrills, newDrill]);
            console.log('Drill added successfully:', newDrill);
        } catch (error) {
            console.error('Failed to add drill:', error);
        }
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
                                <DrillButtons drills={drills} setDrills={setDrills} onAddDrill={addDrill} practiceID={SessionData._id} />
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
            <button className="create-session-button" onClick={updatePractice}>
                Save Session
            </button>
        </>
    );
};

export default Practice;