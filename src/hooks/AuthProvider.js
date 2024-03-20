import {useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [result, setRes] = useState([]);
    const [token,setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    const loginAction = async (data) => {
        try {
            
            if (data) {
                setUser(data.username);
                setToken(data.token);
                localStorage.setItem("site", data.token);
                let path = '/homePage';
                navigate(path);
            }
            throw new Error(data.message);
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
