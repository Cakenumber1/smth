import { useAuth } from 'AuthContext';
import withoutAuth from 'components/HOCs/withoutAuthHOC';
import type { NextPage } from 'next';
import {
  Dispatch, SetStateAction, useRef, useState,
} from 'react';

const handleLogin = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  login: (mail: string, password: string) => Promise<void>,
  mail: string,
  password: string,
) => {
  setLoading(true);
  login(mail, password).finally(() => setLoading(false));
};

const handleRegister = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  signup: (mail: string, username: string, password: string) => Promise<void>,
  mail: string,
  username: string,
  password: string,
) => {
  setLoading(true);
  signup(mail, username, password).finally(() => setLoading(false));
};

const Home: NextPage = () => {
  const { login, signup, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const mailRef = useRef<HTMLInputElement>(null);
  if (loading) {
    return (
      <div>
        loader
      </div>
    );
  }
  return (
    <div>
      <input type="text" ref={mailRef} />
      <button type="button" onClick={() => handleLogin(setLoading, login, mailRef!.current!.value, 'qwerty123')}>log
      </button>
      <button
        type="button"
        onClick={() => handleRegister(setLoading, signup, mailRef!.current!.value, 'oleg', 'qwerty123')}
      >reg
      </button>
      <button type="button" onClick={() => console.log(currentUser)}>me</button>
    </div>
  );
};

export default withoutAuth(Home);
