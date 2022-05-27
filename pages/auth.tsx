import { useAuth } from 'AuthContext';
import withoutAuth from 'components/HOCs/withoutAuthHOC';
import type { NextPage } from 'next';
import { useRef } from 'react';

const Home: NextPage = () => {
  const { login, signup, currentUser } = useAuth();
  const mailRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input type="text" ref={mailRef} />
      <button type="button" onClick={async () => login(mailRef!.current!.value, 'qwerty123')}>log</button>
      <button type="button" onClick={async () => signup(mailRef!.current!.value, 'oleg', 'qwerty123')}>reg</button>
      <button type="button" onClick={() => console.log(currentUser)}>me</button>
    </div>
  );
};

export default withoutAuth(Home);
