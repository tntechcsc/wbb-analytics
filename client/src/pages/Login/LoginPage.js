import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/AuthProvider';
import bcrypt from 'bcryptjs';
import './LoginPage.css';


const LoginPage = () => {
    let navigate = useNavigate();
    const auth = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUser,setErrorUser] = useState('');
    const [errorPass,setErrorPass] = useState('');
    const [errorKey,setErrorKey] = useState('');
    const [userKey, setUserKey] = useState('');
    const [incorrect,setIncorrect] = useState(false);
    const [isRegistering,setIsRegistering] = useState(false);

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        if (auth.token) {
          navigate('/homepage');
        }
      }, [auth.token]);
    
    const moveToRegister = () => {
        setUsername('');
        setPassword('');
        setIsRegistering(true);
    };
    const moveToLogin = () => {
        setUsername('');
        setPassword('');
        setUserKey('');
        setIsRegistering(false);
    };
    const handleRegister = async (event) => {

        var error = false;
        setErrorUser('');
        setErrorPass('');
        setErrorKey('');


        const saltRounds = 10;
        event.preventDefault();
        const regex = /[!?@#$%^&*()]/;
        const cap = /[A-Z]/;
        const low = /[a-z]/;
        if(username.length < 8)
        {
            console.log("visited");
            setErrorUser('Username is too short!');
            error = true;
        }
        if(password.length < 8)
        {
            setErrorPass('Password is too short!');
            error = true;
        }
        else if (!regex.test(password) || !cap.test(password) || !low.test(password)) {
            console.log(!regex.test(password));
            console.log(!cap.test(password));
            setErrorPass('Password does not contain characters like !?/& and/or a capital letter');
            error = true;

        }
        if(userKey === '')
        {
            setErrorKey('You need to enter a key');
            error = true;

        }
        if(error === false)
        {
            try {
            
            const userData = {
                username: username,
                password: password,
                key: userKey
            };
                

            const userResponse = await fetch(serverUrl + '/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
                
            const newUser = await userResponse.json();
            if(!newUser.message)
            {
            auth.loginAction({
                username: newUser.username,
                password: newUser.password,
                token: newUser.role,
            });
            navigate('/homepage');
            }
            else
            {
                if(newUser.user)
                {
                    setErrorUser(newUser.message);
                }
                else if(newUser.key)
                {
                    setErrorKey(newUser.message);
                }
                else
                {
                    setErrorUser(newUser.message0);
                    setErrorKey(newUser.message);
                }
                return;
            }
          
            
            } catch (error) {
                console.log(error);
                console.error(error);
            }
        }
    };

    const handleLogin = async (event) => {
        const saltRounds = 10;
        event.preventDefault();

        
        const loginResponse = await fetch(serverUrl + '/api/users/userCheck',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username, password: password}),

    })
    
        const loginData = await loginResponse.json();   
        if(loginData.message){
            setIncorrect(true);
        } else {
            auth.loginAction({username: loginData.username, password: loginData.password, token: loginData.role});
            navigate('/homepage');
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
                            <a className='error'>Incorrect Username or Password</a>
                        )}
                        <button type="submit">Submit</button>
                        <a className='switch' onClick={() => moveToRegister()}>Register here</a>
                    </form>
                    ) : (
                    <form onSubmit={handleRegister}>
                        <label>
                            Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </label>
                            <a className='error'>{errorUser}</a>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                            <a className='error'>{errorPass}</a>
                        <label>
                            UserKey:
                            <input type="text" value={userKey} onChange={(e) => setUserKey(e.target.value)} />
                        </label>
                            <a className='error'>{errorKey}</a>
                        <button type="submit">Submit</button>
                        <a className='switch' onClick={() => moveToLogin()}>Back to Login</a>
                    </form>
                    )}
                </div>
            </div>
    );
};

export default LoginPage;