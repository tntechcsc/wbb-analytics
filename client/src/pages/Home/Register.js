import React, { useState } from 'react';

const Register = ({ isOpen, onClose }) => {
    const [giveRole, setGiveRole] = useState(false);
    const [role, setRole] = useState('');
    const [key, setKey] = useState('');
    const GiveKey = async (event) => {
      event.preventDefault();
      const data = {
        role: role,
      };
      const response = fetch('http://localhost:5000/api/keys/' + key, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const keyData = await response.json();
      if(!keyData.message){
        setKey(keyData.key);
        setGiveRole(true);
      }
    }    
    
    if(!isOpen) return null;
 
    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>X</button>
            <h2>Register</h2>
            {giveRole ? (
            <div>
              
                <label>What Role will the user have?</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Select">Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="User">User</option>
                </select>
                
                <button onClick={() => GiveKey()}>Submit</button>
              
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