import { useAuth } from 'AuthContext/';
import axios from 'axios';
import withPrivateRoom from 'components/HOCs/withPrivateRoomHOC';
import type { NextPage } from 'next';
import Link from 'next/link';

const handleCreate = async (uid: string) => {
  const res = await axios.post('/api/rpc/', { owner: uid });
  console.log(res);
};

const Rpc: NextPage = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => handleCreate(currentUser!._id)}>createroom</button>
      <Link href="/">
        Home
      </Link>
    </div>
  );
};

export default withPrivateRoom(Rpc);
