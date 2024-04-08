import {useState,useContext, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [result, setRes] = useState([]);
    const [token,setToken] = useState(sessionStorage.getItem("site") || "");
    const navigate = useNavigate();
    const loginAction = async (data) => {
        try {
            
            if (data) {
                setUser(data.username);
                console.log(data.username);
                console.log(data.token);
                setToken(data.token);

                sessionStorage.setItem("site", data.token);

                console.log(token); // Use token here instead of data.token
            }
            else{
            throw new Error(data.message);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        sessionStorage.removeItem("site");
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