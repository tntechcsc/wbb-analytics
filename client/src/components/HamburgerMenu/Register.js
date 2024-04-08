import React, { useState } from 'react';
import './HamburgerMenu';
const Register = ({ isOpen, onClose }) => {
    const [giveRole, setGiveRole] = useState(false);
    const [role, setRole] = useState('');
    const [key, setKey] = useState('');
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const GiveKey = async () => {
      const data = {
        role: role,
      };
      console.log(data);
      fetch(serverUrl + '/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        if(!data.message){
          setKey(data.key);
          setGiveRole(true);
        }
      } )
      
      
    }    
    
    if(!isOpen) return null;
 
    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>X</button>
            <h2>Register</h2>
            {!giveRole ? (
            <div>
                <br/>
                <h4 style={{textAlign: 'left'}}>What Role will the user have?</h4>
                
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Select">Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="User">User</option>
                </select>
                <button className="submit-button" onClick={() => GiveKey()}>Submit</button>
              
            </div>
            ) : (
              <div>
                {/*show the key the user will recieve*/}
                <label>Your Key:</label>
                <input type="text" value={key} readOnly/>
              </div>  
            )}
          </div>
        </div>
      );
    }

export default Register;