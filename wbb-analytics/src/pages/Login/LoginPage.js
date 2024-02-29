import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';


const LoginPage = () => {
    let navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        const FetchData = async () => {
        try
        {
        fetch('http://localhost:3001/api/users')
            .then(response => response.json())
            .then(data => {
                const formattedUser = data.map(user => {
                    const Uname = user.username;
                    const Upassword = user.password;
                    return {
                      username: Uname,
                      password: Upassword
                    }
                });
                setUsers(formattedUser);
        })
        }
        catch (error) {
        console.error('Failed to fetch users:', error);  
        } 
    };
    FetchData();
}, []);
    const handleLogin = (event) => {
        event.preventDefault();
        console.log('username:', username);
        console.log('password:', password);


        let path = '/homePage';
        navigate(path);
    }
    return(
            <div className="login-page-container">
                <div className="login-form">
                    <form onSubmit={handleLogin}>
                        <label>
                            Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
    );
};

export default LoginPage;