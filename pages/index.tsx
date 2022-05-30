import { useAuth } from 'AuthContext';
import withAuth from 'components/HOCs/withAuthHOC';
import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  const { logout, currentUser } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => logout()}>logout</button>
      <button type="button" onClick={() => console.log(currentUser)}>me</button>
      <Link href="/rpc/">
        RPC
      </Link>
    </div>
  );
};

export default withAuth(Home);
