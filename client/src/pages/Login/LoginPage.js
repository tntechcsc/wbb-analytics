import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/AuthProvider';
import bcrypt from 'bcryptjs';
import './LoginPage.css';


const LoginPage = () => {
    let navigate = useNavigate();
    const auth = useAuth();
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userKey, setUserKey] = useState('');
    const [incorrect,setIncorrect] = useState(false);
    const [hashPassword,setHashPassword] = useState('');
    const [isRegistering,setIsRegistering] = useState(false);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const moveToRegister = () => {
        setIsRegistering(true);
    };
    const moveToLogin = () => {
        setIsRegistering(false);
    };
    const handleRegister = async (event) => {




        const saltRounds = 10;
        event.preventDefault();

        if(username === '' || password === '' || userKey === '')
        {
            return;
        }
        if(username.length < 8)
        {
            return;
        }
        if(password.length < 8)
        {
            return;
        }

        const keyResponse = await fetch(serverUrl + '/api/keys/' + userKey);
        const keyData = await keyResponse.json();
        
        if(keyData.message){
            setIncorrect(true);
            return;
        }

        const hash = await bcrypt.hash(password, saltRounds);
        setHashPassword(hash);
        const registerResponse = await fetch(serverUrl + '/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: hashPassword}),
        });
        const registerData = await registerResponse.json();
        auth.loginAction({username: registerData.username, password: registerData.password, token: registerData.roles});
    };
    const handleLogin = async (event) => {
        const saltRounds = 10;
        event.preventDefault();

        
        const loginResponse = await fetch(serverUrl + '/api/users/userCheck/' + username + '/' + password);
        const loginData = await loginResponse.json();    
        console.log(loginResponse);
        console.log(loginData);
        if(loginData.message){
            setIncorrect(true);
        } else {
            auth.loginAction({username: loginData.username, password: loginData.password, token: loginData.roles});
        }
        };
        
    return(
            <div className="login-page-container">
                <div className="login-form">
                    { !isRegistering ? ( 
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
                        <a onClick={() => moveToRegister()}>Register</a>
                    </form>
                    ) : (
                    <form onSubmit={handleRegister}>
                        <label>
                            Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <label>
                            UserKey:
                            <input type="text" value={userKey} onChange={(e) => setUserKey(e.target.value)} />
                        </label>
                        {incorrect === true && (
                            <a>Incorrect Key</a>
                        )}
                        <button type="submit">Submit</button>
                        <a onClick={() => moveToLogin()}>Login</a>
                    </form>
                    )}
                </div>
            </div>
    );
};

export default LoginPage;