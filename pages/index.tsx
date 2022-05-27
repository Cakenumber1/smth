import { useAuth } from 'AuthContext';
import withAuth from 'components/HOCs/withAuthHOC';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const { logout, currentUser } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => logout()}>logout</button>
      <button type="button" onClick={() => console.log(currentUser)}>me</button>
    </div>
  );
};

export default withAuth(Home);
