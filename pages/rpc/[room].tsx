import withPrivateRoom from 'components/HOCs/withPrivateRoomHOC';
import type { NextPage } from 'next';

const Rpc: NextPage = () => {
  console.log(1);
  return (
    <div>
      <button type="button" onClick={() => console.log(123)}>createroom</button>
    </div>
  );
};

export default withPrivateRoom(Rpc);
