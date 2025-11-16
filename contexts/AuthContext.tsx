
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  isLocked: boolean;
  pinExists: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  setPin: (pin: string) => void;
  changePin: (oldPin: string, newPin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedPin, setStoredPin] = useLocalStorage<string | null>('app-pin', null);
  const [isLocked, setIsLocked] = useState(!!storedPin);

  const pinExists = storedPin !== null;

  const login = useCallback((pin: string) => {
    if (pin === storedPin) {
      setIsLocked(false);
      return true;
    }
    return false;
  }, [storedPin]);

  const logout = useCallback(() => {
    setIsLocked(true);
  }, []);

  const setPin = useCallback((pin: string) => {
    setStoredPin(pin);
    setIsLocked(false); // Unlock after setting pin for the first time
  }, [setStoredPin]);
  
  const changePin = useCallback((oldPin: string, newPin: string) => {
      if (oldPin === storedPin) {
          setStoredPin(newPin);
          return true;
      }
      return false;
  }, [storedPin, setStoredPin]);

  return (
    <AuthContext.Provider value={{ isLocked, pinExists, login, logout, setPin, changePin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
