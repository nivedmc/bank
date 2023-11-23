import { createContext, useContext, useState , useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [firstname, setfirstname] = useState('');
  const [acntbalance, setbalance] = useState('');

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
  };
  const updatebalance = (newbalance) =>{
    setbalance(newbalance);
  }

  useEffect(() => {
    // Load user data from localStorage on component mount
    const storedUsername = localStorage.getItem('username');
    const storedBalance = localStorage.getItem('balance');

    if (storedUsername) {
      updateUsername(storedUsername);
    }

    if (storedBalance) {
      updatebalance(storedBalance); // Parse the balance as a float (or use parseInt if it's an integer)
    }
  }, []);

  useEffect(() => {
    // Save user data to localStorage whenever it changes
    localStorage.setItem('username', username);
    localStorage.setItem('balance', acntbalance);
  }, [username,acntbalance]);
  


  return (
    <UserContext.Provider value={{username, updateUsername, acntbalance, updatebalance}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
