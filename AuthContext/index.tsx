import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';

type Props = {
  children: React.ReactNode;
};

type IAuth = {
  currentUser: IUser | null,
  login: (mail: string, password: string) => void,
  logout: () => void,
  signup: (mail: string, username: string, password: string) => void,
};

type IUser = {
  username: string,
  mail: string,
  _id: string,
  exp: number,
  iat: number
};

const AuthContext = React.createContext({} as IAuth);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(mail: string, username: string, password: string) {
    const res = await axios.post('/api/register/', { mail, username, password });
    if (res.status === 200) {
      window.localStorage.setItem('authToken', res.data);
      setCurrentUser(jwt.decode(res.data as string) as IUser);
    }
  }

  async function login(mail: string, password: string) {
    const res = await axios.post('/api/login/', { mail, password });
    if (res.status === 200) {
      window.localStorage.setItem('authToken', res.data);
      setCurrentUser(jwt.decode(res.data as string) as IUser);
    }
  }

  async function checkToken(token: string) {
    const res = await axios.post('/api/handshake/', { token });
    if (res.status === 200) {
      window.localStorage.setItem('authToken', res.data);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
    window.localStorage.removeItem('authToken');
  }

  useEffect(() => {
    if (window) {
      const token = window.localStorage.getItem('authToken');
      if (token) {
        const fetchData = async () => {
          const data = await checkToken(token);
          if (data) {
            setCurrentUser(jwt.decode(token) as IUser);
          }
          setLoading(false);
        };
        fetchData().catch(console.error);
      }
    }
  }, []);

  const value: IAuth = useMemo(() => ({
    currentUser,
    login,
    logout,
    signup,
  }), [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
