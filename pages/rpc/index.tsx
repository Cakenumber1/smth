import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useAuth } from 'AuthContext/';
import withAuth from 'components/HOCs/withAuthHOC';
import type { NextPage } from 'next';
import Link from 'next/link';
import {
  Dispatch, SetStateAction,
  useEffect, useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { IRoomExt } from 'util/interfaces';

// Func to initialize bridge
const socketInitializer = async (
  setSocket: Dispatch<SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | null>>,
) => {
  await fetch('/api/rpc');
  setSocket(io());
};

// Func to send event of 'create-room' to io listener
const handleCreate = async (uid: string, socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  socket.emit('create-room', { owner: uid, access: true });
};

const Rpc: NextPage = () => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [data, setData] = useState<IRoomExt[]>();

  // Call Initialization func once
  useEffect(() => {
    socketInitializer(setSocket);
  }, []);

  // Each frame check for subscribed events to happen & upd Data
  useEffect(() => {
    if (socket) {
      socket.on('get-rooms', (smth) => {
        setData(smth.rooms as IRoomExt[]);
      });
    }
  });
  // todo: split
  return (
    <div>
      <button type="button" onClick={() => handleCreate(currentUser!._id, socket!)}>create room</button>
      {!data
        ? <div>loading</div>
        : (data && data.length)
          ? (
            <div>{data.map((room) => (
              <div key={room._id}>{room._id}</div>))}
            </div>
          ) : <div>No rooms available</div>}
      <Link href="/">
        Home
      </Link>
    </div>
  );
};

export default withAuth(Rpc);
