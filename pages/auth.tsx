import { useAuth } from 'AuthContext';
import withoutAuth from 'components/HOCs/withoutAuthHOC';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';

const Home: NextPage = () => {
  const { login, signup, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const mailRef = useRef<HTMLInputElement>(null);
  if (loading) {
    return (
      <div>
        123
      </div>
    );
  }
  return (
    <div>
      <input type="text" ref={mailRef} />
      <button type="button" onClick={() => { setLoading(true); login(mailRef!.current!.value, 'qwerty123'); setLoading(false); }}>log</button>
      <button type="button" onClick={() => { setLoading(true); signup(mailRef!.current!.value, 'oleg', 'qwerty123'); setLoading(false); }}>reg</button>
      <button type="button" onClick={() => console.log(currentUser)}>me</button>
    </div>
  );
};

export default withoutAuth(Home);
