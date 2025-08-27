// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  // Persist user to AsyncStorage whenever it changes
  const handleSetUser = async (newUser: any) => {
    setUser(newUser);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
};
