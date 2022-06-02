import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { IUser } from 'util/interfaces';

type Props = {
  children: React.ReactNode;
};

type IUserExt = IUser & { _id: Types.ObjectId };

type IAuth = {
  currentUser: IUserExt | null,
  login: (mail: string, password: string) => Promise<void>,
  logout: () => void,
  signup: (mail: string, username: string, password: string) => Promise<void>,
};

const AuthContext = React.createContext({} as IAuth);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUserExt | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(mail: string, username: string, password: string) {
    const res = await axios.post('/api/register/', { mail, username, password });
    if (res.status === 200) {
      window.localStorage.setItem('authToken', res.data);
      setCurrentUser(jwt.decode(res.data as string) as IUserExt);
    }
  }

  async function login(mail: string, password: string) {
    const res = await axios.post('/api/login/', { mail, password });
    if (res.status === 200) {
      window.localStorage.setItem('authToken', res.data);
      setCurrentUser(jwt.decode(res.data as string) as IUserExt);
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
          try {
            const data = await checkToken(token);
            if (data) {
              setCurrentUser(jwt.decode(token) as IUserExt);
            }
          } catch (e) {
            console.error(e);
          }
        };
        fetchData().finally(() => setLoading(false));
      } else {
        setLoading(false);
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
