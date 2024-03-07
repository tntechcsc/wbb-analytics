import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/AuthProvider';
import './LoginPage.css';


const LoginPage = () => {
    let navigate = useNavigate();
    const auth = useAuth();
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect,setIncorrect] = useState(false);


    const handleLogin = (event) => {
        event.preventDefault();
        if(username !== "" && password !== "")
        {
        auth.loginAction({username: username, password: password});
        return;
        }
        setIncorrect(true);
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
                        {incorrect === true && (
                            <a>Incorrect Username or Password</a>
                        )}
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
    );
};

export default LoginPage;