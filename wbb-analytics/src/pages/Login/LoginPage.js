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
    const [incorrect,setIncorrect] = useState(false);
    const [hashPassword,setHashPassword] = useState('');
    
    useEffect(() => {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const FetchData = async () => {
            try
            {
            console.log(serverUrl);
            await fetch(serverUrl + '/api/users')
                .then(response => response.json())
                .then(data => {
                    const formattedUser = data.map(user => {
                        const Uname = user.username;
                        const Upassword = user.password;
                        const Utoken = user.token;
                        return {
                          username: Uname,
                          password: Upassword,
                          token: Utoken
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
    },[]);


    const handleLogin = (event) => {
        const saltRounds = 10;
        event.preventDefault();
        const content = users.find(user => user.username === username);
        console.log(content);
            bcrypt
                .compare(password,content.password)
                .then(res => {
                console.log(res)
                if(res === true)
                {
                auth.loginAction({username: username, password: content.password,token: content.token});
                return;
                }
            })
            .catch(err => console.error(err.message))
        
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