import {useState,useContext, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [result, setRes] = useState([]);
    const [token,setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    useEffect(() => {
        const FetchData = async () => {
            try
            {
            await fetch('http://localhost:3001/api/users')
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
                    setRes(formattedUser);
            })
            }
            catch (error) {
            console.error('Failed to fetch users:', error);  
            } 
            
        };
        FetchData();
    });
    const loginAction = async (data) => {
        try {
            console.log(result);
            const content = result.find(user => user.username === data.username && user.password === data.password)
            if (content) {
                setUser(content.username);
                setToken(content.token);
                localStorage.setItem("site", content.token);
                let path = '/homePage';
                navigate(path);
            }
            throw new Error(result.message);
        }
        catch(err)
        {
            console.log(err);
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        navigate('/');
    
    };
    return (<AuthContext.Provider value={{token, user, loginAction, logOut}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};