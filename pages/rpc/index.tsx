import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useAuth } from 'AuthContext/';
import withAuth from 'components/HOCs/withAuthHOC';
import { Types } from 'mongoose';
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
const handleCreate = async (
  uid: Types.ObjectId,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
) => {
  socket.emit('create-room', { owner: uid, access: true });
};

const handleDelete = async (
  rid: Types.ObjectId,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
) => {
  socket.emit('delete-room', { rid });
};

const handleJoin = async (
  rid: Types.ObjectId,
  uid: Types.ObjectId,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
) => {
  socket.emit('join-room', { rid, uid });
};
const handleLeave = async (
  rid: Types.ObjectId,
  uid: Types.ObjectId,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
) => {
  socket.emit('leave-room', { rid, uid });
};

const Rpc: NextPage = () => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [data, setData] = useState<IRoomExt[]>();
  const [curRoom, setCurRoom] = useState<Types.ObjectId>();

  // Call Initialization func once
  useEffect(() => {
    socketInitializer(setSocket);
  }, []);

  // Each frame check for subscribed events to happen & upd Data
  useEffect(() => {
    if (socket) {
      let flag: Types.ObjectId | undefined;
      socket.on('get-rooms', (smth) => {
        const rooms = smth.rooms as IRoomExt[];
        flag = undefined;
        for (let i = 0; i < rooms.length; i++) {
          if (rooms[i].members?.indexOf(currentUser!._id) !== -1) {
            flag = rooms[i]._id;
            break;
          }
        }
        setCurRoom(flag);
        setData(rooms);
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
              <div key={String(room._id)}>
                <span>{String(room._id)}</span>
                <span>{room.members?.length || 0}/2</span>
                {(room._id !== curRoom)
                  ? <button disabled={!!curRoom} type="button" onClick={() => handleJoin(room._id, currentUser!._id, socket!)}>Join</button>
                  : <button type="button" onClick={() => handleLeave(room._id, currentUser!._id, socket!)}>Leave</button>}
                {(room.owner === currentUser!._id)
                  && (
                  <button
                    type="button"
                    onClick={() => handleDelete(room._id, socket!)}
                  >x
                  </button>
                  )}
              </div>
            ))}
            </div>
          ) : <div>No rooms available</div>}
      <Link href="/">
        Home
      </Link>
    </div>
  );
};

export default withAuth(Rpc);
